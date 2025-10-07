'use client';

import { useState, useRef, DragEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductsContext';
import { useCollaboration } from '../contexts/CollaborationContext';
import { useChat } from '../contexts/ChatContext';
import { useToast } from '../contexts/ToastContext';
import { Collaboration } from '@/app/types';
import Image from 'next/image';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { addProduct, deleteProduct, getProductsBySeller } = useProducts();
  const { getCollaborationsForUser, updateCollaborationStatus } = useCollaboration();
  const { sendMessage } = useChat();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  const sellerProducts = user ? getProductsBySeller(user.id) : [];
  const collaborations = getCollaborationsForUser();
  
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'Technology',
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<{ type: 'image' | 'video'; url: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      // Generate previews for image and video files
      Array.from(e.target.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              const imageUrl = e.target.result as string;
              setImagePreviews(prev => [...prev, imageUrl]);
              setMediaFiles(prev => [...prev, { type: 'image', url: imageUrl }]);
            }
          };
          reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              const videoUrl = e.target.result as string;
              setVideoPreviews(prev => [...prev, videoUrl]);
              setMediaFiles(prev => [...prev, { type: 'video', url: videoUrl }]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Add product with media files
    addProduct(newProduct, user.id, imagePreviews, videoPreviews, mediaFiles);
    
    // Reset form
    setNewProduct({
      title: '',
      description: '',
      price: 0,
      category: 'Technology',
    });
    
    setFiles([]);
    setImagePreviews([]);
    setVideoPreviews([]);
    setMediaFiles([]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      // Generate previews for image and video files
      newFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              const imageUrl = e.target.result as string;
              setImagePreviews(prev => [...prev, imageUrl]);
              setMediaFiles(prev => [...prev, { type: 'image', url: imageUrl }]);
            }
          };
          reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              const videoUrl = e.target.result as string;
              setVideoPreviews(prev => [...prev, videoUrl]);
              setMediaFiles(prev => [...prev, { type: 'video', url: videoUrl }]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    
    // Remove from image previews if it's an image
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    // Remove from video previews if it's a video
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
    
    // Remove from media files
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const viewCollaborationDetails = (collaboration: Collaboration) => {
    setSelectedCollaboration(collaboration);
    setShowCollaborationModal(true);
  };

  const handleCollaborationResponse = (status: 'accepted' | 'rejected') => {
    if (selectedCollaboration && user) {
      updateCollaborationStatus(selectedCollaboration.id, status);
      
      // If accepted, send a confirmation message to the business user
      if (status === 'accepted') {
        const project = sellerProducts.find(p => p.id === selectedCollaboration.projectId);
        const projectName = project ? project.title : 'your project';
        sendMessage(
          selectedCollaboration.businessUserId,
          `Your collaboration request for "${projectName}" has been accepted! Let's start working together.`
        );
        showToast('Collaboration request accepted!', 'success');
      }
      
      // If rejected, send a rejection message to the business user
      if (status === 'rejected') {
        const project = sellerProducts.find(p => p.id === selectedCollaboration.projectId);
        const projectName = project ? project.title : 'your project';
        sendMessage(
          selectedCollaboration.businessUserId,
          `Your collaboration request for "${projectName}" has been respectfully declined.`
        );
        showToast('Collaboration request declined', 'info');
      }
      
      setShowCollaborationModal(false);
      setSelectedCollaboration(null);
    }
  };

  // Also update the inline buttons to show toast notifications
  const handleInlineCollaborationResponse = (collaborationId: string, status: 'accepted' | 'rejected') => {
    updateCollaborationStatus(collaborationId, status);
    
    if (user) {
      const collab = collaborations.find(c => c.id === collaborationId);
      if (collab) {
        const project = sellerProducts.find(p => p.id === collab.projectId);
        const projectName = project ? project.title : 'your project';
        
        if (status === 'accepted') {
          sendMessage(
            collab.businessUserId,
            `Your collaboration request for "${projectName}" has been accepted! Let's start working together.`
          );
          showToast('Collaboration request accepted!', 'success');
        } else {
          sendMessage(
            collab.businessUserId,
            `Your collaboration request for "${projectName}" has been respectfully declined.`
          );
          showToast('Collaboration request declined', 'info');
        }
      }
    }
  };

  const confirmDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Seller Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Total Projects</h3>
          <p className="text-3xl font-bold text-blue-600">{sellerProducts.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Sales</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Collaborations</h3>
          <p className="text-3xl font-bold text-purple-600">{collaborations.length}</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Upload New Project</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input 
              type="text" 
              name="title"
              value={newProduct.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your project"
              rows={4}
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input 
              type="number" 
              name="price"
              value={newProduct.price || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Category</label>
            <select 
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Environment">Environment</option>
              <option value="Health">Health</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Media (Images & Videos)</label>
            <div 
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <p className="text-gray-500">
                {isDragOver 
                  ? 'Drop files here' 
                  : 'Drag and drop files here or click to upload'}
              </p>
              <p className="text-gray-400 text-sm mt-1">Supports images and videos</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                multiple
                accept="image/*,video/*"
              />
            </div>
            
            {(files.length > 0 || imagePreviews.length > 0 || videoPreviews.length > 0) && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {mediaFiles.map((media, index) => (
                    <div key={index} className="relative">
                      {media.type === 'image' ? (
                        <Image 
                          src={media.url} 
                          alt="Preview" 
                          width={200}
                          height={200}
                          className="w-full h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Video</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload Project
          </button>
        </form>
      </div>
      
      {/* Collaboration Requests Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Collaboration Requests</h3>
        {collaborations.length === 0 ? (
          <p className="text-gray-500">You have not received any collaboration requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Professional</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {collaborations.map((collab: Collaboration) => {
                  const project = sellerProducts.find(p => p.id === collab.projectId);
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
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate" title={collab.message}>
                          {collab.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          collab.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : collab.status === 'accepted' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {collab.status === 'pending' 
                            ? 'Pending' 
                            : collab.status === 'accepted' 
                              ? 'Approved' 
                              : 'Rejected'}
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
                        {collab.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleInlineCollaborationResponse(collab.id, 'accepted')}
                              className="text-green-600 hover:text-green-900 mr-2"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleInlineCollaborationResponse(collab.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
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
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Collaboration Details Modal */}
      {showCollaborationModal && selectedCollaboration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Collaboration Request Details</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Project</p>
              <p className="font-medium">
                {sellerProducts.find(p => p.id === selectedCollaboration.projectId)?.title || 'Unknown Project'}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">From</p>
              <p className="font-medium">Business Professional</p>
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
                {selectedCollaboration.status === 'pending' 
                  ? 'Pending' 
                  : selectedCollaboration.status === 'accepted' 
                    ? 'Approved' 
                    : 'Rejected'}
              </span>
            </div>
            {selectedCollaboration.status === 'pending' && (
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => handleCollaborationResponse('rejected')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleCollaborationResponse('accepted')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Accept
                </button>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowCollaborationModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-bold mb-4">Your Projects</h3>
        {sellerProducts.length === 0 ? (
          <p className="text-gray-500">You haven&apos;t uploaded any projects yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sellerProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.mediaFiles ? product.mediaFiles.length : 
                       (product.imagePreviews ? product.imagePreviews.length : 0)} files
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => confirmDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}