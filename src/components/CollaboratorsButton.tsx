import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, X } from 'lucide-react';
import { collaborators } from '../data/collaborators';

const CollaboratorsButton: React.FC = () => {
  const location = useLocation();

  // Only show on home page
  const isHomePage = location.pathname === '/';
  if (!isHomePage) {
    return null;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLinkedInClick = (e: React.MouseEvent, linkedinUrl: string) => {
    e.stopPropagation();
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40 flex items-center justify-center"
        title="Meet Our Team"
      >
        <Users size={24} />
      </button>

      {/* Simple Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Meet Our Team</h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Team Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={(e) => handleLinkedInClick(e, collaborator.linkedinUrl)}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                        {collaborator.imageUrl}
                      </div>
                      <h3 className="font-bold text-lg">{collaborator.name}</h3>
                      <p className="text-blue-600 font-medium">{collaborator.role}</p>
                      {collaborator.bio && (
                        <p className="text-gray-600 text-sm mt-2">{collaborator.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CollaboratorsButton;
