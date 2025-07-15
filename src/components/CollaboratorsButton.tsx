import React, { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';
import { collaborators } from '../data/collaborators';

const CollaboratorsButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLinkedInClick = (e: React.MouseEvent, linkedinUrl: string) => {
    e.stopPropagation();
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
      >
        <Users size={24} />

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Meet Our Team
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Meet Our Team</h2>
                  <p className="text-blue-100 mt-2 text-lg">The amazing people behind KubeQuest ({collaborators.length} members)</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-3 hover:bg-white/20 rounded-full transition-colors duration-200"
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            {/* Collaborators Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 hover:scale-105"
                    onClick={(e) => handleLinkedInClick(e, collaborator.linkedinUrl)}
                  >
                    {/* Profile Image */}
                    <div className="relative mb-6 flex justify-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-500 ring-4 ring-blue-100 shadow-lg">
                        <img
                          src={collaborator.imageUrl}
                          alt={collaborator.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white text-2xl font-bold">${collaborator.name.split(' ').map(n => n[0]).join('')}</div>`;
                            }
                          }}
                        />
                      </div>
                      {/* LinkedIn indicator */}
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#0077B5] rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {collaborator.name}
                      </h3>
                      <p className="text-blue-600 text-base font-semibold mb-3">
                        {collaborator.role}
                      </p>
                      {collaborator.bio && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {collaborator.bio}
                        </p>
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
