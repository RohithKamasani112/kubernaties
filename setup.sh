#!/bin/bash

# SAMWI Learn Platform Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up SAMWI Learn Platform..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm 8+"
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install workspace dependencies
    npm run install:all
    
    print_success "All dependencies installed"
}

# Create environment files
create_env_files() {
    print_status "Creating environment files..."
    
    # Main web frontend
    if [ ! -f "apps/web-frontend/.env" ]; then
        cat > apps/web-frontend/.env << EOF
# SAMWI Learn Web Frontend Environment
VITE_APP_NAME=SAMWI Learn
VITE_APP_VERSION=1.0.0
VITE_API_URL=http://localhost:8000
VITE_ENABLE_ANALYTICS=false
EOF
        print_success "Created apps/web-frontend/.env"
    fi
    
    # Kubernetes module
    if [ ! -f "modules/kubernetes-course/.env" ]; then
        cat > modules/kubernetes-course/.env << EOF
# Kubernetes Course Module Environment
VITE_MODULE_NAME=Kubernetes Course
VITE_ENABLE_PLAYGROUND=true
VITE_ENABLE_YAML_VALIDATION=true
EOF
        print_success "Created modules/kubernetes-course/.env"
    fi
    
    # Cloud Architecture module
    if [ ! -f "modules/cloud-architecture/.env" ]; then
        cat > modules/cloud-architecture/.env << EOF
# Cloud Architecture Module Environment
VITE_MODULE_NAME=Cloud Architecture Studio
VITE_ENABLE_GAMIFICATION=true
VITE_ENABLE_SECURITY_ANALYSIS=true
VITE_ENABLE_EXPORT=true
VITE_ENABLE_ANIMATIONS=true
EOF
        print_success "Created modules/cloud-architecture/.env"
    fi
}

# Create additional configuration files
create_config_files() {
    print_status "Creating configuration files..."
    
    # VSCode settings
    mkdir -p .vscode
    if [ ! -f ".vscode/settings.json" ]; then
        cat > .vscode/settings.json << EOF
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["clsx\\(([^)]*)\\)", "'([^']*)'"]
  ]
}
EOF
        print_success "Created .vscode/settings.json"
    fi
    
    # VSCode extensions
    if [ ! -f ".vscode/extensions.json" ]; then
        cat > .vscode/extensions.json << EOF
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
EOF
        print_success "Created .vscode/extensions.json"
    fi
    
    # Git hooks
    if [ ! -f ".husky/pre-commit" ]; then
        mkdir -p .husky
        cat > .husky/pre-commit << EOF
#!/bin/sh
. "\$(dirname "\$0")/_/husky.sh"

npm run lint
npm run type-check
EOF
        chmod +x .husky/pre-commit
        print_success "Created Git pre-commit hook"
    fi
}

# Build the project
build_project() {
    print_status "Building the project..."
    npm run build
    print_success "Project built successfully"
}

# Start development servers
start_dev_servers() {
    print_status "Starting development servers..."
    print_warning "This will start all development servers. Press Ctrl+C to stop."
    print_status "Main Platform: http://localhost:3000"
    print_status "Kubernetes Module: http://localhost:3001"
    print_status "Cloud Architecture: http://localhost:3002"
    
    # Give user option to start servers
    read -p "Start development servers now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run dev
    else
        print_status "You can start the development servers later with: npm run dev"
    fi
}

# Main setup process
main() {
    echo
    print_status "Checking prerequisites..."
    check_node
    check_npm
    
    echo
    print_status "Setting up project..."
    install_dependencies
    create_env_files
    create_config_files
    
    echo
    print_status "Building project..."
    build_project
    
    echo
    print_success "✅ SAMWI Learn Platform setup complete!"
    echo
    echo "🎉 Next steps:"
    echo "   1. Start development: npm run dev"
    echo "   2. Open http://localhost:3000 in your browser"
    echo "   3. Explore the Kubernetes and Cloud Architecture modules"
    echo
    echo "📚 Documentation:"
    echo "   - README.md for detailed information"
    echo "   - Individual module documentation in modules/*/README.md"
    echo
    echo "🤝 Need help?"
    echo "   - Email: samwi.global@gmail.com"
    echo "   - LinkedIn: https://www.linkedin.com/company/samwi/"
    echo
    
    start_dev_servers
}

# Run main function
main "$@"
