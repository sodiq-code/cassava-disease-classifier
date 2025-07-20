#!/usr/bin/env python3
"""
Test script for Cassava Leaf Disease Detector
"""

import sys
import os
import numpy as np
from PIL import Image
import tempfile

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import CassavaClassifier, classify_image, DISEASE_LABELS, DISEASE_INFO
    print("✅ Successfully imported app components")
except ImportError as e:
    print(f"❌ Failed to import app components: {e}")
    sys.exit(1)

def test_classifier():
    """Test the CassavaClassifier class"""
    print("\n🧪 Testing CassavaClassifier...")
    
    try:
        # Initialize classifier
        classifier = CassavaClassifier()
        print("✅ Classifier initialized successfully")
        
        # Test with a dummy image
        dummy_image = Image.new('RGB', (224, 224), color='green')
        results, prediction, confidence = classifier.predict(dummy_image)
        
        print(f"✅ Prediction successful: {prediction} ({confidence:.2%})")
        print("✅ All disease classes present in results:")
        for disease, prob in results.items():
            print(f"   - {disease}: {prob:.2%}")
            
    except Exception as e:
        print(f"❌ Classifier test failed: {e}")
        return False
    
    return True

def test_disease_info():
    """Test disease information completeness"""
    print("\n📋 Testing disease information...")
    
    required_fields = ['description', 'symptoms', 'treatment']
    
    for disease_name in DISEASE_LABELS.values():
        if disease_name not in DISEASE_INFO:
            print(f"❌ Missing disease info for: {disease_name}")
            return False
        
        disease_data = DISEASE_INFO[disease_name]
        for field in required_fields:
            if field not in disease_data or not disease_data[field]:
                print(f"❌ Missing {field} for {disease_name}")
                return False
    
    print("✅ All disease information complete")
    return True

def test_gradio_function():
    """Test the main Gradio classification function"""
    print("\n🎯 Testing Gradio classification function...")
    
    try:
        # Test with None input
        result = classify_image(None)
        if "Please upload an image first" not in result[0]:
            print("❌ None input handling failed")
            return False
        print("✅ None input handled correctly")
        
        # Test with dummy image
        dummy_image = Image.new('RGB', (300, 300), color='red')
        confidence_text, info_text, quick_result = classify_image(dummy_image)
        
        if not confidence_text or not info_text or not quick_result:
            print("❌ Classification function returned empty results")
            return False
        
        print("✅ Classification function working correctly")
        print(f"   Quick result: {quick_result[:50]}...")
        
    except Exception as e:
        print(f"❌ Gradio function test failed: {e}")
        return False
    
    return True

def test_image_processing():
    """Test image preprocessing"""
    print("\n🖼️  Testing image processing...")
    
    try:
        classifier = CassavaClassifier()
        
        # Test different image formats
        test_cases = [
            Image.new('RGB', (100, 100), color='blue'),
            Image.new('RGBA', (200, 200), color='yellow'),
            Image.new('L', (150, 150), color=128),  # Grayscale
        ]
        
        for i, test_image in enumerate(test_cases):
            processed = classifier.preprocess_image(test_image)
            if processed.shape != (1, 224, 224, 3):
                print(f"❌ Image preprocessing failed for test case {i+1}")
                return False
        
        print("✅ Image preprocessing working correctly")
        
    except Exception as e:
        print(f"❌ Image processing test failed: {e}")
        return False
    
    return True

def main():
    """Run all tests"""
    print("🚀 Starting Cassava Leaf Disease Detector Tests")
    print("=" * 50)
    
    tests = [
        ("Classifier Functionality", test_classifier),
        ("Disease Information", test_disease_info),
        ("Gradio Function", test_gradio_function),
        ("Image Processing", test_image_processing),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Running {test_name} test...")
        if test_func():
            passed += 1
            print(f"✅ {test_name} test PASSED")
        else:
            print(f"❌ {test_name} test FAILED")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The application is ready to run.")
        print("\n🚀 To start the application, run: python app.py")
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    main()