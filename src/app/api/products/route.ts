import { NextResponse } from 'next/server';

// This is a placeholder API route for product management
// In a real application, this would connect to a database

export async function GET() {
  // Return all products
  const products = [
    {
      id: '1',
      title: "AI Water Purifier",
      description: "Machine learning optimized water filtration system",
      price: 299.99,
      category: "Technology",
      sellerId: "student1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
  
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  // Create a new product
  const productData = await request.json();
  
  // In a real app, this would save to a database
  const newProduct = {
    id: Date.now().toString(),
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return NextResponse.json(newProduct, { status: 201 });
}