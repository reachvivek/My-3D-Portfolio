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

  const seoDesc = `${project.desc} Built by Vivek Kumar Singh, full-stack developer in Dubai, UAE. ${project.category} project using ${project.tags.slice(0, 3).join(", ")}.`;

  return {
    title: `${project.title} | Case Study | Vivek Kumar Singh, Developer Dubai UAE`,
    description: seoDesc,
    keywords: [
      ...project.tags,
      `${project.category} developer Dubai`,
      `${project.category} developer UAE`,
      "case study",
      "portfolio project",
      "Vivek Kumar Singh",
      "developer Dubai",
      "developer UAE",
    ],
    openGraph: {
      title: `${project.title} | Built by Vivek Kumar Singh, Dubai UAE`,
      description: seoDesc,
      images: [{ url: project.imgPath }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Vivek Kumar Singh`,
      description: seoDesc,
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

  return <ProjectDetail project={project} />;
}
