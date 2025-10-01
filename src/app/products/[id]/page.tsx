'use client';

import { useState } from 'react';
import { useProducts } from '../../contexts/ProductsContext';
import { useParams } from 'next/navigation';
import { Product } from '@/app/types';
import ChatBox from '../../components/ChatBox';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { getAllProducts } = useProducts();
  const products = getAllProducts();
  const product = products.find((p: Product) => p.id === id as string) || products[0]; // Fallback to first product if not found
  
  const [quantity, setQuantity] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
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

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-200 h-96 flex items-center justify-center">
            {product.imagePreviews && product.imagePreviews.length > 0 ? (
              <div className="relative w-full h-full">
                <img 
                  src={product.imagePreviews[currentImageIndex]} 
                  alt={product.title} 
                  className="w-full h-full object-contain"
                />
                {product.imagePreviews.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {product.imagePreviews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-gray-500 text-lg">Project Image</span>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded mr-2">
                {product.category}
              </span>
              <span className="text-gray-500">By Student Inventor</span>
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Technical Specifications</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>High-quality innovation</li>
                <li>Research-backed solution</li>
                <li>Practical application</li>
                <li>Student developed</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
              
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
            
            <div className="flex gap-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">
                Add to Cart
              </button>
              <button 
                onClick={() => setShowChat(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded"
              >
                Chat with Seller
              </button>
            </div>
          </div>
        </div>
        
        {/* Chat Box */}
        {showChat && (
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
            <ChatBox participantId={product.sellerId} participantName="Student Inventor" />
          </div>
        )}
        
        {/* Additional Information */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-4">About the Inventor</h2>
          <div className="flex items-center">
            <div className="bg-gray-200 w-16 h-16 rounded-full mr-4"></div>
            <div>
              <h3 className="font-bold text-lg">Student Inventor</h3>
              <p className="text-gray-600">Innovative Student</p>
              <p className="text-gray-500 text-sm mt-1">Creating solutions for tomorrow</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}