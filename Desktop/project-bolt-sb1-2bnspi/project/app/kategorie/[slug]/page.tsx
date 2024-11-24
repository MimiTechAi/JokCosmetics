import { CategoryBreadcrumb } from "@/components/categories/category-breadcrumb";
import { ProductGrid } from "@/components/products/product-grid";
import { mainCategories, subCategories } from "@/lib/categories";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Find category by slug
  const category = mainCategories.find(c => c.slug === params.slug) ||
    Object.values(subCategories).flat().find(c => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  // Get parent category if this is a subcategory
  const parentCategory = category.parentId 
    ? mainCategories.find(c => c.id === category.parentId)
    : undefined;

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <CategoryBreadcrumb 
          category={{
            name: category.name,
            slug: category.slug,
            parentCategory: parentCategory && {
              name: parentCategory.name,
              slug: parentCategory.slug
            }
          }}
        />
        
        <h1 className="text-3xl font-bold mt-4 mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground">{category.description}</p>
        )}
      </div>

      <ProductGrid 
        categoryId={category.id}
        filters={category.filters}
        certifications={category.certifications}
      />
    </div>
  );
}