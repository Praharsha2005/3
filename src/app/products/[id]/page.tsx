'use client';

import { useState } from 'react';
import { useProducts } from '../../contexts/ProductsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useParams } from 'next/navigation';
import { Product } from '@/app/types';
import ChatBox from '../../components/ChatBox';
import Image from 'next/image';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { getAllProducts } = useProducts();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const products = getAllProducts();
  const product = products.find((p: Product) => p.id === id as string) || products[0]; // Fallback to first product if not found
  
  const [quantity, setQuantity] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (user) {
      addToCart(product.id, user.id);
      showToast('Product added to cart successfully!', 'success');
    } else {
      showToast('Please log in to add items to your cart', 'error');
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600">The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  // Get all media files (images and videos)
  const allMedia = product.mediaFiles || [];
  
  // If no mediaFiles, fallback to imagePreviews for backward compatibility
  const displayMedia = allMedia.length > 0 
    ? allMedia 
    : (product.imagePreviews || []).map(url => ({ type: 'image' as const, url }));

  // Check if the current user is a student
  const isStudent = user?.userType === 'student';
  
  // Check if user is logged in
  const isLoggedIn = !!user;
  
  // Determine creator name to display
  let creatorName = 'Student Inventor';
  if (isLoggedIn && isStudent && user?.id === product.sellerId) {
    creatorName = user.name;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Media Gallery */}
          <div className="bg-gray-50 rounded-lg p-4">
            {displayMedia.length > 0 ? (
              <div className="relative">
                {/* Main Media Display */}
                <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
                  {displayMedia[currentMediaIndex]?.type === 'image' ? (
                    <Image 
                      src={displayMedia[currentMediaIndex].url} 
                      alt={product.title} 
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <video 
                        src={displayMedia[currentMediaIndex].url} 
                        controls
                        className="max-h-full max-w-full"
                      />
                    </div>
                  )}
                </div>
                
                {/* Thumbnails */}
                {displayMedia.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {displayMedia.map((media, index) => (
                      <div 
                        key={index}
                        className={`relative h-20 cursor-pointer rounded overflow-hidden border-2 ${
                          index === currentMediaIndex ? 'border-blue-500' : 'border-transparent'
                        }`}
                        onClick={() => setCurrentMediaIndex(index)}
                      >
                        {media.type === 'image' ? (
                          <Image 
                            src={media.url} 
                            alt={`Thumbnail ${index + 1}`} 
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-8 h-8 mx-auto flex items-center justify-center mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                                </svg>
                              </div>
                              <span className="text-xs text-gray-500">Video</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-200 rounded-lg">
                <span className="text-gray-500 text-lg">No Media Available</span>
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded mr-2">
                {product.category}
              </span>
              <span className="text-gray-500">By {creatorName}</span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Project Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Project Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-blue-600">${product.price.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{product.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-blue-600">${(product.price * quantity).toFixed(2)}</span>
              
              <div className="flex items-center">
                <button 
                  onClick={decrementQuantity}
                  className="bg-gray-200 w-10 h-10 rounded-l flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="bg-gray-200 w-10 h-10 rounded-r flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Only show action buttons for logged-in business users */}
            {isLoggedIn && !isStudent && (
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => setShowChat(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded"
                >
                  Chat with Seller
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Chat Box - only for logged-in business users */}
        {isLoggedIn && !isStudent && showChat && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chat with Seller</h2>
              <button 
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close Chat
              </button>
            </div>
            <ChatBox participantId={product.sellerId} participantName={creatorName} />
          </div>
        )}
      </div>
    </div>
  );
}