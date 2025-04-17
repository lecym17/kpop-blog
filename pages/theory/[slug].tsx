import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import Head from "next/head";

// Load the content of each MD file
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const markdownWithMeta = fs.readFileSync(
    path.join("posts", slug + ".md"),
    "utf-8"
  );
  const { data, content } = matter(markdownWithMeta);

  const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    props: {
      theory: {
        ...data,
        content: contentHtml,
      },
    },
  };
};

// Tell Next.js which slugs exist
export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join("posts"));

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

// Page component
export default function TheoryPage({ theory }: { theory: any }) {
  return (
    <>
      <Head>
        <title>{theory.title}</title>
      </Head>

      <article className="prose prose-lg mx-auto py-10 prose-headings:text-center prose-p:text-center prose-img:mx-auto">
        <div dangerouslySetInnerHTML={{ __html: theory.content }} />
      </article>
    </>
  );
}
