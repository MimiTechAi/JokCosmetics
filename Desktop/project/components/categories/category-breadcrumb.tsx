import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface CategoryBreadcrumbProps {
  category?: {
    name: string;
    slug: string;
    parentCategory?: {
      name: string;
      slug: string;
    };
  };
}

export function CategoryBreadcrumb({ category }: CategoryBreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        <li>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </li>
        <li>
          <Link
            href="/kategorien"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Kategorien
          </Link>
        </li>
        {category?.parentCategory && (
          <>
            <li>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
            <li>
              <Link
                href={`/kategorie/${category.parentCategory.slug}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {category.parentCategory.name}
              </Link>
            </li>
          </>
        )}
        {category && (
          <>
            <li>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
            <li>
              <Link
                href={`/kategorie/${category.slug}`}
                className="text-foreground font-medium"
                aria-current="page"
              >
                {category.name}
              </Link>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}