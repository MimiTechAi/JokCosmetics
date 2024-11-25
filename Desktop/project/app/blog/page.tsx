import { BlogList } from "@/components/blog/blog-list";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Blog</Badge>
          <h1 className="text-4xl font-bold mb-6">Naturio Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Erfahren Sie mehr über Nachhaltigkeit, bewussten Konsum und unsere Mission für eine bessere Zukunft
          </p>
        </div>
        
        <BlogList />
      </div>
    </div>
  );
}