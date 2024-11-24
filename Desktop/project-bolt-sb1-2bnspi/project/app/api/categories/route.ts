import { NextRequest, NextResponse } from 'next/server';
import { mainCategories, subCategories } from '@/lib/categories';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parentId = url.searchParams.get('parentId');
    const search = url.searchParams.get('search')?.toLowerCase();
    const filters = url.searchParams.get('filters')?.split(',');

    let categories = parentId 
      ? subCategories[parentId] || []
      : mainCategories;

    if (search) {
      categories = categories.filter(category =>
        category.name.toLowerCase().includes(search) ||
        category.description?.toLowerCase().includes(search)
      );
    }

    if (filters?.length) {
      categories = categories.filter(category =>
        filters.some(filter => category.filters?.includes(filter))
      );
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}