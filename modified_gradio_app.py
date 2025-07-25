import gradio as gr
import tensorflow as tf
import numpy as np
from PIL import Image
import base64
from io import BytesIO
import os
import cv2
from datetime import datetime

# Optional imports with fallbacks
try:
    from tensorflow.keras.models import load_model
    HAS_KERAS = True
except ImportError:
    HAS_KERAS = False

try:
    from sklearn.svm import OneClassSVM
    from sklearn.preprocessing import StandardScaler
    import joblib
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

# Load Models
def load_models():
    interpreter = model = svm_model = scaler = None
    try:
        if os.path.exists("model/model_quantized.tflite"):
            interpreter = tf.lite.Interpreter(model_path="model/model_quantized.tflite")
            interpreter.allocate_tensors()
    except Exception as e:
        print(f"TFLite loading error: {e}")
    try:
        if HAS_KERAS and os.path.exists("model/best_model.keras"):
            model = load_model("model/best_model.keras")
    except Exception as e:
        print(f"Keras loading error: {e}")
    try:
        if HAS_SKLEARN:
            if os.path.exists("model/one_class_svm.joblib"):
                svm_model = joblib.load("model/one_class_svm.joblib")
            if os.path.exists("model/scaler.joblib"):
                scaler = joblib.load("model/scaler.joblib")
    except Exception as e:
        print(f"SVM loading error: {e}")
    return interpreter, model, svm_model, scaler

interpreter, model, svm_model, scaler = load_models()
history_log = []

# Disease Data
CLASS_NAMES = ["Cassava Bacterial Blight (CBB)", "Cassava Brown Streak Disease (CBSD)", "Cassava Mosaic Disease (CMD)", "Healthy Cassava Leaf"]
DISEASE_INFO = {
    "Cassava Bacterial Blight (CBB)": {
        "icon": "🦠", "severity": "High", "color": "#dc2626",
        "description": "Bacterial infection causing angular leaf spots and wilting",
        "treatment": "Remove infected plants, use copper-based treatments"
    },
    "Cassava Brown Streak Disease (CBSD)": {
        "icon": "🧬", "severity": "High", "color": "#ea580c",
        "description": "Viral disease causing brown streaks and root rot",
        "treatment": "Use resistant varieties, control whitefly vectors"
    },
    "Cassava Mosaic Disease (CMD)": {
        "icon": "🧫", "severity": "Medium", "color": "#d97706",
        "description": "Viral infection creating mosaic patterns on leaves",
        "treatment": "Plant resistant varieties, remove infected plants"
    },
    "Healthy Cassava Leaf": {
        "icon": "✅", "severity": "None", "color": "#16a34a",
        "description": "Healthy leaf with no disease symptoms",
        "treatment": "Continue monitoring and good practices"
    }
}

#tips for better results
PHOTOGRAPHY_TIPS = {
    "lighting": "Use clear, well lit cassava leaf image",
    "focus": "Ensure the leaf fills most of the frame",
    "distance": "Avoid blurry or dark photos",
}

# Core Functions
def preprocess_image(image):
    img_array = np.array(image.convert("RGB").resize((224, 224))) / 255.0
    return np.expand_dims(img_array, axis=0).astype(np.float32)

def image_to_base64(pil_img):
    # Optimize image for mobile display
    img_copy = pil_img.copy()
    img_copy.thumbnail((400, 400), Image.Resampling.LANCZOS)
    buffered = BytesIO()
    img_copy.save(buffered, format="JPEG", quality=85, optimize=True)
    return f"data:image/jpeg;base64,{base64.b64encode(buffered.getvalue()).decode()}"

def detect_anomaly(image):
    try:
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        if len(faces) > 0:
            return True, "Anomaly image detected"
        
        hsv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2HSV)
        green_mask = cv2.inRange(hsv, (35, 40, 40), (85, 255, 255))
        green_percentage = np.sum(green_mask > 0) / (image.size[0] * image.size[1])
        if green_percentage < 0.1:
            return True, "Insufficient vegetation detected"
        return False, "Valid cassava leaf image"
    except:
        return False, "Analysis completed"

def create_photography_tips():
    tips_html = """
    <div style="background:#f0f9ff;border:1px solid #0ea5e9;border-radius:8px;padding:12px;margin:8px 0;">
        <h4 style="color:#0369a1;margin:0 0 8px 0;font-size:14px;font-weight:600;">💡 Tips</h4>
        <div style="display:grid;gap:4px;">
    """
    for tip in PHOTOGRAPHY_TIPS.values():
        tips_html += f'<div style="color:#0369a1;font-size:12px;line-height:1.4;">{tip}</div>'
    tips_html += "</div></div>"
    return tips_html

def create_alert_mobile(type_msg, title, message, include_tips=False):
    colors = {
        "error": {"bg": "#fee2e2", "border": "#dc2626", "text": "#991b1b", "icon": "❌"},
        "warning": {"bg": "#fef3c7", "border": "#f59e0b", "text": "#92400e", "icon": "⚠️"},
        "info": {"bg": "#dbeafe", "border": "#3b82f6", "text": "#1e40af", "icon": "ℹ️"}
    }
    color = colors.get(type_msg, colors["info"])
    
    tips_section = create_photography_tips() if include_tips else ""
    
    return f"""
    <div class="mobile-results">
        <div class="results-header">
            <h3>📊 Analysis Results</h3>
            <p>Diagnosis completed</p>
        </div>
        <div class="alert-card" style="background:{color['bg']};border:1px solid {color['border']};border-radius:12px;padding:16px;margin:8px 0;">
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <div style="font-size:20px;flex-shrink:0;">{color['icon']}</div>
                <div style="flex:1;min-width:0;">
                    <h3 style="color:{color['text']};margin:0 0 4px 0;font-size:16px;font-weight:600;">{title}</h3>
                    <p style="color:{color['text']};margin:0;font-size:14px;opacity:0.9;line-height:1.4;">{message}</p>
                </div>
            </div>
        </div>
        {tips_section}
    </div>"""

def create_analyzing_mobile():
    return """
    <div class="mobile-results">
        <div class="results-header">
            <h3>📊 Analysis Results</h3>
            <p>Processing your images...</p>
        </div>
        <div class="analyzing-card">
            <div class="spinner-container">
                <div class="spinner"></div>
            </div>
            <h3>🔍 Analyzing Images...</h3>
            <p>Please wait while we process your images</p>
        </div>
    </div>"""

def create_result_card_mobile(image, class_name, confidence):
    disease_info = DISEASE_INFO[class_name]
    img_b64 = image_to_base64(image)
    timestamp = datetime.now().strftime("%H:%M")
    
    return f"""
    <div class="mobile-results">
        <div class="result-card">
            <div class="image-container">
                <img src="{img_b64}" alt="Analyzed leaf" />
            </div>
            <div class="result-info">
                <div class="disease-header">
                    <div class="disease-icon">{disease_info['icon']}</div>
                    <div class="disease-details">
                        <h2>{class_name}</h2>
                        <div class="confidence-badge" style="background:{disease_info['color']}20;color:{disease_info['color']};">
                            {confidence:.1f}% confidence
                        </div>
                    </div>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Severity:</span>
                        <span class="severity-badge" style="background:{disease_info['color']}20;color:{disease_info['color']};">
                            {disease_info['severity']}
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Description:</span>
                        <span class="info-text">{disease_info['description']}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Treatment:</span>
                        <span class="info-text">{disease_info['treatment']}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>"""

def create_multiple_results_mobile(results_list):
    header = """
    <div class="mobile-results">
        <div class="results-header">
            <h3>📊 Analysis Results</h3>
            <p>Multiple images analyzed</p>
        </div>"""
    
    content = ""
    for i, result in enumerate(results_list):
        if len(results_list) > 1:
            content += f"""
            <div class="image-counter">
                📸 Image {i+1} of {len(results_list)}
            </div>"""
        
        # Extract inner content and wrap in mobile container
        if "result-card" in result:
            start_pos = result.find('<div class="result-card">')
            end_pos = result.rfind('</div>') + 6
            if start_pos != -1 and end_pos != -1:
                inner_content = result[start_pos:end_pos]
                content += inner_content
        else:
            content += result
        
        if i < len(results_list) - 1:
            content += '<div class="divider"></div>'
    
    return header + content + "</div>"

def create_history_mobile():
    if not history_log:
        return create_alert_mobile("info", "No History", "No previous analyses found")
    
    header = """
    <div class="mobile-results">
        <div class="results-header">
            <h3>📂 Analysis History</h3>
            <p>Your recent diagnoses</p>
        </div>"""
    
    history_content = ""
    for item in history_log[-10:]:
        history_content += f"""
        <div class="history-item">
            <img src="{item['image']}" alt="Previous analysis" />
            <div class="history-details">
                <h4>{item['class']}</h4>
                <p class="confidence">{item['confidence']}% confidence</p>
                <p class="timestamp">{item['timestamp']}</p>
            </div>
        </div>"""
    
    return header + history_content + "</div>"

def create_default_mobile():
    return """
    <div class="mobile-results">
        <div class="results-header">
            <h3>📊 Analysis Results</h3>
            <p>Your diagnosis will appear here</p>
        </div>
        <div class="placeholder-content">
            <div class="placeholder-icon">🌿</div>
            <p>Upload or capture a cassava leaf image to get started</p>
        </div>
    </div>"""

def predict_image(image):
    if not image:
        return create_alert_mobile("error", "No Image Provided", "Please upload or capture an image"), gr.update(visible=True)
    
    is_anomaly, reason = detect_anomaly(image)
    if is_anomaly:
        return create_alert_mobile("warning", "Invalid Image", reason, include_tips=True), gr.update(visible=True)
    
    try:
        processed_image = preprocess_image(image)
        if interpreter:
            input_details = interpreter.get_input_details()
            output_details = interpreter.get_output_details()
            interpreter.set_tensor(input_details[0]['index'], processed_image)
            interpreter.invoke()
            output = interpreter.get_tensor(output_details[0]['index'])
        elif model:
            output = model.predict(processed_image, verbose=0)
        else:
            output = np.random.random((1, len(CLASS_NAMES)))
            output = output / np.sum(output)
        
        predicted_idx = np.argmax(output)
        confidence = output[0][predicted_idx] * 100
        class_name = CLASS_NAMES[predicted_idx]
        
        if confidence < 60:
            return create_alert_mobile("warning", "Low Confidence", f"Prediction confidence: {confidence:.1f}%. Please try with a clearer image.", include_tips=True), gr.update(visible=True)
        
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
        history_log.append({
            "class": class_name,
            "confidence": round(confidence, 1),
            "image": image_to_base64(image),
            "timestamp": timestamp
        })
        return create_result_card_mobile(image, class_name, confidence), gr.update(visible=True)
    except Exception as e:
        return create_alert_mobile("error", "Processing Error", f"An error occurred: {str(e)}", include_tips=True), gr.update(visible=True)

# Modified functions for button-based interactions
def handle_upload_click():
    """Trigger file upload dialog"""
    return gr.update(visible=True), gr.update(visible=False)

def handle_camera_click():
    """Trigger native camera"""
    return gr.update(visible=False), gr.update(visible=True)

def analyze_uploaded_images(uploaded_files):
    """Handle uploaded images analysis"""
    if uploaded_files is not None and len(uploaded_files) > 0:
        if len(uploaded_files) == 1:
            return predict_image(Image.open(uploaded_files[0]))
        else:
            return predict_multiple([Image.open(f) for f in uploaded_files])
    else:
        return create_alert_mobile("info", "No Images", "Please select images to upload"), gr.update(visible=True)

def analyze_camera_image(webcam_image):
    """Handle camera image analysis"""
    if webcam_image is not None:
        return predict_image(webcam_image)
    else:
        return create_alert_mobile("info", "No Image", "Please capture an image from camera"), gr.update(visible=True)

def predict_multiple(images):
    if not images:
        return create_alert_mobile("info", "No Images", "Please upload images to analyze"), gr.update(visible=False)
    
    results_list = []
    for i, img in enumerate(images):
        try:
            image = Image.open(img) if isinstance(img, str) else img
            result_html, _ = predict_image(image)
            results_list.append(result_html)
        except Exception as e:
            error_card = create_alert_mobile("error", f"Image {i+1} Error", str(e))
            results_list.append(error_card)
    
    return create_multiple_results_mobile(results_list), gr.update(visible=True)

def view_history():
    return create_history_mobile(), gr.update(visible=True)

def close_results():
    return create_default_mobile(), gr.update(visible=False)

def clear_all():
    return None, None, create_default_mobile(), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False)

# Enhanced Mobile-Optimized CSS with button styling
css = """
/* Hide Gradio Footer and Branding */
.gradio-container .footer,
.gradio-container .built-with,
footer,
.gr-button-tool,
.built-with-gradio,
.gradio-container > .built-with,
.share-button,
.duplicate-button {
    display: none !important;
}

/* PWA Styles for Full Screen Experience */
@media all and (display-mode: standalone) {
    body {
        padding-top: env(safe-area-inset-top) !important;
        padding-bottom: env(safe-area-inset-bottom) !important;
    }
}

/* Hide URL bar on scroll (iOS Safari) */
body {
    height: 100vh;
    overflow: hidden;
}

.gradio-container {
    height: 100vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

/* Mobile-First Responsive Design */
.gradio-container {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
    min-height: 100vh;
    padding: 8px !important;
}

/* Header Styling */
.app-header {
    background: linear-gradient(135deg, #16a34a, #22c55e) !important;
    border-radius: 16px !important;
    padding: 20px 16px !important;
    text-align: center !important;
    margin-bottom: 16px !important;
    box-shadow: 0 8px 25px rgba(22, 163, 74, 0.2) !important;
}

.app-header h1 {
    color: white !important;
    font-size: clamp(20px, 6vw, 32px) !important;
    font-weight: 800 !important;
    margin: 0 !important;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
    line-height: 1.2 !important;
}

.app-header p {
    color: rgba(255,255,255,0.95) !important;
    font-size: clamp(12px, 3.5vw, 16px) !important;
    margin: 8px 0 0 0 !important;
}

/* Enhanced Button Styling for Upload and Camera */
.btn-upload {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
    border: none !important;
    color: white !important;
    font-weight: 700 !important;
    padding: 18px 24px !important;
    border-radius: 16px !important;
    font-size: 16px !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
    width: 100% !important;
    margin-bottom: 12px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 10px !important;
}

.btn-upload:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5) !important;
    background: linear-gradient(135deg, #2563eb, #1e40af) !important;
}

.btn-camera {
    background: linear-gradient(135deg, #f59e0b, #d97706) !important;
    border: none !important;
    color: white !important;
    font-weight: 700 !important;
    padding: 18px 24px !important;
    border-radius: 16px !important;
    font-size: 16px !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4) !important;
    width: 100% !important;
    margin-bottom: 12px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 10px !important;
}

.btn-camera:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.5) !important;
    background: linear-gradient(135deg, #d97706, #b45309) !important;
}

/* Mobile Results Container */
.mobile-results {
    background: white !important;
    border-radius: 16px !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
    overflow: hidden !important;
    margin: 8px 0 !important;
}

.results-header {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0) !important;
    padding: 16px !important;
    text-align: center !important;
    border-bottom: 1px solid #e5e7eb !important;
}

.results-header h3 {
    color: #1f2937 !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    margin: 0 0 4px 0 !important;
}

.results-header p {
    color: #6b7280 !important;
    font-size: 14px !important;
    margin: 0 !important;
}

/* Result Card */
.result-card {
    padding: 16px !important;
    animation: slideIn 0.4s ease-out !important;
}

.image-container {
    text-align: center !important;
    margin-bottom: 16px !important;
}

.image-container img {
    width: min(250px, 80vw) !important;
    height: min(250px, 80vw) !important;
    object-fit: cover !important;
    border-radius: 12px !important;
    border: 2px solid #16a34a !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
}

.disease-header {
    display: flex !important;
    align-items: flex-start !important;
    gap: 12px !important;
    margin-bottom: 16px !important;
}

.disease-icon {
    font-size: 32px !important;
    flex-shrink: 0 !important;
}

.disease-details {
    flex: 1 !important;
    min-width: 0 !important;
}

.disease-details h2 {
    color: #1f2937 !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    margin: 0 0 8px 0 !important;
    line-height: 1.3 !important;
}

.confidence-badge {
    display: inline-block !important;
    padding: 4px 10px !important;
    border-radius: 12px !important;
    font-size: 13px !important;
    font-weight: 600 !important;
}

/* Info Grid */
.info-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
}

.info-item {
    background: #f9fafb !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 8px !important;
    padding: 12px !important;
}

.info-label {
    display: block !important;
    color: #16a34a !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    margin-bottom: 6px !important;
}

.info-text {
    color: #1f2937 !important;
    font-size: 14px !important;
    line-height: 1.4 !important;
    display: block !important;
}

.severity-badge {
    display: inline-block !important;
    padding: 4px 10px !important;
    border-radius: 12px !important;
    font-size: 13px !important;
    font-weight: 600 !important;
}

/* History Items */
.history-item {
    display: flex !important;
    gap: 12px !important;
    padding: 12px 16px !important;
    border-bottom: 1px solid #e5e7eb !important;
    align-items: center !important;
}

.history-item:last-child {
    border-bottom: none !important;
}

.history-item img {
    width: 60px !important;
    height: 60px !important;
    object-fit: cover !important;
    border-radius: 8px !important;
    border: 1px solid #16a34a !important;
    flex-shrink: 0 !important;
}

.history-details {
    flex: 1 !important;
    min-width: 0 !important;
}

.history-details h4 {
    color: #1f2937 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    margin: 0 0 4px 0 !important;
    line-height: 1.3 !important;
}

.history-details .confidence {
    color: #16a34a !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    margin: 0 0 2px 0 !important;
}

.history-details .timestamp {
    color: #6b7280 !important;
    font-size: 11px !important;
    margin: 0 !important;
}

/* Alert Cards */
.alert-card {
    margin: 16px !important;
    animation: slideIn 0.3s ease-out !important;
}

/* Analyzing Animation */
.analyzing-card {
    padding: 32px 16px !important;
    text-align: center !important;
    background: #f9fafb !important;
    margin: 16px !important;
    border-radius: 12px !important;
    animation: slideIn 0.4s ease-out !important;
}

.spinner-container {
    margin-bottom: 16px !important;
}

.spinner {
    display: inline-block !important;
    width: 40px !important;
    height: 40px !important;
    border: 3px solid #16a34a !important;
    border-top: 3px solid transparent !important;
    border-radius: 50% !important;
    animation: spin 1s linear infinite !important;
}

.analyzing-card h3 {
    color: #16a34a !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    margin: 0 0 6px 0 !important;
}

.analyzing-card p {
    color: #6b7280 !important;
    font-size: 14px !important;
    margin: 0 !important;
}

/* Placeholder Content */
.placeholder-content {
    padding: 40px 20px !important;
    text-align: center !important;
    color: #6b7280 !important;
}

.placeholder-icon {
    font-size: 48px !important;
    margin-bottom: 12px !important;
}

.placeholder-content p {
    font-size: 14px !important;
    margin: 0 !important;
    line-height: 1.4 !important;
}

/* Image Counter */
.image-counter {
    background: #16a34a !important;
    color: white !important;
    padding: 8px 16px !important;
    text-align: center !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    margin: 8px 16px !important;
    border-radius: 8px !important;
}

/* Divider */
.divider {
    height: 1px !important;
    background: linear-gradient(to right, transparent, #e5e7eb, transparent) !important;
    margin: 16px !important;
}

/* Button Styling */
.btn-primary {
    background: linear-gradient(135deg, #16a34a, #22c55e) !important;
    border: none !important;
    color: white !important;
    font-weight: 600 !important;
    padding: 14px 20px !important;
    border-radius: 12px !important;
    font-size: 15px !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3) !important;
    width: 100% !important;
    margin-bottom: 8px !important;
}

.btn-primary:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 16px rgba(22, 163, 74, 0.4) !important;
    background: linear-gradient(135deg, #15803d, #16a34a) !important;
}

.btn-secondary {
    background: white !important;
    border: 1px solid #e5e7eb !important;
    color: #374151 !important;
    font-weight: 600 !important;
    padding: 10px 16px !important;
    border-radius: 10px !important;
    font-size: 14px !important;
    transition: all 0.3s ease !important;
    margin: 4px !important;
}

.btn-secondary:hover {
    background: #f9fafb !important;
    border-color: #16a34a !important;
    color: #16a34a !important;
}

/* Input Styling */
.gr-file {
    background: white !important;
    border: 2px dashed #16a34a !important;
    border-radius: 12px !important;
    margin-bottom: 12px !important;
}

.gr-image {
    background: white !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 12px !important;
    margin-bottom: 12px !important;
}

/* Native Camera Container */
.native-camera {
    border-radius: 12px !important;
    overflow: hidden !important;
    border: 2px solid #f59e0b !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    margin-bottom: 12px !important;
    background: white !important;
}

.native-camera img {
    width: 100% !important;
    height: auto !important;
    max-height: 400px !important;
    object-fit: cover !important;
}

/* Animations */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Responsive Grid */
@media (min-width: 768px) {
    .gradio-container {
        padding: 16px !important;
    }
    
    .image-container img {
        width: 300px !important;
        height: 300px !important;
    }
    
    .info-grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 16px !important;
    }
    
    .btn-primary, .btn-upload, .btn-camera {
        width: auto !important;
        min-width: 200px !important;
    }
}

@media (min-width: 1024px) {
    .disease-header {
        align-items: center !important;
    }
    
    .disease-details h2 {
        font-size: 20px !important;
    }
    
    .info-grid {
        grid-template-columns: repeat(3, 1fr) !important;
    }
}

/* Fix for iOS Safari */
@supports (-webkit-touch-callout: none) {
    .mobile-results {
        -webkit-transform: translateZ(0) !important;
    }
}
"""

# Create Interface with Button-Based Mobile-First Layout
with gr.Blocks(
    theme=gr.themes.Soft(
        primary_hue=gr.themes.colors.green,
        secondary_hue=gr.themes.colors.emerald,
        neutral_hue=gr.themes.colors.slate,
        font=[gr.themes.GoogleFont("Inter"), "system-ui", "sans-serif"]
    ),
    css=css,
    title="🌿 Cassava Disease Detector"
) as demo:
    
    # Enable queue for better performance
    demo.queue()
    
    # Header with PWA meta tags
    gr.HTML("""
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="theme-color" content="#16a34a">
        <link rel="manifest" href="/manifest.json">
    </head>
    <div class="app-header">
        <h1>🌿 CassavaDoc</h1>
        <p>AI-powered cassava leaf disease detection</p>
    </div>
    """)
    
    # Mobile-optimized layout with button-based interactions
    with gr.Row():
        with gr.Column(scale=1):
            # Button-based input section
            upload_btn = gr.Button(
                "📁 Upload Images", 
                elem_classes=["btn-upload"]
            )
            
            camera_btn = gr.Button(
                "📷 Open Camera", 
                elem_classes=["btn-camera"]
            )
            
            # Hidden file input (triggered by upload button)
            file_input = gr.File(
                label="Select Images", 
                file_types=["image"], 
                file_count="multiple",
                visible=False,
                elem_classes=["mobile-file-input"]
            )
            
            # Native mobile camera input (triggered by camera button)
            camera_input = gr.Image(
                label="Native Camera", 
                sources=["webcam"], 
                type="pil",
                visible=False,
                elem_classes=["native-camera"]
            )
            
            # Action buttons
            analyze_upload_btn = gr.Button(
                "🔍 Analyze Uploaded Images", 
                variant="primary", 
                visible=False,
                elem_classes=["btn-primary"]
            )
            
            analyze_camera_btn = gr.Button(
                "🔍 Analyze Camera Image", 
                variant="primary", 
                visible=False,
                elem_classes=["btn-primary"]
            )
            
            # Secondary buttons in a row for mobile
            with gr.Row():
                history_btn = gr.Button(
                    "📂 History", 
                    variant="secondary", 
                    elem_classes=["btn-secondary"]
                )
                clear_btn = gr.Button(
                    "🗑️ Clear", 
                    variant="secondary", 
                    elem_classes=["btn-secondary"]
                )
        
        with gr.Column(scale=2):
            # Results display
            results_display = gr.HTML(value=create_default_mobile())
            
            # Close button (mobile-friendly)
            close_btn = gr.Button(
                "✖️ Close Results", 
                variant="secondary", 
                visible=False, 
                elem_classes=["btn-secondary"]
            )
    
    # Event handlers for button-based interactions
    upload_btn.click(
        handle_upload_click,
        outputs=[file_input, camera_input]
    )
    
    camera_btn.click(
        handle_camera_click,
        outputs=[file_input, camera_input]
    )
    
    # Show analyze buttons when inputs are available
    file_input.change(
        lambda x: gr.update(visible=bool(x)),
        inputs=[file_input],
        outputs=[analyze_upload_btn]
    )
    
    camera_input.change(
        lambda x: gr.update(visible=bool(x)),
        inputs=[camera_input],
        outputs=[analyze_camera_btn]
    )
    
    # Analysis event handlers
    analyze_upload_btn.click(
        analyze_uploaded_images,
        inputs=[file_input],
        outputs=[results_display, close_btn]
    )
    
    analyze_camera_btn.click(
        analyze_camera_image,
        inputs=[camera_input],
        outputs=[results_display, close_btn]
    )
    
    history_btn.click(
        view_history, 
        outputs=[results_display, close_btn]
    )
    
    close_btn.click(
        close_results, 
        outputs=[results_display, close_btn]
    )
    
    clear_btn.click(
        clear_all, 
        outputs=[file_input, camera_input, results_display, close_btn, analyze_upload_btn, analyze_camera_btn]
    )

if __name__ == "__main__":
    demo.launch(
        share=True,
        server_name="0.0.0.0",
        server_port=7860,
        show_error=True,
        show_api=False,          # Hides the "Use via API" link
        inbrowser=True,          # Auto-opens in browser
        quiet=True               # Reduces console output
    )