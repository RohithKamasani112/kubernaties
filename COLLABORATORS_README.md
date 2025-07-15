# Collaborators Management Guide

This guide explains how to add new collaborators to the KubeQuest platform.

## Overview

The collaborators feature displays team members with their photos and LinkedIn profiles in a beautiful modal accessible from every page via a floating action button.

## Adding New Collaborators

### Step 1: Prepare the Image

1. **Image Requirements:**
   - Format: JPG, PNG, WebP, or GIF
   - Recommended size: 150x150px (square)
   - Good quality headshot/profile photo
   - File size: < 500KB for optimal loading

2. **Upload to S3:**
   - Upload the image to your S3 bucket under the `collaborators/` folder
   - Example: `collaborators/john-smith.jpg`
   - Make sure the image is publicly accessible

### Step 2: Add Collaborator Data

1. **Open the collaborators file:**
   ```
   src/data/collaborators.ts
   ```

2. **Add new collaborator to the array:**
   ```typescript
   {
     id: "7", // Use next available number
     name: "John Smith",
     role: "Backend Developer",
     imageUrl: "https://your-s3-bucket.s3.amazonaws.com/collaborators/john-smith.jpg",
     linkedinUrl: "https://linkedin.com/in/johnsmith",
     bio: "Full-stack developer with expertise in microservices and cloud architecture"
   }
   ```

### Step 3: Using the Helper Utility (Optional)

For easier management, use the helper utility:

```typescript
import { createCollaborator, validateCollaboratorInput } from '../utils/collaboratorHelper';

const newCollaboratorInput = {
  name: "John Smith",
  role: "Backend Developer",
  linkedinUsername: "johnsmith", // Just the username
  s3ImageKey: "john-smith.jpg", // Just the filename
  bio: "Full-stack developer with expertise in microservices"
};

// Validate input
const errors = validateCollaboratorInput(newCollaboratorInput);
if (errors.length > 0) {
  console.error("Validation errors:", errors);
  return;
}

// Create collaborator object
const newCollaborator = createCollaborator(
  newCollaboratorInput,
  "https://your-s3-bucket.s3.amazonaws.com" // Your S3 bucket URL
);

// Add to collaborators array with unique ID
const collaboratorWithId = { ...newCollaborator, id: "7" };
```

## Available Roles

Use these predefined roles for consistency:

- Lead Developer
- Senior Developer
- Backend Developer
- Frontend Developer
- Full Stack Developer
- DevOps Engineer
- Platform Engineer
- Site Reliability Engineer
- UI/UX Designer
- Product Designer
- Technical Writer
- Documentation Specialist
- Product Manager
- Project Manager
- QA Engineer
- Security Engineer
- Data Engineer
- Machine Learning Engineer
- Cloud Architect
- Solutions Architect

## S3 Configuration

### Bucket Structure
```
your-s3-bucket/
├── collaborators/
│   ├── john-smith.jpg
│   ├── jane-doe.png
│   └── ...
```

### CORS Configuration
Make sure your S3 bucket allows cross-origin requests:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### Public Access Policy
Ensure the collaborator images are publicly readable:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-s3-bucket/collaborators/*"
    }
  ]
}
```

## Features

### Floating Action Button
- Appears on all pages in the bottom-right corner
- Smooth animations and hover effects
- Tooltip showing "Meet Our Team"

### Collaborators Modal
- Responsive grid layout (1-4 columns based on screen size)
- Profile images with fallback to initials
- LinkedIn integration with direct links
- Smooth animations and transitions
- Mobile-friendly design

### LinkedIn Integration
- Clicking on any collaborator opens their LinkedIn profile in a new tab
- LinkedIn icon indicator on each profile
- Secure external link handling

## Troubleshooting

### Image Not Loading
1. Check if the S3 URL is correct and accessible
2. Verify CORS configuration
3. Ensure the image file exists in the bucket
4. Check if the bucket policy allows public read access

### LinkedIn Link Not Working
1. Verify the LinkedIn username is correct
2. Check if the profile is public
3. Ensure the URL format is correct: `https://linkedin.com/in/username`

### Button Not Appearing
1. Check if the component is imported in `App.tsx`
2. Verify there are no console errors
3. Ensure the component is rendered outside the router

## Customization

### Styling
The component uses Tailwind CSS classes. Key styling files:
- `src/components/CollaboratorsButton.tsx` - Main component
- Framer Motion for animations
- Responsive design with mobile-first approach

### Animation Timing
- Button entrance: 0.5s delay
- Modal animations: Spring physics
- Staggered collaborator cards: 0.1s intervals

### Colors
- Primary: Blue gradient (`from-blue-600 to-blue-700`)
- Hover states: Darker blue variants
- Background: White with subtle shadows
- Text: Gray scale for hierarchy
