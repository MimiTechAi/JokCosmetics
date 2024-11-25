import { notFound } from "next/navigation";
import { BlogPost } from "@/components/blog/blog-post";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // In production, fetch the blog post data from your API
  // For now, we'll return a 404 if the post doesn't exist
  if (!params.slug) {
    notFound();
  }

  return <BlogPost slug={params.slug} />;
}