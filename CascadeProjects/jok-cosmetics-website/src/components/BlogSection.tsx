import BlogCard from './BlogCard';

const blogPosts = [
  {
    title: 'Die perfekten Powderbrows - Was Sie wissen müssen',
    excerpt: 'Erfahren Sie alles über die moderne Technik der Powder Brows und wie sie Ihren Look natürlich verfeinern.',
    date: '6. Januar 2025',
    image: '/images/blog/powderbrows-guide.jpg',
    slug: 'perfekte-powderbrows-guide',
    category: 'Permanent Make-up'
  },
  {
    title: 'Pflege nach der Wimpernverlängerung',
    excerpt: 'Die besten Tipps zur Pflege Ihrer neuen Wimpernverlängerung für ein langanhaltend schönes Ergebnis.',
    date: '4. Januar 2025',
    image: '/images/blog/lashes-care.jpg',
    slug: 'wimpernverlaengerung-pflege',
    category: 'Wimpern'
  },
  {
    title: 'Beauty-Trends 2025',
    excerpt: 'Entdecken Sie die neuesten Beauty-Trends und Techniken für das Jahr 2025.',
    date: '1. Januar 2025',
    image: '/images/blog/trends-2025.jpg',
    slug: 'beauty-trends-2025',
    category: 'Trends'
  }
];

const BlogSection = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl text-center mb-4 font-serif">
          Beauty Blog
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Tipps, Trends und Expertenwissen aus der Welt der Beauty
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
