// pages/index.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Head from "next/head";

// --- Types

type Theory = {
  title: string;
  date: string;
  user: string;
  tags: string[];
  likes: number;
  comments: number;
  tag: string;
  icon: string;
  slug: string;
};

// --- Static Props

export async function getStaticProps() {
  const files = fs.readdirSync(path.join("posts"));

  const theories = files.map((filename) => {
    const slug = filename.replace(".md", "");
    const markdownWithMeta = fs.readFileSync(
      path.join("posts", filename),
      "utf-8"
    );
    const { data } = matter(markdownWithMeta);

    return {
      ...data,
      tags: data.tags || [],
      slug,
    } as Theory;
  });

  return {
    props: { theories },
  };
}

// --- Component

export default function Home({ theories }: { theories: Theory[] }) {
  return (
    <>
      <Head>
        <title>KPOP Archive</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 shadow-md bg-white">
        <div className="text-2xl font-extrabold text-pink-600 whitespace-nowrap flex items-center gap-2">
          <span>🎵</span> KPOP Archive
        </div>
        <nav className="flex flex-wrap justify-center sm:justify-end gap-4 text-gray-700 text-sm mt-4 sm:mt-0">
          <Link href="#">Home</Link>
          <Link href="#">Theories</Link>
          <Link href="#">Groups</Link>
          <Link href="#">About</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-16 px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          Share Your KPOP Theories
        </h1>
        <p className="max-w-xl mx-auto text-base sm:text-lg">
          Dive into the world of K-pop mysteries, hidden messages, and fan
          theories.
        </p>
      </section>

      {/* Featured Theories */}
      <section className="px-4 sm:px-6 py-12 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Featured Theories</h2>
          <Link
            href="#"
            className="text-purple-600 hover:underline text-sm mt-2 sm:mt-0"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {theories.map((theory, i) => (
            <Link href={`/theory/${theory.slug}`} key={i}>
              <div className="bg-white rounded-xl p-4 shadow hover:shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer">
                {theory.thumbnail && (
                  <img
                    src={theory.thumbnail}
                    alt={theory.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-white bg-red-500 px-2 py-1 rounded-full font-semibold">
                    {theory.tag}
                  </span>
                  <span className="text-2xl">{theory.icon}</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">@{theory.user}</div>
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                  {theory.title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  {theory.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                  <span>{theory.date}</span>
                  <div className="flex gap-3">
                    <span>❤️ {theory.likes}</span>
                    <span>💬 {theory.comments}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-6 bg-white border-t mt-12">
        <p>© {new Date().getFullYear()} KPOP Archive. All rights reserved.</p>
      </footer>
    </>
  );
}
