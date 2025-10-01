import ShoppingCart from '../components/ShoppingCart';
import ProtectedRoute from '../components/ProtectedRoute';

export default function CartPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <ShoppingCart />
      </div>
    </ProtectedRoute>
  );
}