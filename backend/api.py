#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Flask API for Moroccan Plate Detection & Recognition

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import cv2
import numpy as np
import base64
from werkzeug.utils import secure_filename
from datetime import datetime
import tempfile

# Import existing detection and OCR modules
from detection import PlateDetector
from ocr import PlateReader
from utility import enum
import arabic_reshaper
from bidi.algorithm import get_display
import json # Added for loading metrics

# Define OCR modes enum
OCR_MODES = enum('TRAINED', 'TESSERACT')

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = './tmp'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max size

# Initialize detector and reader models
detector = PlateDetector()
detector.load_model("./weights/detection/yolov3-detection_final.weights", 
                   "./weights/detection/yolov3-detection.cfg")

reader = PlateReader()
reader.load_model("./weights/ocr/yolov3-ocr_final.weights", 
                 "./weights/ocr/yolov3-ocr.cfg")

# Helper functions
def base64_encode_image(image_path):
    """Convert image to base64 string"""
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

def save_file_from_request(request_file):
    """Save uploaded file to disk"""
    filename = secure_filename(request_file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}")
    request_file.save(filepath)
    return filepath

def save_base64_image(base64_string, prefix="image"):
    """Save base64 image to disk"""
    try:
        # Remove header if it exists
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
        
        # Decode base64 string
        image_data = base64.b64decode(base64_string)
        
        # Create a temporary file
        fd, filepath = tempfile.mkstemp(prefix=prefix, suffix=".jpg", dir=app.config['UPLOAD_FOLDER'])
        with open(filepath, 'wb') as f:
            f.write(image_data)
        os.close(fd)
        
        return filepath
    except Exception as e:
        app.logger.error(f"Error saving base64 image: {str(e)}")
        return None

@app.route('/', methods=['GET'])
def home():
    return '''<h1>Moroccan Plate Detection & Recognition API</h1>
           <p>Available endpoints:</p>
           <ul>
             <li><code>GET /health</code> - Health check</li>
             <li><code>POST /detect</code> - Detect license plate in image</li>
             <li><code>POST /ocr</code> - Perform OCR on plate image</li>
           </ul>
           <p><strong>IMPORTANT:</strong> /detect and /ocr endpoints only accept POST requests with either form data or JSON payload.</p>'''

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "message": "Moroccan Plate Detection & Recognition API is running"
    })

@app.route('/detect', methods=['POST', 'GET'])
def detect_plate():
    """
    Detect license plate in an image
    
    Expects:
    - 'image': file upload or base64 encoded image
    
    Returns:
    - JSON with detection results including:
      - original_image: base64 encoded original image
      - detection_image: base64 encoded image with plate box drawn
      - plate_image: base64 encoded crop of the detected plate
      - status: success or error message
    """
    # Handle incorrect method
    if request.method == 'GET':
        return jsonify({
            "error": "Method Not Allowed", 
            "message": "This endpoint requires a POST request with an image. See API documentation for details.",
            "expected_payload": {
                "option1": "multipart/form-data with 'image' file field",
                "option2": "application/json with 'image' field containing base64 encoded image"
            }
        }), 405
    try:
        image_path = None
        
        # Check if the request has a file part
        if 'image' in request.files:
            file = request.files['image']
            if file.filename != '':
                image_path = save_file_from_request(file)
        # Check if the request has base64 image
        elif request.json and 'image' in request.json:
            image_path = save_base64_image(request.json['image'])
        else:
            return jsonify({"error": "No image provided"}), 400
        
        if not image_path:
            return jsonify({"error": "Failed to process image"}), 400
        
        # Detection
        image, height, width, channels = detector.load_image(image_path)
        blob, outputs = detector.detect_plates(image)
        boxes, confidences, class_ids = detector.get_boxes(outputs, width, height, threshold=0.3)
        plate_img, LpImg = detector.draw_labels(boxes, confidences, class_ids, image)
        
        response = {
            "status": "success",
            "detection": []
        }
        
        # Save result images
        detection_file = os.path.join(app.config['UPLOAD_FOLDER'], "car_detection.jpg")
        cv2.imwrite(detection_file, plate_img)
        
        # Add base image and detection image to response
        response["original_image"] = base64_encode_image(image_path)
        response["detection_image"] = base64_encode_image(detection_file)
        
        # Process detected plates
        if len(LpImg):
            for i, plate in enumerate(LpImg):
                plate_file = os.path.join(app.config['UPLOAD_FOLDER'], f"plate_{i}.jpg")
                cv2.imwrite(plate_file, plate)
                
                plate_data = {
                    "plate_index": i,
                    "plate_image": base64_encode_image(plate_file)
                }
                response["detection"].append(plate_data)
        else:
            response["status"] = "no_plate_detected"
        
        return jsonify(response)
    
    except Exception as e:
        app.logger.error(f"Error in plate detection: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/ocr', methods=['POST', 'GET'])
def read_plate():
    """
    Perform OCR on license plate image
    
    Expects:
    - 'plate_image': file upload or base64 encoded image of plate
    - 'lang' (optional): language for OCR - 'eng' or 'ara'
    
    Returns:
    - JSON with OCR results including:
      - plate_text: recognized text from the plate
      - segmented_image: base64 encoded image showing character segmentation
    """
    # Handle incorrect method
    if request.method == 'GET':
        return jsonify({
            "error": "Method Not Allowed", 
            "message": "This endpoint requires a POST request with a plate image. See API documentation for details.",
            "expected_payload": {
                "option1": "multipart/form-data with 'plate_image' file field and optional 'lang' field",
                "option2": "application/json with 'plate_image' field containing base64 encoded image and optional 'lang' field"
            }
        }), 405
    try:
        image_path = None
        lang = request.form.get('lang', 'eng') if request.form else request.json.get('lang', 'eng') if request.json else 'eng'
        
        # Check if the request has a file part
        if 'plate_image' in request.files:
            file = request.files['plate_image']
            if file.filename != '':
                image_path = save_file_from_request(file)
        # Check if the request has base64 image
        elif request.json and 'plate_image' in request.json:
            image_path = save_base64_image(request.json['plate_image'], prefix="plate")
        else:
            return jsonify({"error": "No plate image provided"}), 400
        
        if not image_path:
            return jsonify({"error": "Failed to process plate image"}), 400
        
        # OCR
        image, height, width, channels = reader.load_image(image_path)
        blob, outputs = reader.read_plate(image)
        boxes, confidences, class_ids = reader.get_boxes(outputs, width, height, threshold=0.3)
        segmented, plate_text = reader.draw_labels(boxes, confidences, class_ids, image)
        
        # If no text detected with YOLO, try tesseract if requested
        if not plate_text and lang:
            try:
                # import pytesseract # Commented out due to potential import issues
                # plate_text = pytesseract.image_to_string(image, lang=lang) # Commented out
                # plate_text = plate_text.strip() # Commented out
                app.logger.info("Pytesseract OCR fallback is currently commented out.") # Added info
            except Exception as e:
                app.logger.warning(f"Tesseract OCR failed: {str(e)}")
        
        # Format text with arabic reshaper if needed
        if plate_text and lang == 'ara':
            try:
                plate_text = arabic_reshaper.reshape(plate_text)
                plate_text = get_display(plate_text)
            except Exception as e:
                app.logger.warning(f"Arabic text formatting failed: {str(e)}")
        
        # Save segmented image
        segmented_file = os.path.join(app.config['UPLOAD_FOLDER'], "plate_segmented.jpg")
        cv2.imwrite(segmented_file, segmented)
        
        response = {
            "status": "success",
            "plate_text": plate_text if plate_text else "",
            "segmented_image": base64_encode_image(segmented_file)
        }
        
        return jsonify(response)
    
    except Exception as e:
        app.logger.error(f"Error in OCR: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Legacy endpoint (keeping for backward compatibility)
@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        # Check if an image is included in the request
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400

        uploaded_image = request.files['image']
        image_path = save_file_from_request(uploaded_image)
        
        # Detection
        image, height, width, channels = detector.load_image(image_path)
        blob, outputs = detector.detect_plates(image)
        boxes, confidences, class_ids = detector.get_boxes(outputs, width, height, threshold=0.3)
        plate_img, LpImg = detector.draw_labels(boxes, confidences, class_ids, image)
        
        plate_text = ""
        if len(LpImg):
            cv2.imwrite('./tmp/car_box.jpg', plate_img)
            cv2.imwrite('./tmp/plate_box.jpg', LpImg[0])
            
            # OCR
            image, height, width, channels = reader.load_image('./tmp/plate_box.jpg')
            blob, outputs = reader.read_plate(image)
            boxes, confidences, class_ids = reader.get_boxes(outputs, width, height, threshold=0.3)
            segmented, plate_text = reader.draw_labels(boxes, confidences, class_ids, image)
            cv2.imwrite('./tmp/plate_segmented.jpg', segmented)
            
            # Format text with arabic reshaper if needed
            if plate_text:
                plate_text = arabic_reshaper.reshape(plate_text)
        
        return jsonify({"result": plate_text if plate_text else "No plate detected"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fix pour l'erreur d'indentation dans la route /ocr
@app.route('/test_detect', methods=['GET'])
def test_detect_form():
    """Page de test pour l'endpoint /detect"""
    return '''
    <html>
        <head><title>Test /detect Endpoint</title></head>
        <body>
            <h1>Test de l'endpoint /detect</h1>
            <form action="/detect" method="post" enctype="multipart/form-data">
                <label>Sélectionnez une image:</label>
                <input type="file" name="image" accept="image/*"><br><br>
                <button type="submit">Détecter la plaque</button>
            </form>
        </body>
    </html>
    '''

@app.route('/test_ocr', methods=['GET'])
def test_ocr_form():
    """Page de test pour l'endpoint /ocr"""
    return '''
    <html>
        <head><title>Test /ocr Endpoint</title></head>
        <body>
            <h1>Test de l'endpoint /ocr</h1>
            <form action="/ocr" method="post" enctype="multipart/form-data">
                <label>Sélectionnez une image de plaque:</label>
                <input type="file" name="plate_image" accept="image/*"><br><br>
                <label>Langue (optionnel):</label>
                <select name="lang">
                    <option value="eng">Anglais/Chiffres (eng)</option>
                    <option value="ara">Arabe (ara)</option>
                </select><br><br>
                <button type="submit">Effectuer OCR</button>
            </form>
        </body>
    </html>
    '''

# Renamed from /metrics to /api/metrics
@app.route('/api/metrics', methods=['GET']) 
def get_model_metrics_api(): # Renamed function to avoid conflict if old one is cached/used elsewhere
    """
    Returns performance metrics for detection and OCR models.
    Currently returns mock data structured for MetricsDashboard.tsx.
    TODO: Implement loading from JSON/PKL or live calculation.
    """
    # Mock data structure based on MetricsDashboard.tsx and user's example values
    mock_detection_metrics = {
        "accuracy": 0.94,  # From user example
        "precision": 0.95, # From user example
        "recall": 0.93,    # From user example
        "f1_score": 0.94,  # From user example
        "fps": 30, # Example value
        "confusion_matrix": [[51, 3], [2, 44]], # From user example
        "roc_curve": {"fpr": [0.0, 0.1, 0.25, 0.5, 1.0], "tpr": [0.0, 0.7, 0.85, 0.95, 1.0], "auc": 0.97}, # AUC from user example
        "processing_times": [10, 12, 11, 13, 10, 14, 12] # Example value
    }
    mock_ocr_metrics = {
        "accuracy": 0.88,
        "precision": 0.87,
        "recall": 0.86,
        "f1_score": 0.865,
        "character_accuracy": 0.92, # Example value
        "processing_times": [100, 110, 105, 112, 108] # Example value
    }

    metrics_data = {
        "detection": mock_detection_metrics,
        "ocr": mock_ocr_metrics
    }
    
    # Placeholder for loading from files (e.g., backend/weights/detection/detection_metrics.json)
    # base_dir = os.path.dirname(os.path.abspath(__file__))
    # detection_metrics_path = os.path.join(base_dir, "weights", "detection", "detection_metrics.json")
    # ocr_metrics_path = os.path.join(base_dir, "weights", "ocr", "ocr_metrics.json")
    # app.logger.info(f"Attempting to load detection metrics from: {detection_metrics_path}")
    # try:
    #     if os.path.exists(detection_metrics_path):
    #         with open(detection_metrics_path, \'r\') as f:
    #             # Update metrics_data["detection"] with loaded data, ensuring keys match
    #             pass # Replace with actual loading and validation
    #         app.logger.info("Detection metrics loaded.")
    #     else:
    #         app.logger.warn(f"Detection metrics file not found. Using mock data.")
    # except Exception as e:
    #     app.logger.error(f"Error loading detection metrics: {str(e)}. Using mock data.")

    # app.logger.info(f"Attempting to load OCR metrics from: {ocr_metrics_path}")
    # try:
    #     if os.path.exists(ocr_metrics_path):
    #         with open(ocr_metrics_path, \'r\') as f:
    #             # Update metrics_data["ocr"] with loaded data, ensuring keys match
    #             pass # Replace with actual loading and validation
    #         app.logger.info("OCR metrics loaded.")
    #     else:
    #         app.logger.warn(f"OCR metrics file not found. Using mock data.")
    # except Exception as e:
    #     app.logger.error(f"Error loading OCR metrics: {str(e)}. Using mock data.")

    # Placeholder for live calculation if files don't exist
    # if not files_loaded_successfully:
    #    app.logger.info("Metrics files not found, placeholder for live calculation on ./data/test/")
    #    # metrics_data = calculate_metrics_on_test_set("./data/test/") # Implement this function

    return jsonify(metrics_data)

@app.route('/upload_video', methods=['POST'])
def upload_video():
    """
    Upload and process a video file for plate detection and OCR frame by frame.
    Expects:
    - 'video': file upload (mp4, avi, ...)
    Returns:
    - JSON with detection results (first frame with plate, or summary)
    """
    try:
        if 'video' not in request.files:
            return jsonify({'status': 'error', 'message': 'No video file provided'}), 400
        video_file = request.files['video']
        video_path = save_file_from_request(video_file)
        cap = cv2.VideoCapture(video_path)
        frame_count = 0
        detection_image = None
        original_image = None
        plate_images = []
        found = False
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame_count += 1
            # Process every N frames or all (for demo, every 10th frame)
            if frame_count % 10 != 1:
                continue
            # Save temp frame
            temp_frame_path = os.path.join(app.config['UPLOAD_FOLDER'], f"video_frame_{frame_count}.jpg")
            cv2.imwrite(temp_frame_path, frame)
            # Detection
            image, height, width, channels = detector.load_image(temp_frame_path)
            blob, outputs = detector.detect_plates(image)
            boxes, confidences, class_ids = detector.get_boxes(outputs, width, height, threshold=0.3)
            plate_img, LpImg = detector.draw_labels(boxes, confidences, class_ids, image)
            if len(LpImg):
                # Save annotated frame and first plate(s)
                detection_file = os.path.join(app.config['UPLOAD_FOLDER'], f"video_detection_{frame_count}.jpg")
                cv2.imwrite(detection_file, plate_img)
                detection_image = base64_encode_image(detection_file)
                original_image = base64_encode_image(temp_frame_path)
                for i, plate in enumerate(LpImg):
                    plate_file = os.path.join(app.config['UPLOAD_FOLDER'], f"video_plate_{frame_count}_{i}.jpg")
                    cv2.imwrite(plate_file, plate)
                    plate_images.append(base64_encode_image(plate_file))
                found = True
                break  # Stop at first detection for demo
        cap.release()
        if not found:
            return jsonify({'status': 'no_plate_detected'}), 200
        return jsonify({
            'status': 'success',
            'detection_image': detection_image,
            'original_image': original_image,
            'plate_images': plate_images
        })
    except Exception as e:
        app.logger.error(f"Error in video upload: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
