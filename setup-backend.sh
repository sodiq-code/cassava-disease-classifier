#!/bin/bash

echo "🌿 CassavaDoc Backend Setup"
echo "=========================="

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Please run this from the project root."
    exit 1
fi

cd backend

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "🔍 Checking model files..."
if [ ! -f "model/model_quantized.tflite" ] || [ ! -f "model/best_model.keras" ]; then
    echo "⚠️  Model files appear to be placeholders."
    echo "   Please replace the files in backend/model/ with your actual trained models:"
    echo "   - model_quantized.tflite"
    echo "   - best_model.keras"
    echo "   - one_class_svm.joblib"
    echo "   - scaler.joblib"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " continue_setup
    if [[ ! $continue_setup =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. Please add your model files first."
        exit 1
    fi
fi

echo "🚀 Starting Flask backend server..."
echo "   Backend will be available at: http://localhost:7860"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the Flask app
python app.py