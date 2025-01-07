'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
  category: string;
}

const BlogCard = ({ title, excerpt, date, image, slug, category }: BlogCardProps) => {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <Link href={`/blog/${slug}`}>
        <div className="relative h-48">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm">
            {category}
          </div>
        </div>
        <div className="p-6">
          <time className="text-sm text-gray-500">{date}</time>
          <h3 className="text-xl font-serif mt-2 mb-3 hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {excerpt}
          </p>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
