import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

type Theory = {
  title: string
  date: string
  user: string
  tags: string[]
  likes: number
  comments: number
  tag: string
  icon: string
  content: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join('posts'))

  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.md', '')
    }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const markdownWithMeta = fs.readFileSync(path.join('posts', slug + '.md'), 'utf-8')
  const { data, content } = matter(markdownWithMeta)

  return {
    props: {
      theory: {
        ...data,
        content
      }
    }
  }
}

export default function TheoryPage({ theory }: { theory: Theory }) {
  const router = useRouter()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button onClick={() => router.back()} className="mb-4 text-sm text-purple-600 hover:underline">
        ← Back to home
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{theory.title}</h1>
        <div className="text-sm text-gray-500">@{theory.user} • {theory.date}</div>
        <div className="flex gap-2 mt-3 text-xs">
          {theory.tags.map((tag, i) => (
            <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <div className="prose max-w-none prose-purple">
        {theory.content.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  )
}
