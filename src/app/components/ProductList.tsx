'use client';

import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';

export default function ProductList() {
  const { getAllProducts } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const products = getAllProducts();

  const handleAddToCart = (productId: string) => {
    if (user) {
      addToCart(productId, user.id);
    } else {
      // Redirect to login or show login prompt
      alert('Please log in to add items to your cart');
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
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gray-200 h-48 flex items-center justify-center">
              {product.imagePreviews && product.imagePreviews.length > 0 ? (
                <Image 
                  src={product.imagePreviews[0]} 
                  alt={product.title} 
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
                <h3 className="text-xl font-bold">{product.title}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {product.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                <button 
                  onClick={() => handleAddToCart(product.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}