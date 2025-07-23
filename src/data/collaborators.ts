export interface Collaborator {
  id: string;
  name: string;
  role: string;
  imageUrl: string; // S3 URL
  linkedinUrl: string;
  bio?: string;
}

// Team collaborators data - QA Interns contributing to the product
export const collaborators: Collaborator[] = [
  {
    id: "1",
    name: "Hem Kumari Abungyak",
    role: "QA Intern",
    imageUrl: "H",
    linkedinUrl: "https://www.linkedin.com/in/hem-kumari-abungyak-81566436a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    bio: "Quality assurance intern ensuring platform reliability and exceptional user experiences"
  },
  {
    id: "2",
    name: "Mehreen Talat",
    role: "QA Intern",
    imageUrl: "M",
    linkedinUrl: "https://www.linkedin.com/in/mehreentalat/",
    bio: "Dedicated QA intern focused on testing and improving platform functionality"
  },
  {
    id: "3",
    name: "Dhruv Maheshwari",
    role: "QA Intern",
    imageUrl: "D",
    linkedinUrl: "https://www.linkedin.com/in/dhruv-maheshwari-aab98b26",
    bio: "Quality assurance intern contributing to robust testing processes and bug-free experiences"
  },
  {
    id: "4",
    name: "Nikola Mijajlović",
    role: "QA Intern",
    imageUrl: "N",
    linkedinUrl: "https://www.linkedin.com/in/nikola-mijajlovi%C4%87-833818300?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    bio: "QA intern specializing in comprehensive testing and quality improvement initiatives"
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
