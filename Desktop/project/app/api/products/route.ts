import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// In a real app, this would be a database
let products: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const product = await req.json();
    
    // Add an ID and seller info to the product
    const newProduct = {
      ...product,
      id: `prod_${Date.now()}`,
      sellerId: session.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real app, save to database
    products.push(newProduct);

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real app, query database for seller's products
    const sellerProducts = products.filter(p => p.sellerId === session.id);

    return NextResponse.json(sellerProducts);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}