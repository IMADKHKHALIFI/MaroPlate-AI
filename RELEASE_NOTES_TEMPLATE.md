# Release Notes Template for AI Models

## 🤖 Moroccan License Plate Detection - AI Models v1.0

This release contains the trained AI model weights for the Moroccan License Plate Detection System.

### 📦 What's Included

#### Detection Model
- **File**: `yolov3-detection_final.weights` (234.90 MB)
- **Config**: `yolov3-detection.cfg`
- **Purpose**: Detects and localizes license plates in images
- **Architecture**: YOLOv3
- **Training Dataset**: Moroccan license plates
- **Performance**: ~95% detection accuracy

#### OCR Model  
- **File**: `yolov3-ocr_final.weights` (235.22 MB)
- **Config**: `yolov3-ocr.cfg`
- **Purpose**: Recognizes Arabic and Latin characters from detected plates
- **Architecture**: YOLOv3 for character detection + classification
- **Supported Characters**: 
  - Numbers: 0-9
  - Arabic letters: ا، ب، ت، ث، ج، ح، خ، د، ذ، ر، ز، س، ش، ص، ض، ط، ظ، ع، غ، ف، ق، ك، ل، م، ن، ه، و، ي
  - Region codes: 1-89

### 🚀 Quick Setup

1. **Download this release**
2. **Extract files to your project:**
   ```
   backend/weights/
   ├── detection/
   │   ├── yolov3-detection_final.weights
   │   └── yolov3-detection.cfg
   └── ocr/
       ├── yolov3-ocr_final.weights
       └── yolov3-ocr.cfg
   ```
3. **Run setup script:**
   ```bash
   python setup_models.py check
   ```

### 📊 Model Specifications

| Model | Size | Input | Output | Accuracy |
|-------|------|-------|---------|----------|
| Detection | 234MB | 416x416 RGB | Bounding boxes | ~95% |
| OCR | 235MB | Segmented chars | Character class | ~92% |

### 🔧 Technical Details

- **Framework**: Darknet/OpenCV
- **Training**: Transfer learning from COCO pre-trained weights
- **Dataset**: 5000+ annotated Moroccan license plate images
- **Augmentation**: Rotation, scaling, brightness, contrast
- **Validation**: 80/20 train/validation split

### 📋 System Requirements

- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 500MB free space for models
- **Python**: 3.8+
- **OpenCV**: 4.8+
- **NumPy**: Latest version

### 🐛 Known Issues

- Performance may vary with very low lighting conditions
- Damaged or heavily occluded plates may have reduced accuracy
- Requires good image quality for optimal results

### 🆕 Version History

- **v1.0**: Initial release with detection and OCR models
- Trained on Moroccan license plate dataset
- Optimized for real-world conditions

### 📞 Support

If you encounter issues with the models:
1. Check the [README](https://github.com/IMADKHKHALIFI/MaroPlate-AI/blob/master/README.md)
2. Run `python setup_models.py check` to verify installation
3. Open an issue on GitHub with error details

### 📄 License

These models are released under the same license as the main project.

---

**Developed by IMAD EL KHELYFY** 🇲🇦
*Master SDIA - Université de Meknès*
