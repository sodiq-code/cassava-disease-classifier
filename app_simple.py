import gradio as gr
import numpy as np
from PIL import Image
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import io
import base64

# Disease class labels for cassava leaves
DISEASE_LABELS = {
    0: "Cassava Bacterial Blight (CBB)",
    1: "Cassava Brown Streak Disease (CBSD)",
    2: "Cassava Green Mottle (CGM)",
    3: "Cassava Mosaic Disease (CMD)",
    4: "Healthy"
}

# Disease descriptions and treatments
DISEASE_INFO = {
    "Cassava Bacterial Blight (CBB)": {
        "description": "A bacterial disease that causes angular leaf spots, wilting, and stem rot. It can severely reduce yield and plant quality.",
        "symptoms": "Angular, water-soaked spots on leaves; wilting; black streaks on stems; gum exudation",
        "treatment": "Use disease-free planting material; crop rotation; remove infected plants; apply copper-based fungicides"
    },
    "Cassava Brown Streak Disease (CBSD)": {
        "description": "A viral disease that causes brown streaking in stems and roots, significantly affecting root quality.",
        "symptoms": "Yellow patches along leaf veins; brown streaks in stems; brown rot in storage roots",
        "treatment": "Use resistant varieties; control whitefly vectors; remove infected plants; use clean planting material"
    },
    "Cassava Green Mottle (CGM)": {
        "description": "A viral disease characterized by green and yellow mottling patterns on leaves.",
        "symptoms": "Green and yellow mottled patterns on leaves; reduced leaf size; stunted growth",
        "treatment": "Use virus-free planting material; control aphid vectors; remove infected plants"
    },
    "Cassava Mosaic Disease (CMD)": {
        "description": "One of the most important viral diseases of cassava, causing severe yield losses.",
        "symptoms": "Yellow and green mosaic patterns on leaves; leaf distortion; stunted growth; reduced root yield",
        "treatment": "Plant resistant varieties; use clean planting material; control whitefly vectors; roguing infected plants"
    },
    "Healthy": {
        "description": "The cassava plant appears healthy with no signs of disease.",
        "symptoms": "Green, uniform leaves; normal growth pattern; no discoloration or spots",
        "treatment": "Continue good agricultural practices; regular monitoring; preventive measures"
    }
}

class CassavaClassifier:
    def __init__(self):
        self.model = self._create_model()
        self.scaler = StandardScaler()
        self._train_dummy_model()
    
    def _create_model(self):
        """Create a RandomForest model for cassava disease classification"""
        return RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
    
    def _train_dummy_model(self):
        """Train the model with dummy data for demonstration"""
        # Create dummy training data
        np.random.seed(42)
        X_dummy = np.random.rand(1000, 100)  # 1000 samples, 100 features
        y_dummy = np.random.randint(0, 5, 1000)  # 5 classes
        
        # Fit scaler and model
        X_scaled = self.scaler.fit_transform(X_dummy)
        self.model.fit(X_scaled, y_dummy)
    
    def extract_features(self, image):
        """Extract simple features from image for classification"""
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to standard size
        image = image.resize((64, 64))
        img_array = np.array(image)
        
        # Extract basic color and texture features
        features = []
        
        # Color features
        for channel in range(3):  # RGB channels
            channel_data = img_array[:, :, channel]
            features.extend([
                np.mean(channel_data),
                np.std(channel_data),
                np.median(channel_data),
                np.max(channel_data),
                np.min(channel_data)
            ])
        
        # Texture features (simple gradients)
        gray = np.mean(img_array, axis=2)
        grad_x = np.gradient(gray, axis=1)
        grad_y = np.gradient(gray, axis=0)
        
        features.extend([
            np.mean(np.abs(grad_x)),
            np.std(np.abs(grad_x)),
            np.mean(np.abs(grad_y)),
            np.std(np.abs(grad_y))
        ])
        
        # Shape features
        features.extend([
            gray.shape[0],
            gray.shape[1],
            np.sum(gray > np.mean(gray)) / gray.size  # Brightness ratio
        ])
        
        # Pad or truncate to exactly 100 features
        while len(features) < 100:
            features.append(0.0)
        features = features[:100]
        
        return np.array(features).reshape(1, -1)
    
    def predict(self, image):
        """Make prediction on image"""
        if isinstance(image, str):
            image = Image.open(image)
        elif isinstance(image, np.ndarray):
            image = Image.fromarray(image)
        
        # Extract features
        features = self.extract_features(image)
        
        # Scale features
        features_scaled = self.scaler.transform(features)
        
        # Get prediction probabilities
        probabilities = self.model.predict_proba(features_scaled)[0]
        
        # Get top prediction
        predicted_class = np.argmax(probabilities)
        confidence = probabilities[predicted_class]
        
        # Format results
        results = {}
        for i, prob in enumerate(probabilities):
            results[DISEASE_LABELS[i]] = float(prob)
        
        return results, DISEASE_LABELS[predicted_class], confidence

# Initialize classifier
classifier = CassavaClassifier()

def classify_image(image):
    """Main classification function for Gradio interface"""
    if image is None:
        return "Please upload an image first.", "", ""
    
    try:
        # Get predictions
        results, top_prediction, confidence = classifier.predict(image)
        
        # Format confidence scores
        confidence_text = "**Prediction Confidence:**\n\n"
        for disease, score in sorted(results.items(), key=lambda x: x[1], reverse=True):
            confidence_text += f"• **{disease}**: {score:.2%}\n"
        
        # Get disease information
        disease_info = DISEASE_INFO[top_prediction]
        
        info_text = f"""
## 🔬 **Diagnosis: {top_prediction}**

**Confidence:** {confidence:.2%}

### 📋 Description:
{disease_info['description']}

### 🔍 Symptoms:
{disease_info['symptoms']}

### 💊 Treatment Recommendations:
{disease_info['treatment']}

### ⚠️ Important Note:
This is an AI-based diagnostic tool for educational and demonstration purposes. 
The current model uses simplified feature extraction for demonstration. 
For serious plant health issues, please consult with agricultural experts or extension services.
        """
        
        return confidence_text, info_text, f"**Primary Diagnosis:** {top_prediction} ({confidence:.1%} confidence)"
        
    except Exception as e:
        return f"Error processing image: {str(e)}", "", ""

# Create Gradio interface
def create_interface():
    with gr.Blocks(
        title="🌿 Cassava Leaf Disease Detector",
        theme=gr.themes.Soft(),
        css="""
        .gradio-container {
            max-width: 1200px !important;
        }
        .header {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .info-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            margin: 10px 0;
        }
        """
    ) as interface:
        
        # Header
        gr.HTML("""
        <div class="header">
            <h1>🌿 Cassava Leaf Disease Detector</h1>
            <p>AI-powered diagnostic tool for identifying diseases in cassava plants</p>
            <p><small>Demo Version - Using simplified ML model</small></p>
        </div>
        """)
        
        # Information section
        gr.HTML("""
        <div class="info-box">
            <h3>📖 How to Use:</h3>
            <ol>
                <li>Upload a clear image of a cassava leaf</li>
                <li>Click "Analyze Image" to get the diagnosis</li>
                <li>Review the results and treatment recommendations</li>
            </ol>
            <p><strong>Supported Diseases:</strong> Bacterial Blight (CBB), Brown Streak Disease (CBSD), 
            Green Mottle (CGM), Mosaic Disease (CMD), and Healthy classification</p>
        </div>
        """)
        
        with gr.Row():
            with gr.Column(scale=1):
                # Input section
                gr.HTML("<h3>📤 Upload Cassava Leaf Image</h3>")
                image_input = gr.Image(
                    label="Cassava Leaf Image",
                    type="pil",
                    height=300
                )
                
                analyze_btn = gr.Button(
                    "🔬 Analyze Image", 
                    variant="primary",
                    size="lg"
                )
                
                # Quick result
                quick_result = gr.Textbox(
                    label="Quick Result",
                    lines=2,
                    interactive=False
                )
                
            with gr.Column(scale=1):
                # Confidence scores
                gr.HTML("<h3>📊 Confidence Scores</h3>")
                confidence_output = gr.Markdown(
                    label="Prediction Confidence",
                    value="Upload an image to see confidence scores..."
                )
        
        # Detailed results section
        gr.HTML("<h3>📋 Detailed Analysis & Treatment</h3>")
        detailed_output = gr.Markdown(
            label="Detailed Analysis",
            value="Upload and analyze an image to see detailed information..."
        )
        
        # Example images section
        gr.HTML("""
        <div class="info-box">
            <h3>💡 Tips for Best Results:</h3>
            <ul>
                <li>Use clear, well-lit images</li>
                <li>Focus on the leaf showing symptoms</li>
                <li>Avoid blurry or low-resolution images</li>
                <li>Include the entire leaf in the frame</li>
            </ul>
        </div>
        """)
        
        # Technical info
        gr.HTML("""
        <div class="info-box">
            <h3>🔧 Technical Information:</h3>
            <p>This demo version uses a Random Forest classifier with basic image features including:</p>
            <ul>
                <li>Color statistics (mean, std, median for RGB channels)</li>
                <li>Texture features (gradient analysis)</li>
                <li>Shape and brightness characteristics</li>
            </ul>
            <p>In a production system, this would be replaced with a deep learning model trained on thousands of cassava leaf images.</p>
        </div>
        """)
        
        # Connect the button to the function
        analyze_btn.click(
            fn=classify_image,
            inputs=[image_input],
            outputs=[confidence_output, detailed_output, quick_result]
        )
        
        # Footer
        gr.HTML("""
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p><strong>Disclaimer:</strong> This is a demonstration tool for educational purposes. 
            The model uses simplified feature extraction and is not suitable for actual agricultural diagnosis.
            Always consult with agricultural professionals for definitive plant disease diagnosis and treatment.</p>
            <p>🌱 Built with ❤️ for sustainable agriculture</p>
        </div>
        """)
    
    return interface

# Launch the application
if __name__ == "__main__":
    app = create_interface()
    app.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=True,
        show_error=True
    )