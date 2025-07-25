#!/bin/bash

# 🌿 CassavaDoc Environment Setup Script
# This script ensures a consistent development environment

echo "🌿 CassavaDoc Mobile App - Environment Setup"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Check if running on supported OS
check_os() {
    print_info "Checking operating system..."
    case "$OSTYPE" in
        linux-gnu*) 
            OS="Linux"
            print_status "Running on Linux"
            ;;
        darwin*) 
            OS="macOS"
            print_status "Running on macOS"
            ;;
        cygwin*|msys*|mingw*) 
            OS="Windows"
            print_status "Running on Windows"
            ;;
        *) 
            print_error "Unsupported operating system: $OSTYPE"
            exit 1
            ;;
    esac
}

# Check Node.js version
check_node() {
    print_info "Checking Node.js version..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        print_info "Please install Node.js 16.x or 18.x from: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    
    if [[ $NODE_MAJOR -ge 16 && $NODE_MAJOR -le 18 ]]; then
        print_status "Node.js version: $NODE_VERSION (Compatible)"
    else
        print_error "Node.js version $NODE_VERSION is not supported!"
        print_info "Please install Node.js 16.x or 18.x"
        exit 1
    fi
}

# Check npm version
check_npm() {
    print_info "Checking npm version..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed!"
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_status "npm version: $NPM_VERSION"
}

# Check/Install Expo CLI
check_expo_cli() {
    print_info "Checking Expo CLI..."
    
    if ! command -v expo &> /dev/null; then
        print_warning "Expo CLI not found. Installing globally..."
        npm install -g @expo/cli
        
        if [ $? -eq 0 ]; then
            print_status "Expo CLI installed successfully"
        else
            print_error "Failed to install Expo CLI"
            exit 1
        fi
    else
        EXPO_VERSION=$(expo --version)
        print_status "Expo CLI version: $EXPO_VERSION"
    fi
}

# Check/Install EAS CLI
check_eas_cli() {
    print_info "Checking EAS CLI..."
    
    if ! command -v eas &> /dev/null; then
        print_warning "EAS CLI not found. Installing globally..."
        npm install -g eas-cli
        
        if [ $? -eq 0 ]; then
            print_status "EAS CLI installed successfully"
        else
            print_error "Failed to install EAS CLI"
            exit 1
        fi
    else
        EAS_VERSION=$(eas --version)
        print_status "EAS CLI version: $EAS_VERSION"
    fi
}

# Clean previous installations
clean_install() {
    print_info "Cleaning previous installations..."
    
    # Remove node_modules and lock files
    if [ -d "node_modules" ]; then
        print_info "Removing node_modules..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        print_info "Removing package-lock.json..."
        rm package-lock.json
    fi
    
    if [ -f "yarn.lock" ]; then
        print_info "Removing yarn.lock..."
        rm yarn.lock
    fi
    
    # Clear npm cache
    print_info "Clearing npm cache..."
    npm cache clean --force
    
    print_status "Clean completed"
}

# Install dependencies
install_dependencies() {
    print_info "Installing project dependencies..."
    
    # Set npm registry (optional: use if having issues)
    npm config set registry https://registry.npmjs.org/
    
    # Install dependencies
    npm install
    
    if [ $? -eq 0 ]; then
        print_status "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        print_info "Trying with legacy peer deps..."
        npm install --legacy-peer-deps
        
        if [ $? -eq 0 ]; then
            print_status "Dependencies installed with legacy peer deps"
        else
            print_error "Failed to install dependencies even with legacy peer deps"
            exit 1
        fi
    fi
}

# Fix Expo dependencies
fix_expo_dependencies() {
    print_info "Fixing Expo dependencies..."
    
    npx expo install --fix
    
    if [ $? -eq 0 ]; then
        print_status "Expo dependencies fixed"
    else
        print_warning "Expo fix had some issues, but continuing..."
    fi
}

# Verify installation
verify_installation() {
    print_info "Verifying installation..."
    
    # Check if critical packages are installed
    CRITICAL_PACKAGES=(
        "expo"
        "react"
        "react-native"
        "@react-navigation/native"
        "expo-camera"
        "expo-image-picker"
    )
    
    for package in "${CRITICAL_PACKAGES[@]}"; do
        if npm list "$package" &> /dev/null; then
            print_status "$package is installed"
        else
            print_error "$package is missing!"
            exit 1
        fi
    done
}

# Create run script
create_run_script() {
    print_info "Creating run script..."
    
    cat > run-app.sh << 'EOF'
#!/bin/bash

echo "🌿 Starting CassavaDoc Mobile App"
echo "================================="

# Check if Expo CLI is available
if ! command -v expo &> /dev/null; then
    echo "❌ Expo CLI not found. Please run setup-environment.sh first"
    exit 1
fi

# Start Expo development server
echo "🚀 Starting Expo development server..."
expo start --clear

EOF

    chmod +x run-app.sh
    print_status "Run script created: ./run-app.sh"
}

# Create troubleshooting guide
create_troubleshooting_guide() {
    print_info "Creating troubleshooting guide..."
    
    cat > TROUBLESHOOTING.md << 'EOF'
# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. Module Resolution Errors
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 2. Metro Bundler Issues
```bash
# Clear Metro cache
npx expo start --clear
# or
npx react-native start --reset-cache
```

### 3. Expo CLI Issues
```bash
# Reinstall Expo CLI
npm uninstall -g @expo/cli
npm install -g @expo/cli@latest
```

### 4. Native Module Issues
```bash
# Fix Expo dependencies
npx expo install --fix
```

### 5. Version Conflicts
```bash
# Install with legacy peer deps
npm install --legacy-peer-deps
```

### 6. Platform-Specific Issues

#### Windows
- Use Git Bash or PowerShell as Administrator
- Enable Developer Mode in Windows Settings
- Install Windows Build Tools: `npm install -g windows-build-tools`

#### macOS
- Install Xcode from App Store
- Install Xcode Command Line Tools: `xcode-select --install`
- Install Cocoapods: `sudo gem install cocoapods`

#### Linux
- Install build essentials: `sudo apt-get install build-essential`
- Install Python: `sudo apt-get install python3-dev`

## Environment Requirements

- **Node.js**: 16.x or 18.x (not 19.x or 20.x)
- **npm**: 8.x or higher
- **Expo CLI**: Latest version
- **EAS CLI**: Latest version (for building)

## Quick Fix Commands

```bash
# Full reset
./setup-environment.sh

# Quick restart
npx expo start --clear

# Fix dependencies
npx expo install --fix

# Check versions
node --version
npm --version
expo --version
```

EOF

    print_status "Troubleshooting guide created: TROUBLESHOOTING.md"
}

# Main execution
main() {
    echo ""
    print_info "Starting environment setup..."
    echo ""
    
    check_os
    check_node
    check_npm
    check_expo_cli
    check_eas_cli
    clean_install
    install_dependencies
    fix_expo_dependencies
    verify_installation
    create_run_script
    create_troubleshooting_guide
    
    echo ""
    echo "🎉 Environment setup completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Run the app: ./run-app.sh"
    echo "2. Or manually: npm start"
    echo "3. Scan QR code with Expo Go app"
    echo ""
    print_info "If you encounter issues, check TROUBLESHOOTING.md"
    echo ""
}

# Run main function
main