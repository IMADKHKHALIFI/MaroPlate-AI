#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Setup script for Moroccan License Plate Detection AI Models
Downloads and configures the required YOLO model weights

Author: IMAD EL KHELYFY
"""

import os
import sys
import urllib.request
from pathlib import Path

def create_weights_structure():
    """Create the required directory structure for AI models"""
    weights_dir = Path("backend/weights")
    detection_dir = weights_dir / "detection"
    ocr_dir = weights_dir / "ocr"
    
    # Create directories
    detection_dir.mkdir(parents=True, exist_ok=True)
    ocr_dir.mkdir(parents=True, exist_ok=True)
    
    print("✅ Directory structure created:")
    print(f"   📁 {detection_dir}")
    print(f"   📁 {ocr_dir}")
    
    return weights_dir, detection_dir, ocr_dir

def check_models():
    """Check if all required model files are present"""
    required_files = [
        "backend/weights/detection/yolov3-detection_final.weights",
        "backend/weights/detection/yolov3-detection.cfg",
        "backend/weights/ocr/yolov3-ocr_final.weights",
        "backend/weights/ocr/yolov3-ocr.cfg"
    ]
    
    missing_files = []
    present_files = []
    
    for file_path in required_files:
        if os.path.exists(file_path):
            size_mb = os.path.getsize(file_path) / (1024 * 1024)
            present_files.append(f"✅ {file_path} ({size_mb:.1f}MB)")
        else:
            missing_files.append(f"❌ {file_path}")
    
    print("\n📋 Model Files Status:")
    for file_info in present_files:
        print(f"   {file_info}")
    for file_info in missing_files:
        print(f"   {file_info}")
    
    if not missing_files:
        print("\n🎉 All model files are present! System ready to use.")
        return True
    else:
        print(f"\n⚠️  {len(missing_files)} model files are missing.")
        print("\n📥 Please download them from GitHub Releases:")
        print("   https://github.com/IMADKHKHALIFI/MaroPlate-AI/releases")
        print("   Look for 'ai-models-v1.0.zip' (~470MB)")
        return False

def print_help():
    """Print help information"""
    print("""
🤖 Moroccan License Plate Detection - Model Setup

Usage:
  python setup_models.py [command]

Commands:
  check     Check if all model files are present
  setup     Create directory structure only
  help      Show this help message

Examples:
  python setup_models.py check    # Check model files status
  python setup_models.py setup    # Create directories
  python setup_models.py          # Default: setup + check

📥 To get the AI models:
1. Go to: https://github.com/IMADKHKHALIFI/MaroPlate-AI/releases
2. Download: ai-models-v1.0.zip (~470MB)
3. Extract all files to backend/weights/ maintaining folder structure

📁 Required structure:
backend/weights/
├── detection/
│   ├── yolov3-detection_final.weights (234MB)
│   └── yolov3-detection.cfg
└── ocr/
    ├── yolov3-ocr_final.weights (235MB)
    └── yolov3-ocr.cfg
""")

def main():
    """Main setup function"""
    print("🤖 Moroccan License Plate Detection - AI Models Setup")
    print("=" * 55)
    
    # Parse command line arguments
    command = sys.argv[1] if len(sys.argv) > 1 else "default"
    
    if command == "help":
        print_help()
        return
    
    if command == "check":
        check_models()
        return
    
    if command in ["setup", "default"]:
        print("\n🔧 Setting up directory structure...")
        create_weights_structure()
        
        if command == "default":
            print("\n🔍 Checking for model files...")
            if check_models():
                print("\n🚀 Setup complete! You can now run the application.")
            else:
                print("\n📋 Next steps:")
                print("1. Download ai-models-v1.0.zip from GitHub Releases")
                print("2. Extract all files to backend/weights/")
                print("3. Run 'python setup_models.py check' to verify")
        return
    
    print(f"❌ Unknown command: {command}")
    print("Run 'python setup_models.py help' for usage information")

if __name__ == "__main__":
    main()
