#!/usr/bin/env python3
"""
Simple Cassava Leaf Disease Detector Demo
A basic version that will definitely work on your local machine
"""

import gradio as gr
import numpy as np
from PIL import Image
import random

# Disease information
DISEASES = {
    "Healthy": {
        "description": "✅ Your cassava plant looks healthy!",
        "recommendation": "Continue good care practices."
    },
    "Cassava Bacterial Blight": {
        "description": "⚠️ Bacterial infection detected.",
        "recommendation": "Remove affected leaves and apply copper fungicide."
    },
    "Cassava Brown Streak": {
        "description": "⚠️ Viral disease affecting stems and roots.",
        "recommendation": "Use resistant varieties and control whitefly."
    },
    "Cassava Mosaic Disease": {
        "description": "⚠️ Common viral disease with leaf patterns.",
        "recommendation": "Plant resistant varieties and control vectors."
    },
    "Cassava Green Mottle": {
        "description": "⚠️ Viral disease with mottled leaf patterns.",
        "recommendation": "Use clean planting material."
    }
}

def analyze_leaf(image):
    """
    Analyze the uploaded cassava leaf image
    This is a demo version - in reality you'd use a trained AI model
    """
    if image is None:
        return "Please upload an image first!", "", ""
    
    # For demo purposes, we'll randomly select a disease
    # In a real app, this would be AI analysis
    disease_names = list(DISEASES.keys())
    detected_disease = random.choice(disease_names)
    confidence = random.randint(75, 95)
    
    # Get disease info
    disease_info = DISEASES[detected_disease]
    
    # Create result
    result = f"🔍 **Analysis Result**\n\n"
    result += f"**Detected:** {detected_disease}\n"
    result += f"**Confidence:** {confidence}%\n\n"
    result += f"**Description:** {disease_info['description']}\n\n"
    result += f"**Recommendation:** {disease_info['recommendation']}"
    
    return result, f"Confidence: {confidence}%", detected_disease

# Create the Gradio interface
with gr.Blocks(title="🌿 Cassava Leaf Disease Detector") as demo:
    gr.Markdown("""
    # 🌿 Cassava Leaf Disease Detector
    
    Upload an image of a cassava leaf to detect potential diseases.
    
    **Supported diseases:**
    - Cassava Bacterial Blight (CBB)
    - Cassava Brown Streak Disease (CBSD) 
    - Cassava Green Mottle (CGM)
    - Cassava Mosaic Disease (CMD)
    - Healthy plants
    """)
    
    with gr.Row():
        with gr.Column():
            # Image input
            image_input = gr.Image(
                label="Upload Cassava Leaf Image",
                type="pil",
                height=400
            )
            
            # Analyze button
            analyze_btn = gr.Button("🔍 Analyze Leaf", variant="primary", size="lg")
        
        with gr.Column():
            # Results
            result_text = gr.Markdown(label="Analysis Results")
            confidence_text = gr.Textbox(label="Confidence Level", interactive=False)
            disease_text = gr.Textbox(label="Detected Condition", interactive=False)
    
    # Example images section
    gr.Markdown("### 📸 Try with sample images:")
    gr.Markdown("You can upload any plant leaf image to test the interface!")
    
    # Connect the analyze button
    analyze_btn.click(
        fn=analyze_leaf,
        inputs=[image_input],
        outputs=[result_text, confidence_text, disease_text]
    )

if __name__ == "__main__":
    print("🌿 Starting Cassava Leaf Disease Detector...")
    print("📱 This will open in your web browser automatically")
    print("🔗 If it doesn't open, go to: http://localhost:7860")
    print("⏹️  Press Ctrl+C to stop the application")
    print("-" * 50)
    
    # Launch the app
    demo.launch(
        server_name="127.0.0.1",  # Only local access
        server_port=7860,
        share=False,
        inbrowser=True,  # Automatically open browser
        show_error=True,
        quiet=False
    )