#!/usr/bin/env python3
"""
Access Check Script for Cassava Leaf Disease Detector
"""

import requests
import socket
import subprocess
import sys

def check_local_access():
    """Check if the application is accessible locally"""
    print("🔍 Checking local access...")
    
    try:
        response = requests.get("http://localhost:7860", timeout=5)
        if response.status_code == 200:
            print("✅ Application is accessible at http://localhost:7860")
            print(f"   Status Code: {response.status_code}")
            print(f"   Content Length: {len(response.text)} bytes")
            return True
        else:
            print(f"❌ Application returned status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot access application: {e}")
        return False

def check_network_info():
    """Get network information"""
    print("\n🌐 Network Information:")
    
    try:
        # Get hostname
        hostname = socket.gethostname()
        print(f"   Hostname: {hostname}")
        
        # Get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        print(f"   Local IP: {local_ip}")
        print(f"   Try accessing: http://{local_ip}:7860")
        
    except Exception as e:
        print(f"   Error getting network info: {e}")

def check_process():
    """Check if the Python process is running"""
    print("\n🔧 Process Information:")
    
    try:
        result = subprocess.run(['ps', 'aux'], capture_output=True, text=True)
        python_processes = [line for line in result.stdout.split('\n') if 'python' in line and 'app_simple.py' in line]
        
        if python_processes:
            print("✅ Application process is running:")
            for process in python_processes:
                print(f"   {process.strip()}")
        else:
            print("❌ No application process found")
            
    except Exception as e:
        print(f"   Error checking processes: {e}")

def provide_solutions():
    """Provide potential solutions"""
    print("\n💡 Troubleshooting Solutions:")
    print("   1. If running in a container/VM, make sure port 7860 is exposed")
    print("   2. If using a cloud service, check security groups/firewall rules")
    print("   3. Try accessing via the network IP address shown above")
    print("   4. If running remotely, you might need to use SSH port forwarding:")
    print("      ssh -L 7860:localhost:7860 user@your-server")
    print("   5. Check if your browser is blocking the connection")
    print("   6. Try a different browser or incognito mode")

if __name__ == "__main__":
    print("🌿 Cassava Leaf Disease Detector - Access Check")
    print("=" * 50)
    
    check_process()
    local_ok = check_local_access()
    check_network_info()
    provide_solutions()
    
    if local_ok:
        print("\n🎉 The application is running correctly!")
        print("   If you still can't access it, the issue is likely network-related.")
    else:
        print("\n⚠️  The application may not be running properly.")
        print("   Try restarting it with: python3 app_simple.py")