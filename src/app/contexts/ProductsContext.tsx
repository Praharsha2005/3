'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/app/types';
import { useAuth } from './AuthContext';

// Extended product type to include media data
interface ProductWithMedia extends Product {
  imagePreviews?: string[];
  videoPreviews?: string[];
  mediaFiles?: { type: 'image' | 'video'; url: string }[];
}

interface ProductsContextType {
  products: ProductWithMedia[];
  addProduct: (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sellerId'>,
    sellerId: string,
    imagePreviews?: string[],
    videoPreviews?: string[],
    mediaFiles?: { type: 'image' | 'video'; url: string }[]
  ) => void;
  deleteProduct: (productId: string) => void;
  deleteProductsBySeller: (sellerId: string) => void; // Add function to delete all products by seller
  getProductsBySeller: (sellerId: string) => ProductWithMedia[];
  getAllProducts: () => ProductWithMedia[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ProductWithMedia[]>([]);
  // Note: The 'user' variable is imported from useAuth but not directly used in this component
  // It's used indirectly through the AuthContext, which is why the linter might show it as unused
  useAuth();

  useEffect(() => {
    // Load products from localStorage on initial load
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        // Convert date strings back to Date objects
        const productsWithDates = parsedProducts.map((product: ProductWithMedia) => ({
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

  const addProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sellerId'>,
    sellerId: string,
    imagePreviews?: string[],
    videoPreviews?: string[],
    mediaFiles?: { type: 'image' | 'video'; url: string }[]
  ) => {
    const newProduct: ProductWithMedia = {
      id: Date.now().toString(),
      ...productData,
      sellerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagePreviews,
      videoPreviews,
      mediaFiles,
    };
    
    setProducts(prev => [...prev, newProduct]);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const deleteProductsBySeller = (sellerId: string) => {
    setProducts(prev => prev.filter(product => product.sellerId !== sellerId));
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
    deleteProduct,
    deleteProductsBySeller,
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