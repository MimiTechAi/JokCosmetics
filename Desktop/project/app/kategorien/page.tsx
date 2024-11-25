import { CategoryGrid } from "@/components/categories/category-grid";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Kategorien</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Entdecken Sie unsere vielfältige Auswahl an nachhaltigen Produkten, sortiert nach Kategorien
          </p>
        </div>
        <CategoryGrid />
      </div>
    </div>
  );
}