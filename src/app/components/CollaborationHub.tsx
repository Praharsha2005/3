'use client';

import { useState } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useCollaboration } from '../contexts/CollaborationContext';
import ChatBox from './ChatBox';
import { Collaboration, Product } from '@/app/types';
import Image from 'next/image';

export default function CollaborationHub() {
  const { getAllProducts } = useProducts();
  const { conversations } = useChat();
  const { user } = useAuth();
  const { sendCollaborationRequest, getCollaborationsForUser } = useCollaboration();
  
  const allProducts = getAllProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatParticipant, setChatParticipant] = useState<{ id: string; name: string } | null>(null);
  const [collaborationMessage, setCollaborationMessage] = useState('');
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [selectedProjectForCollab, setSelectedProjectForCollab] = useState<Product | null>(null);
  const [showCollaborationDetails, setShowCollaborationDetails] = useState(false);
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null);
  
  const userCollaborations = getCollaborationsForUser();

  // Filter products to show only student projects when business user is viewing
  // For now, we'll assume all products are from students since that's the primary use case
  // In a real app, you would have a way to identify seller user types
  const projects = allProducts;

  const openCollaborationModal = (project: Product) => {
    setSelectedProjectForCollab(project);
    setCollaborationMessage(`I'm interested in your project "${project.title}". Let's discuss how we can collaborate!`);
    setShowCollaborationModal(true);
  };

  const viewCollaborationDetails = (collaboration: Collaboration) => {
    setSelectedCollaboration(collaboration);
    setShowCollaborationDetails(true);
  };

  const sendCollaboration = () => {
    if (selectedProjectForCollab && user) {
      // For business users sending collaboration requests to students
      sendCollaborationRequest(
        selectedProjectForCollab.id,
        selectedProjectForCollab.sellerId, // student user ID (recipient)
        collaborationMessage
      );
      setShowCollaborationModal(false);
      alert('Collaboration request sent successfully!');
    }
  };

  const startChat = (sellerId: string, sellerName: string) => {
    setChatParticipant({ id: sellerId, name: sellerName });
    setShowChat(true);
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show different content based on user type
  const isStudent = user && user.userType === 'student';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">{isStudent ? "My Collaboration Hub" : "Collaboration Hub"}</h2>
      
      {showChat && chatParticipant ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Chat with {chatParticipant.name}</h3>
            <button 
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <ChatBox participantId={chatParticipant.id} participantName={chatParticipant.name} />
        </div>
      ) : null}
      
      {/* Collaboration Modal */}
      {showCollaborationModal && selectedProjectForCollab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Collaboration Request</h3>
            <p className="mb-2">Project: <span className="font-medium">{selectedProjectForCollab.title}</span></p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={collaborationMessage}
                onChange={(e) => setCollaborationMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Enter your collaboration message..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCollaborationModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={sendCollaboration}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Collaboration Details Modal */}
      {showCollaborationDetails && selectedCollaboration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Collaboration Request Details</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Project</p>
              <p className="font-medium">
                {allProducts.find(p => p.id === selectedCollaboration.projectId)?.title || 'Unknown Project'}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">To</p>
              <p className="font-medium">Student Inventor</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Message</p>
              <p className="mt-1 p-3 bg-gray-50 rounded">{selectedCollaboration.message}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium">{selectedCollaboration.createdAt.toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Status</p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                selectedCollaboration.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : selectedCollaboration.status === 'accepted' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {selectedCollaboration.status.charAt(0).toUpperCase() + selectedCollaboration.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowCollaborationDetails(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isStudent ? (
        // Student view - show their collaborations
        <div>
          <h3 className="text-xl font-bold mb-4">My Collaboration Requests</h3>
          {userCollaborations.length === 0 ? (
            <p className="text-gray-500">You have not received any collaboration requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Professional</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userCollaborations.map((collab) => {
                    const project = projects.find(p => p.id === collab.projectId);
                    return (
                      <tr key={collab.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {project ? project.title : 'Unknown Project'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Business Professional
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            collab.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : collab.status === 'accepted' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {collab.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => viewCollaborationDetails(collab)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          {collab.status === 'accepted' && (
                            <button 
                              onClick={() => startChat(collab.businessUserId, "Business Professional")}
                              className="text-green-600 hover:text-green-900"
                            >
                              Chat
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        // Business view - show project search and sent requests
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Find Student Projects</h3>
          <div className="flex gap-4 mb-6">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search projects..."
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
              Search
            </button>
          </div>
          
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                {projects.length === 0 
                  ? "No projects available yet. Check back later!" 
                  : "No projects match your search."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gray-200 h-32 flex items-center justify-center">
                    {project.imagePreviews && project.imagePreviews.length > 0 ? (
                      <Image 
                        src={project.imagePreviews[0]} 
                        alt={project.title} 
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">Project Image</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{project.title}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">By Student Inventor</p>
                    <p className="text-sm mb-3">{project.description.substring(0, 100)}&hellip;</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openCollaborationModal(project)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm"
                      >
                        Request Collaboration
                      </button>
                      <button 
                        onClick={() => startChat(project.sellerId, "Student Inventor")}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm"
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {!isStudent && (
        <div>
          <h3 className="text-xl font-bold mb-4">Your Collaboration Requests</h3>
          {userCollaborations.length === 0 ? (
            <p className="text-gray-500">You have not made any collaboration requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userCollaborations.map((collab) => {
                    const project = projects.find(p => p.id === collab.projectId);
                    return (
                      <tr key={collab.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {project ? project.title : 'Unknown Project'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Student Inventor
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            collab.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : collab.status === 'accepted' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {collab.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => viewCollaborationDetails(collab)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Conversations List */}
      {user && Object.keys(conversations).length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Recent Conversations</h3>
          <div className="space-y-2">
            {Object.keys(conversations).map(participantId => {
              const conversation = conversations[participantId];
              const lastMessage = conversation[conversation.length - 1];
              
              // Get unread count for this conversation
              const unreadCount = conversation.filter(
                msg => msg.recipientId === user.id && !msg.read
              ).length;
              
              // Determine participant type based on user type
              const participantType = isStudent ? "Business Professional" : "Student Inventor";
              
              return (
                <div 
                  key={participantId}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                  onClick={() => startChat(participantId, participantType)}
                >
                  <div>
                    <div className="flex justify-between">
                      <span className="font-medium">{participantType}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {lastMessage.content}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {lastMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}