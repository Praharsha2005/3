'use client';

import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductList() {
  const { getAllProducts } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const products = getAllProducts();

  const handleAddToCart = (productId: string) => {
    if (user) {
      addToCart(productId, user.id);
      showToast('Product added to cart successfully!', 'success');
    } else {
      // Redirect to login or show login prompt
      showToast('Please log in to add items to your cart', 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg">No projects available yet.</p>
          <p className="text-gray-400 mt-2">Check back later for student innovations!</p>
        </div>
      ) : (
        products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Project Image/Video Preview */}
            <div className="relative h-48 bg-gray-100">
              {product.mediaFiles && product.mediaFiles.length > 0 ? (
                product.mediaFiles[0].type === 'image' ? (
                  <Image 
                    src={product.mediaFiles[0].url} 
                    alt={product.title} 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-gray-300 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                        </svg>
                      </div>
                      <span className="text-gray-500 text-sm">Video Preview</span>
                    </div>
                  </div>
                )
              ) : product.imagePreviews && product.imagePreviews.length > 0 ? (
                <Image 
                  src={product.imagePreviews[0]} 
                  alt={product.title} 
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No Media</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {product.category}
              </div>
            </div>
            
            {/* Project Details */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold truncate">{product.title}</h3>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              
              {/* Media Count Indicator */}
              {product.mediaFiles && product.mediaFiles.length > 1 && (
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span>{product.mediaFiles.length} media files</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                <div className="flex space-x-2">
                  <Link 
                    href={`/products/${product.id}`}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}