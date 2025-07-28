# Samwi Learn - Interactive Technology Learning Platform

A comprehensive, modular learning platform for modern technologies including Kubernetes and Cloud Architecture. Built with React, TypeScript, and modern web technologies.

## 🏗️ Architecture Overview

```
/samwi-learn/
│
├── apps/
│   ├── web-frontend/           # Main user interface (React/Vite)
│   └── backend-api/            # API server (Future)
│
├── modules/
│   ├── kubernetes-course/      # Kubernetes learning module
│   └── cloud-architecture/     # Cloud architecture learning studio
│
├── shared/
│   ├── ui/                     # Shared UI components library
│   ├── utils/                  # Reusable utilities
│   ├── auth/                   # Authentication logic (Future)
│   └── llm-agent/              # LLM integration (Future)
│
├── package.json                # Monorepo configuration
├── turbo.json                  # Build system configuration
└── README.md                   # This file
```

## ✨ Features

### 🎯 **Main Platform**
- **Interactive Landing Page**: Beautiful, responsive design with course showcase
- **Modular Architecture**: Separate modules for different learning topics
- **Shared Component Library**: Consistent UI across all modules
- **Progress Tracking**: Global user progress and achievements
- **Responsive Design**: Works seamlessly on all devices

### ☸️ **Kubernetes Module**
- **Interactive Playground**: Real Kubernetes cluster simulations
- **YAML Editor**: Monaco-based editor with syntax highlighting
- **Visual Learning**: Component diagrams and architecture visualization
- **Hands-on Labs**: Step-by-step guided exercises
- **Troubleshooting Scenarios**: Real-world problem-solving

### ☁️ **Cloud Architecture Studio**
- **Three-Pane Learning Interface**: Tutorial + Code + Visualization
- **Multi-Cloud Support**: AWS, Azure, GCP, and Kubernetes
- **Visual Architecture Builder**: Drag-and-drop component design
- **Security Analysis Engine**: Real-time security validation
- **Export Capabilities**: Multiple formats (Terraform, YAML, JSON, PDF)
- **Gamification System**: Achievements, levels, and progress tracking
- **Interactive Animations**: Flow visualization and component interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/samwi-learn/samwi-learn.git
   cd samwi-learn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   # Start all modules
   npm run dev

   # Or start specific modules
   npm run start:web          # Main web frontend
   npm run start:k8s          # Kubernetes module
   npm run start:cloud        # Cloud architecture module
   ```

4. **Open in browser**
   - Main Platform: http://localhost:3000
   - Kubernetes Module: http://localhost:3001
   - Cloud Architecture: http://localhost:3002

## 🛠️ Development

### Project Structure

#### **Apps Directory**
- `web-frontend/`: Main landing page and navigation
- `backend-api/`: Future API server implementation

#### **Modules Directory**
- `kubernetes-course/`: Complete Kubernetes learning environment
- `cloud-architecture/`: Advanced cloud architecture studio

#### **Shared Directory**
- `ui/`: Reusable React components with consistent styling
- `utils/`: Common utilities and helper functions
- `auth/`: Authentication and authorization logic (future)
- `llm-agent/`: AI/LLM integration capabilities (future)

### Available Scripts

```bash
# Development
npm run dev                    # Start all modules in development mode
npm run start:web             # Start main web frontend only
npm run start:k8s             # Start Kubernetes module only
npm run start:cloud           # Start cloud architecture module only

# Building
npm run build                 # Build all modules
npm run build:all             # Build all workspaces

# Testing & Quality
npm run test                  # Run tests across all modules
npm run lint                  # Lint all code
npm run type-check            # TypeScript type checking
npm run format                # Format code with Prettier

# Utilities
npm run clean                 # Clean build artifacts
npm install:all               # Install dependencies for all workspaces
```

### Adding New Modules

1. **Create module directory**
   ```bash
   mkdir modules/new-module
   cd modules/new-module
   ```

2. **Initialize package.json**
   ```json
   {
     "name": "new-module",
     "version": "1.0.0",
     "private": true,
     "dependencies": {
       "shared-ui": "*",
       "shared-utils": "*"
     }
   }
   ```

3. **Add to workspace**
   The module will be automatically included due to the workspace configuration.

## 🎨 UI Design System

### Design Principles
- **Consistent**: Shared component library ensures visual consistency
- **Accessible**: WCAG 2.1 AA compliant design
- **Responsive**: Mobile-first approach with breakpoint system
- **Interactive**: Smooth animations and micro-interactions
- **Modern**: Clean, minimalist design with subtle gradients

### Color Palette
```css
/* Primary Colors */
--blue-600: #2563eb;
--purple-600: #9333ea;
--pink-600: #db2777;

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;

/* Neutral Colors */
--slate-50: #f8fafc;
--slate-900: #0f172a;
```

### Typography
- **Primary Font**: Inter (system fallback)
- **Monospace Font**: JetBrains Mono (code blocks)
- **Font Sizes**: Responsive scale from 12px to 48px

## 🔧 Configuration

### Environment Variables
Create `.env` files in each module as needed:

```bash
# apps/web-frontend/.env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Samwi Learn

# modules/cloud-architecture/.env
VITE_ENABLE_ANALYTICS=true
VITE_GAMIFICATION_ENABLED=true
```

### Build Configuration
- **Vite**: Modern build tool with HMR
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

## 📚 Module Documentation

### Kubernetes Course Module
Located in `modules/kubernetes-course/`

**Features:**
- Interactive Kubernetes playground
- Step-by-step tutorials
- YAML configuration editor
- Cluster visualization
- Troubleshooting scenarios

**Key Components:**
- `KubernetesPlayground`: Main interactive environment
- `YAMLEditor`: Monaco-based code editor
- `ClusterVisualizer`: Architecture diagrams
- `TutorialPane`: Guided learning interface

### Cloud Architecture Module
Located in `modules/cloud-architecture/`

**Features:**
- Three-pane learning interface (Tutorial + Code + Canvas)
- Multi-cloud service library (25+ services)
- Security analysis engine with OWASP compliance
- Gamification system with achievements
- Export capabilities (7+ formats)
- Interactive flow animations

**Key Components:**
- `InteractiveLearningPath`: Main learning interface
- `CloudCanvasBuilder`: Visual architecture builder
- `SecurityDashboard`: Real-time security analysis
- `ProgressDashboard`: Achievement tracking
- `ProjectManager`: Save/load/export functionality

## 🚀 Deployment

### Development Deployment
```bash
npm run build
npm run preview
```

### Production Deployment

#### Using Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Using Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

#### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
- Add proper JSDoc comments
- Include unit tests for utilities
- Use semantic commit messages

### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Include accessibility attributes
- Follow responsive design patterns
- Use shared UI components when possible

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Monaco Editor** for the code editing experience
- **Lucide React** for beautiful icons

## 📞 Support

- **Email**: samwi.global@gmail.com
- **LinkedIn**: [Samwi Company Page](https://www.linkedin.com/company/samwi/)

---

**Built with ❤️ by the Samwi Learn Team**
