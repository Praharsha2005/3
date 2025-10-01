import ProductList from '@/app/components/ProductList';

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Student Projects</h1>
      <ProductList />
    </div>
  );
}