import SellerDashboard from '../components/SellerDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

export default function SellerPage() {
  return (
    <ProtectedRoute allowedUserTypes={['student']}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
        <SellerDashboard />
      </div>
    </ProtectedRoute>
  );
}