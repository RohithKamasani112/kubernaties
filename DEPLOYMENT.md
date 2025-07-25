# Deployment Guide - SAMWI Learn Platform

This guide covers various deployment options for the SAMWI Learn platform.

## 🏗️ Build Process

### Development Build
```bash
npm run dev          # Start all modules in development
npm run start:web    # Start main platform only
npm run start:cloud  # Start cloud architecture module only
```

### Production Build
```bash
npm run build        # Build all modules for production
npm run preview      # Preview production build locally
```

## 🚀 Deployment Options

### 1. Vercel (Recommended)

**Automatic Deployment:**
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the monorepo structure
3. Configure build settings for each app:

```json
{
  "builds": [
    {
      "src": "apps/web-frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/kubernetes/(.*)",
      "dest": "/modules/kubernetes-course/$1"
    },
    {
      "src": "/cloud-architecture/(.*)",
      "dest": "/modules/cloud-architecture/$1"
    }
  ]
}
```

**Manual Deployment:**
```bash
npm install -g vercel
vercel --prod
```

### 2. Netlify

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `apps/web-frontend/dist`

**Redirects (_redirects file):**
```
/kubernetes/*  /modules/kubernetes-course/index.html  200
/cloud-architecture/*  /modules/cloud-architecture/index.html  200
/*  /index.html  200
```

### 3. AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Upload to S3
aws s3 sync apps/web-frontend/dist s3://your-bucket-name --delete
aws s3 sync modules/kubernetes-course/dist s3://your-bucket-name/kubernetes --delete
aws s3 sync modules/cloud-architecture/dist s3://your-bucket-name/cloud-architecture --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 4. Docker Deployment

**Dockerfile:**
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY turbo.json ./
COPY apps/ ./apps/
COPY modules/ ./modules/
COPY shared/ ./shared/

RUN npm ci
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/apps/web-frontend/dist /usr/share/nginx/html
COPY --from=builder /app/modules/kubernetes-course/dist /usr/share/nginx/html/kubernetes
COPY --from=builder /app/modules/cloud-architecture/dist /usr/share/nginx/html/cloud-architecture

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Main app
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Kubernetes module
        location /kubernetes {
            alias /usr/share/nginx/html/kubernetes;
            try_files $uri $uri/ /kubernetes/index.html;
        }

        # Cloud architecture module
        location /cloud-architecture {
            alias /usr/share/nginx/html/cloud-architecture;
            try_files $uri $uri/ /cloud-architecture/index.html;
        }

        # Enable gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
}
```

**Build and run:**
```bash
docker build -t samwi-learn .
docker run -p 80:80 samwi-learn
```

### 5. GitHub Pages

**GitHub Actions Workflow (.github/workflows/deploy.yml):**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./apps/web-frontend/dist
```

## 🔧 Environment Configuration

### Production Environment Variables

**Main Platform (.env.production):**
```bash
VITE_APP_NAME=SAMWI Learn
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.samwilearn.com
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

**Cloud Architecture Module:**
```bash
VITE_MODULE_NAME=Cloud Architecture Studio
VITE_ENABLE_GAMIFICATION=true
VITE_ENABLE_SECURITY_ANALYSIS=true
VITE_ENABLE_EXPORT=true
VITE_ENABLE_ANIMATIONS=true
VITE_API_ENDPOINT=https://api.samwilearn.com/cloud
```

## 📊 Performance Optimization

### Build Optimization
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          editor: ['@monaco-editor/react', 'monaco-editor']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### CDN Configuration
```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/jetbrains-mono.woff2" as="font" type="font/woff2" crossorigin>

<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//api.samwilearn.com">
```

## 🔒 Security Configuration

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.samwilearn.com;
">
```

### Security Headers
```nginx
# Add security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## 📈 Monitoring & Analytics

### Error Tracking
```javascript
// Add to main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

### Performance Monitoring
```javascript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist .turbo
npm run build
```

**Memory Issues:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Module Resolution:**
```bash
# Check workspace configuration
npm ls --workspaces
npm run type-check
```

### Health Checks

**Basic Health Check:**
```bash
curl -f http://localhost:3000 || exit 1
curl -f http://localhost:3000/kubernetes || exit 1
curl -f http://localhost:3000/cloud-architecture || exit 1
```

**Advanced Monitoring:**
```javascript
// Add to each module
const healthCheck = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: process.env.VITE_APP_VERSION,
  uptime: process.uptime()
};
```

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Build process tested locally
- [ ] Security headers implemented
- [ ] Performance optimization applied
- [ ] Error tracking configured
- [ ] Health checks implemented
- [ ] CDN configuration optimized
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Monitoring and alerts set up

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Production
        run: |
          # Your deployment script here
          echo "Deploying to production..."
```

---

For more deployment options and advanced configurations, please refer to the individual module documentation or contact the development team.
