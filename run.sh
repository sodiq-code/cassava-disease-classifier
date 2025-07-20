#!/bin/bash

# Cassava Leaf Disease Detector Startup Script
echo "🌿 Starting Cassava Leaf Disease Detector..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7 or higher."
    exit 1
fi

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📈 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Run tests (optional)
if [ "$1" == "--test" ]; then
    echo "🧪 Running tests..."
    python test_app.py
    if [ $? -ne 0 ]; then
        echo "❌ Tests failed. Please check the issues."
        exit 1
    fi
fi

# Start the application
echo "🚀 Starting Cassava Leaf Disease Detector..."
echo "📱 The application will be available at: http://localhost:7860"
echo "🛑 Press Ctrl+C to stop the application"
echo ""

python app.py