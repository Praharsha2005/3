'use client';

import { useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import { useProducts } from '@/app/contexts/ProductsContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { useChat } from '@/app/contexts/ChatContext';
import { useToast } from '@/app/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/types';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { getAllProducts } = useProducts();
  const { user } = useAuth();
  const { sendMessage } = useChat();
  const { showToast } = useToast();
  const router = useRouter();
  const products = getAllProducts();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    upiId: '',
  });
  
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Get cart items for current user
  const userCartItems = user 
    ? cartItems.filter(item => item.userId === user.id)
    : [];
    
  // Get products in cart
  const cartProducts = userCartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter(Boolean) as (Product & { quantity: number })[];

  // Calculate totals
  const subtotal = cartProducts.reduce((sum, product) => {
    return sum + (product ? product.price * product.quantity : 0);
  }, 0);
  
  const shipping = subtotal > 0 ? 15.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Clear cart after successful payment
      clearCart();
      
      // Send notifications to both parties
      sendPaymentNotifications();
      
      setProcessing(false);
      setPaymentCompleted(true);
      showToast('Payment processed successfully!', 'success');
    }, 2000);
  };

  const sendPaymentNotifications = () => {
    if (!user) return;
    
    // For each product in cart, send notification to the seller (student)
    cartProducts.forEach((product) => {
      if (product && product.sellerId) {
        // Notification to student (seller)
        sendMessage(
          product.sellerId,
          `Payment of $${total.toFixed(2)} received from ${user.name} for "${product.title}". Please proceed with delivery.`
        );
        
        // Notification to business user (buyer)
        sendMessage(
          user.id,
          `Payment of $${total.toFixed(2)} completed for "${product.title}". You will be notified when the project is delivered.`
        );
      }
    });
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  if (paymentCompleted) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your payment of ${total.toFixed(2)} has been processed successfully. 
            Notifications have been sent to both you and the project creator.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-2">Next Steps</h3>
            <p className="text-sm text-gray-600">
              The project creator will contact you shortly to arrange delivery. 
              You can also check your messages for updates.
            </p>
          </div>
          <button
            onClick={handleContinueShopping}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Billing Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Billing Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h3 className="font-bold mb-2">UPI Payment</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Please make the payment to the UPI ID of the student project creator.
                </p>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="student@upi"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r-md"
                    onClick={() => setFormData(prev => ({ ...prev, upiId: 'student@upi' }))}
                  >
                    Use Sample
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Payment Instructions</h3>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  <li>Copy the UPI ID above</li>
                  <li>Open your UPI app (Google Pay, PhonePe, etc.)</li>
                  <li>Send exactly ${total.toFixed(2)} to the UPI ID</li>
                  <li>After payment, click &quot;Complete Payment&quot; below</li>
                </ol>
              </div>
              
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded mt-6 disabled:opacity-50"
              >
                {processing ? 'Processing Payment...' : 'Complete Payment'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartProducts.map((product) => (
                <div key={product.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                  </div>
                  <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Support Student Innovation</h3>
              <p className="text-sm text-gray-600">
                By purchasing these projects, you&apos;re supporting the next generation of innovators and helping turn ideas into reality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}