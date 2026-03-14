import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/queries";
import ProjectDetail from "@/components/ProjectDetail";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  const tagList = project.tags.slice(0, 4).join(", ");
  const seoDesc = `${project.desc} Built by Vivek Kumar Singh, full-stack developer in Dubai, UAE. ${project.category} project using ${tagList}. View the full case study.`;

  return {
    title: `${project.title} | Case Study by Vivek Kumar Singh, Developer in Dubai UAE`,
    description: seoDesc,
    keywords: [
      ...project.tags,
      project.title,
      `${project.category} developer Dubai`,
      `${project.category} developer UAE`,
      `${project.category} project case study`,
      "case study",
      "portfolio project",
      "Vivek Kumar Singh",
      "developer Dubai",
      "developer UAE",
      "full stack developer Dubai",
      "AI developer UAE",
    ],
    openGraph: {
      title: `${project.title} | Built by Vivek Kumar Singh, Full-Stack Developer in Dubai`,
      description: seoDesc,
      images: [
        {
          url: project.imgPath,
          width: 1200,
          height: 630,
          alt: `${project.title} - Case Study by Vivek Kumar Singh`,
        },
      ],
      type: "article",
      url: `https://viveksingh.dev/projects/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Vivek Kumar Singh`,
      description: seoDesc,
      images: [project.imgPath],
    },
    alternates: {
      canonical: `https://viveksingh.dev/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${project.title} - Case Study`,
    description: project.desc,
    image: `https://viveksingh.dev${project.imgPath}`,
    author: {
      "@type": "Person",
      "@id": "https://viveksingh.dev/#person",
      name: "Vivek Kumar Singh",
      url: "https://viveksingh.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Vivek Kumar Singh",
      url: "https://viveksingh.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://viveksingh.dev/projects/${slug}`,
    },
    keywords: project.tags.join(", "),
    about: {
      "@type": "SoftwareApplication",
      name: project.title,
      applicationCategory: project.category,
      operatingSystem: "Web",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://viveksingh.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: "https://viveksingh.dev/#work",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `https://viveksingh.dev/projects/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleSchema, breadcrumbSchema]),
        }}
      />
      <ProjectDetail project={project} />
    </>
  );
}
