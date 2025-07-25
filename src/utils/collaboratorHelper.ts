import { Collaborator } from '../data/collaborators';

/**
 * Helper utility to easily add new collaborators
 * 
 * Usage:
 * 1. Upload the collaborator's image to your S3 bucket
 * 2. Use this helper to generate the collaborator object
 * 3. Add it to the collaborators array in src/data/collaborators.ts
 */

export interface NewCollaboratorInput {
  name: string;
  role: string;
  linkedinUsername: string; // Just the username, not the full URL
  s3ImageKey: string; // The S3 key/filename for the image
  bio?: string;
}

export const createCollaborator = (
  input: NewCollaboratorInput,
  s3BucketUrl: string = "https://your-s3-bucket.s3.amazonaws.com"
): Omit<Collaborator, 'id'> => {
  return {
    name: input.name,
    role: input.role,
    imageUrl: `${s3BucketUrl}/collaborators/${input.s3ImageKey}`,
    linkedinUrl: `https://linkedin.com/in/${input.linkedinUsername}`,
    bio: input.bio
  };
};

/**
 * Example usage:
 *
 * const newCollaborator = createCollaborator({
 *   name: "Team Member Name",
 *   role: "Backend Developer",
 *   linkedinUsername: "username",
 *   s3ImageKey: "profile-image.jpg",
 *   bio: "Developer with expertise in cloud technologies"
 * });
 *
 * Then add to collaborators array:
 * export const collaborators: Collaborator[] = [
 *   ...existingCollaborators,
 *   { ...newCollaborator, id: "next-id" }
 * ];
 */

// Predefined roles for consistency
export const COLLABORATOR_ROLES = [
  "Lead Developer",
  "Senior Developer", 
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Platform Engineer",
  "Site Reliability Engineer",
  "UI/UX Designer",
  "Product Designer",
  "Technical Writer",
  "Documentation Specialist",
  "Product Manager",
  "Project Manager",
  "QA Engineer",
  "Security Engineer",
  "Data Engineer",
  "Machine Learning Engineer",
  "Cloud Architect",
  "Solutions Architect"
] as const;

export type CollaboratorRole = typeof COLLABORATOR_ROLES[number];

// Helper to validate LinkedIn username format
export const isValidLinkedInUsername = (username: string): boolean => {
  // LinkedIn usernames can contain letters, numbers, and hyphens
  // Must be 3-100 characters long
  const linkedinUsernameRegex = /^[a-zA-Z0-9-]{3,100}$/;
  return linkedinUsernameRegex.test(username);
};

// Helper to validate S3 image key format
export const isValidS3ImageKey = (key: string): boolean => {
  // Basic validation for image file extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  return imageExtensions.some(ext => key.toLowerCase().endsWith(ext));
};

// Validation function for new collaborator input
export const validateCollaboratorInput = (input: NewCollaboratorInput): string[] => {
  const errors: string[] = [];
  
  if (!input.name.trim()) {
    errors.push("Name is required");
  }
  
  if (!input.role.trim()) {
    errors.push("Role is required");
  }
  
  if (!isValidLinkedInUsername(input.linkedinUsername)) {
    errors.push("Invalid LinkedIn username format");
  }
  
  if (!isValidS3ImageKey(input.s3ImageKey)) {
    errors.push("Invalid image file format. Use .jpg, .jpeg, .png, .webp, or .gif");
  }
  
  return errors;
};
