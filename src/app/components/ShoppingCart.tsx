'use client';

import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';

export default function ShoppingCart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { getAllProducts } = useProducts();
  const { user } = useAuth();
  
  const products = getAllProducts();

  const getProductById = (productId: string) => {
    return products.find(product => product.id === productId);
  };

  const userCartItems = user 
    ? cartItems.filter(item => item.userId === user.id)
    : [];

  const subtotal = userCartItems.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  
  const shipping = subtotal > 0 ? 15.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    // In a real app, this would redirect to a checkout page
    alert('Proceeding to checkout!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      
      {userCartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Browse Projects
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {userCartItems.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              
              return (
                <div key={item.id} className="flex items-center border-b pb-4">
                  <div className="bg-gray-200 w-20 h-20 flex items-center justify-center mr-4">
                    <span className="text-gray-500 text-sm">Image</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold">{product.title}</h3>
                    <p className="text-gray-600">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 w-8 h-8 rounded-l"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 w-8 h-8 rounded-r"
                    >
                      +
                    </button>
                  </div>
                  <div className="ml-4 font-bold">${(product.price * item.quantity).toFixed(2)}</div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}