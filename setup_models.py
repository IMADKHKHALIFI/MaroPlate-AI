#!/usr/bin/env python3
"""
Setup script for Moroccan License Plate Detection System
This script creates the necessary directory structure for AI model weights.
"""

import os
import sys
from pathlib import Path

def create_weights_structure():
    """Create the weights directory structure."""
    base_dir = Path(__file__).parent
    weights_dir = base_dir / "backend" / "weights"
    
    # Create directories
    detection_dir = weights_dir / "detection"
    ocr_dir = weights_dir / "ocr"
    
    detection_dir.mkdir(parents=True, exist_ok=True)
    ocr_dir.mkdir(parents=True, exist_ok=True)
    
    # Create placeholder files to show expected structure
    placeholder_content = """# This is a placeholder file
# Download the actual model weights from GitHub Releases:
# https://github.com/IMADKHKHALIFI/MaroPlate-AI/releases

# Expected files:
# - yolov3-detection_final.weights (234MB)
# - yolov3-detection.cfg
"""
    
    detection_placeholder = detection_dir / "README_DOWNLOAD_MODELS.txt"
    ocr_placeholder = ocr_dir / "README_DOWNLOAD_MODELS.txt"
    
    with open(detection_placeholder, 'w', encoding='utf-8') as f:
        f.write(placeholder_content.replace("detection", "detection"))
    
    with open(ocr_placeholder, 'w', encoding='utf-8') as f:
        f.write(placeholder_content.replace("detection", "ocr"))
    
    print("✅ Weights directory structure created successfully!")
    print(f"📁 Created: {detection_dir}")
    print(f"📁 Created: {ocr_dir}")
    print("\n📥 Next steps:")
    print("1. Go to: https://github.com/IMADKHKHALIFI/MaroPlate-AI/releases")
    print("2. Download the latest release with model weights")
    print("3. Extract the .weights and .cfg files to the appropriate directories")
    print("\n🔍 Expected files:")
    print("   backend/weights/detection/yolov3-detection_final.weights")
    print("   backend/weights/detection/yolov3-detection.cfg")
    print("   backend/weights/ocr/yolov3-ocr_final.weights")
    print("   backend/weights/ocr/yolov3-ocr.cfg")

def check_models():
    """Check if model files are present."""
    base_dir = Path(__file__).parent
    weights_dir = base_dir / "backend" / "weights"
    
    required_files = [
        "detection/yolov3-detection_final.weights",
        "detection/yolov3-detection.cfg",
        "ocr/yolov3-ocr_final.weights",
        "ocr/yolov3-ocr.cfg"
    ]
    
    missing_files = []
    present_files = []
    
    for file_path in required_files:
        full_path = weights_dir / file_path
        if full_path.exists():
            present_files.append(file_path)
        else:
            missing_files.append(file_path)
    
    print("🔍 Model Files Status:")
    print("=" * 50)
    
    if present_files:
        print("✅ Found:")
        for file in present_files:
            full_path = weights_dir / file
            size_mb = full_path.stat().st_size / (1024 * 1024) if full_path.exists() else 0
            print(f"   📄 {file} ({size_mb:.1f} MB)")
    
    if missing_files:
        print("\n❌ Missing:")
        for file in missing_files:
            print(f"   📄 {file}")
        print(f"\n📥 Download missing files from:")
        print(f"   https://github.com/IMADKHKHALIFI/MaroPlate-AI/releases")
    else:
        print("\n🎉 All model files are present! You're ready to go!")

def main():
    """Main function."""
    if len(sys.argv) > 1 and sys.argv[1] == "check":
        check_models()
    else:
        print("🚀 Moroccan License Plate Detection - Model Setup")
        print("=" * 60)
        create_weights_structure()
        print("\n" + "=" * 60)
        check_models()

if __name__ == "__main__":
    main()
