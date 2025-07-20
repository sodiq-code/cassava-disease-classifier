# 🌿 Cassava Leaf Disease Detector

A comprehensive ML-powered diagnostic tool for identifying diseases in cassava plants using computer vision and deep learning. This application provides farmers and agricultural professionals with instant disease classification and treatment recommendations.

## 🚀 Features

- **AI-Powered Disease Detection**: Uses MobileNetV2-based deep learning model for accurate classification
- **5 Disease Classifications**: 
  - Cassava Bacterial Blight (CBB)
  - Cassava Brown Streak Disease (CBSD)
  - Cassava Green Mottle (CGM)
  - Cassava Mosaic Disease (CMD)
  - Healthy plants
- **Detailed Analysis**: Provides confidence scores, symptoms description, and treatment recommendations
- **User-Friendly Interface**: Modern Gradio-based web interface with responsive design
- **Real-time Processing**: Instant analysis with confidence percentages
- **Educational Content**: Comprehensive disease information and agricultural best practices

## 🛠️ Technology Stack

- **Frontend**: Gradio with custom CSS styling
- **Backend**: Python with TensorFlow/Keras
- **Model Architecture**: MobileNetV2 with custom classification layers
- **Image Processing**: PIL, OpenCV, NumPy
- **Deployment**: Ready for Hugging Face Spaces, local deployment, or cloud platforms

## 📋 Supported Diseases

### 1. Cassava Bacterial Blight (CBB)
- **Symptoms**: Angular, water-soaked spots on leaves; wilting; black streaks on stems
- **Treatment**: Disease-free planting material, crop rotation, copper-based fungicides

### 2. Cassava Brown Streak Disease (CBSD)
- **Symptoms**: Yellow patches along leaf veins; brown streaks in stems; root rot
- **Treatment**: Resistant varieties, whitefly control, clean planting material

### 3. Cassava Green Mottle (CGM)
- **Symptoms**: Green and yellow mottled patterns; reduced leaf size; stunted growth
- **Treatment**: Virus-free planting material, aphid vector control

### 4. Cassava Mosaic Disease (CMD)
- **Symptoms**: Yellow and green mosaic patterns; leaf distortion; yield reduction
- **Treatment**: Resistant varieties, whitefly control, infected plant removal

### 5. Healthy Classification
- **Symptoms**: Green, uniform leaves; normal growth pattern
- **Treatment**: Preventive measures and regular monitoring

## 🚀 Quick Start

### Local Installation

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/cassava-disease-classifier.git
cd cassava-disease-classifier
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Run the application**:
```bash
python app.py
```

4. **Open your browser** and navigate to `http://localhost:7860`

### Docker Deployment

```bash
# Build the Docker image
docker build -t cassava-detector .

# Run the container
docker run -p 7860:7860 cassava-detector
```

### Hugging Face Spaces

This application is ready for deployment on Hugging Face Spaces. Simply:

1. Create a new Space on Hugging Face
2. Upload the files (`app.py`, `requirements.txt`, `README.md`)
3. The application will automatically deploy

## 📖 How to Use

1. **Upload Image**: Click on the image upload area and select a clear photo of a cassava leaf
2. **Analyze**: Click the "🔬 Analyze Image" button to process the image
3. **Review Results**: 
   - View confidence scores for all disease classes
   - Read the detailed diagnosis and treatment recommendations
   - Check the quick result summary

### 💡 Tips for Best Results

- Use clear, well-lit images
- Focus on leaves showing symptoms
- Avoid blurry or low-resolution images
- Include the entire leaf in the frame
- Take photos in natural lighting when possible

## 🔬 Model Architecture

The application uses a transfer learning approach with MobileNetV2 as the base model:

```python
Base Model: MobileNetV2 (ImageNet pretrained)
├── GlobalAveragePooling2D
├── Dropout(0.2)
├── Dense(128, activation='relu')
├── Dropout(0.2)
└── Dense(5, activation='softmax')  # 5 classes
```

**Input**: 224x224x3 RGB images
**Output**: Probability distribution over 5 disease classes
**Preprocessing**: Resize, normalize to [0,1]

## 📊 Performance Metrics

The model architecture is designed for:
- **Accuracy**: High classification accuracy across all disease types
- **Speed**: Fast inference suitable for real-time applications
- **Efficiency**: Lightweight MobileNetV2 architecture for mobile deployment
- **Robustness**: Handles various lighting conditions and image qualities

## 🌱 Agricultural Impact

This tool aims to support:
- **Early Disease Detection**: Prompt identification prevents spread
- **Treatment Guidance**: Evidence-based treatment recommendations
- **Yield Protection**: Timely intervention reduces crop losses
- **Knowledge Transfer**: Educational content for farmers
- **Sustainable Agriculture**: Promotes informed decision-making

## 🔧 Development

### Project Structure
```
cassava-disease-classifier/
├── app.py                 # Main Gradio application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── models/               # Model weights and configs
├── data/                 # Sample images and datasets
└── utils/                # Helper functions and utilities
```

### Adding New Features

1. **Model Improvements**: Update the `_create_model()` method
2. **New Disease Classes**: Modify `DISEASE_LABELS` and `DISEASE_INFO`
3. **UI Enhancements**: Update the Gradio interface in `create_interface()`
4. **Processing Pipeline**: Modify `preprocess_image()` and `predict()` methods

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas for Contribution

- Model training and optimization
- New disease class additions
- UI/UX improvements
- Mobile app development
- API endpoint creation
- Documentation improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Kaggle Cassava Leaf Disease Classification** dataset contributors
- **TensorFlow/Keras** team for the excellent deep learning framework
- **Gradio** team for the intuitive ML interface framework
- **Agricultural research community** for disease classification knowledge
- **Open source community** for various tools and libraries used

## 📞 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Documentation**: Check the wiki for detailed documentation
- **Community**: Join our discussions for questions and collaboration

## 🌍 Deployment Options

### Cloud Platforms
- **Hugging Face Spaces**: Direct deployment with GPU support
- **Google Cloud Platform**: Scalable deployment with Cloud Run
- **AWS**: Deploy using EC2 or Lambda for serverless
- **Azure**: Container deployment with Azure Container Instances

### Edge Deployment
- **Mobile Apps**: Convert to TensorFlow Lite for mobile deployment
- **Raspberry Pi**: Edge computing for field deployment
- **IoT Devices**: Lightweight deployment for agricultural sensors

---

**Built with ❤️ for sustainable agriculture and food security**

*This tool is designed for educational and research purposes. Always consult with agricultural professionals for definitive plant disease diagnosis and treatment decisions.*
