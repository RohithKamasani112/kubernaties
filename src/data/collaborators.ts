export interface Collaborator {
  id: string;
  name: string;
  role: string;
  imageUrl: string; // S3 URL
  linkedinUrl: string;
  bio?: string;
}

// Example collaborators data - replace with actual team members
export const collaborators: Collaborator[] = [
  {
    id: "1",
    name: "Alex Rodriguez",
    role: "Lead Developer",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/alexrodriguez",
    bio: "Kubernetes expert with 5+ years of experience in container orchestration and cloud-native development"
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "DevOps Engineer",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/sarahchen",
    bio: "Cloud infrastructure specialist focused on scalable solutions and automation"
  },
  {
    id: "3",
    name: "Marcus Thompson",
    role: "UI/UX Designer",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/marcusthompson",
    bio: "Design expert creating intuitive learning experiences for complex technical concepts"
  },
  {
    id: "4",
    name: "Emily Davis",
    role: "Technical Writer",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/emilydavis",
    bio: "Documentation specialist making complex topics accessible to learners worldwide"
  },
  {
    id: "5",
    name: "David Kim",
    role: "Platform Engineer",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/davidkim",
    bio: "Infrastructure automation expert building reliable and scalable platforms"
  },
  {
    id: "6",
    name: "Lisa Wang",
    role: "Product Manager",
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/lisawang",
    bio: "Product strategist focused on creating exceptional learning experiences"
  },
  {
    id: "7",
    name: "James Wilson",
    role: "Security Engineer",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/jameswilson",
    bio: "Cybersecurity specialist ensuring platform security and compliance"
  },
  {
    id: "8",
    name: "Maria Garcia",
    role: "QA Engineer",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/mariagarcia",
    bio: "Quality assurance expert ensuring reliable and bug-free user experiences"
  },
  {
    id: "9",
    name: "Robert Brown",
    role: "Cloud Architect",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    linkedinUrl: "https://linkedin.com/in/robertbrown",
    bio: "Cloud infrastructure architect designing scalable and resilient systems"
  }
];

// Helper function to add new collaborators
export const addCollaborator = (collaborator: Omit<Collaborator, 'id'>): Collaborator => {
  const newCollaborator: Collaborator = {
    ...collaborator,
    id: Date.now().toString()
  };
  collaborators.push(newCollaborator);
  return newCollaborator;
};

// Helper function to get collaborator by ID
export const getCollaboratorById = (id: string): Collaborator | undefined => {
  return collaborators.find(collaborator => collaborator.id === id);
};
