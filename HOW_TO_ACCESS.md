# 🌿 How to Access Your Cassava Leaf Disease Detector

## ✅ **Your App is Running!**

The Cassava Leaf Disease Detector is currently **running** on your system.

## 🌐 **How to Access:**

### **Option 1: Direct Browser Access**
Open your web browser and go to:
```
http://localhost:7860
```

### **Option 2: Alternative Local Address**
If localhost doesn't work, try:
```
http://127.0.0.1:7860
```

## 🔍 **What You'll See:**

When you open the URL, you'll see:
- **🌿 Cassava Leaf Disease Detector** - Main title
- **Upload area** - Drag and drop or click to upload leaf images
- **Analyze button** - Click to detect diseases
- **Results panel** - Shows detected condition and recommendations

## 🖼️ **How to Use:**

1. **Upload an Image**: Click the upload area or drag a leaf image
2. **Click Analyze**: Press the "🔍 Analyze Leaf" button  
3. **View Results**: See the detected disease and treatment recommendations

## 🏥 **Diseases It Can Detect:**

- ✅ **Healthy** plants
- ⚠️ **Cassava Bacterial Blight** (CBB)
- ⚠️ **Cassava Brown Streak Disease** (CBSD)
- ⚠️ **Cassava Green Mottle** (CGM) 
- ⚠️ **Cassava Mosaic Disease** (CMD)

## 🛠️ **Troubleshooting:**

### If you can't access the URL:

1. **Check if it's running:**
   ```bash
   ps aux | grep python
   ```
   You should see: `python3 simple_demo.py`

2. **Restart if needed:**
   ```bash
   pkill -f simple_demo
   python3 simple_demo.py
   ```

3. **Try different browsers:**
   - Chrome
   - Firefox
   - Safari
   - Edge

### **Still having issues?**
- Make sure no firewall is blocking port 7860
- Try incognito/private browsing mode
- Check if another application is using port 7860

## ⏹️ **To Stop the App:**
```bash
pkill -f simple_demo
```

---

## 📁 **Files in Your Project:**

- `simple_demo.py` - Main application (currently running)
- `app_simple.py` - Advanced version with ML features
- `requirements.txt` - Dependencies needed
- `README.md` - Full project documentation

**🎉 Your Cassava Disease Detector is ready to use!**