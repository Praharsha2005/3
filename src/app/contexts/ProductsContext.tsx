'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/app/types';

// Extended product type to include image data
interface ProductWithImages extends Product {
  imagePreviews?: string[];
}

interface ProductsContextType {
  products: ProductWithImages[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sellerId'>, sellerId: string, imagePreviews?: string[]) => void;
  getProductsBySeller: (sellerId: string) => ProductWithImages[];
  getAllProducts: () => ProductWithImages[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ProductWithImages[]>([]);

  useEffect(() => {
    // Load products from localStorage on initial load
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        // Convert date strings back to Date objects
        const productsWithDates = parsedProducts.map((product: ProductWithImages) => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        }));
        setProducts(productsWithDates);
      } catch (error) {
        console.error('Error parsing stored products:', error);
        localStorage.removeItem('products');
      }
    }
  }, []);

  useEffect(() => {
    // Save products to localStorage whenever they change
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sellerId'>, sellerId: string, imagePreviews?: string[]) => {
    const newProduct: ProductWithImages = {
      id: Date.now().toString(),
      ...productData,
      sellerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagePreviews,
    };
    
    setProducts(prev => [...prev, newProduct]);
  };

  const getProductsBySeller = (sellerId: string) => {
    return products.filter(product => product.sellerId === sellerId);
  };

  const getAllProducts = () => {
    return products;
  };

  const value = {
    products,
    addProduct,
    getProductsBySeller,
    getAllProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}