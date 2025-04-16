import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

type Theory = {
  title: string
  date: string
  user: string
  tags: string[]
  likes: number
  comments: number
  tag: string
  icon: string
  slug: string
}

export async function getStaticProps() {
  const files = fs.readdirSync(path.join('posts'))

  const theories = files.map((filename) => {
    const slug = filename.replace('.md', '')
    const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8')
    const { data } = matter(markdownWithMeta)

    return {
      ...data,
      tags: data.tags || [],
      slug,
    } as Theory
  })

  return {
    props: { theories },
  }
}

export default function Home({ theories }: { theories: Theory[] }) {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white">
        <div className="text-xl font-bold text-pink-600 flex items-center gap-2">
          <span>🎵</span> K-Pop Theory Zone
        </div>
        <nav className="flex gap-6 items-center text-gray-700 text-sm font-medium">
          <Link href="#">Home</Link>
          <Link href="#">Theories</Link>
          <Link href="#">Groups</Link>
          <Link href="#">About</Link>
          <Link href="#">
            <button className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition">
              Subscribe
            </button>
          </Link>
        </nav>
      </header>

      <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-20 px-4">
        <h1 className="text-4xl font-extrabold mb-4">Share Your K-Pop Theories</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Dive into the world of K-pop mysteries, hidden messages, and fan theories.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-white text-purple-700 font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition">Explore Theories</button>
          <button className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-purple-700 transition">Subscribe Now</button>
        </div>
      </section>

      <section className="px-6 py-12 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Theories</h2>
          <Link href="#" className="text-purple-600 hover:underline font-medium">View All</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {theories.map((theory, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-lg transition">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white bg-red-500 px-2 py-1 rounded-full font-semibold">{theory.tag}</span>
                <span className="text-3xl">{theory.icon}</span>
              </div>
              <div className="text-sm text-gray-600 mb-1">@{theory.user}</div>
              <h3 className="font-bold text-lg">{theory.title}</h3>
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                {Array.isArray(theory.tags) &&
                  theory.tags.map((tag, idx) => (
                    <span key={idx} className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full">{tag}</span>
                  ))}
              </div>
              <div className="flex justify-between mt-4 text-sm text-gray-500">
                <span>{theory.date}</span>
                <div className="flex items-center gap-3">
                  <span>❤️ {theory.likes}</span>
                  <span>💬 {theory.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}