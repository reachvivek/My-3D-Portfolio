import type { MetadataRoute } from "next";
import { getAllProjectSlugs, getAllBlogSlugs } from "@/lib/queries";

const SERVICE_SLUGS = [
  "ai-developer-dubai",
  "full-stack-developer-uae",
  "web-developer-abu-dhabi",
  "react-developer-dubai",
  "nodejs-developer-uae",
  "fintech-developer-dubai",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, blogSlugs] = await Promise.all([
    getAllProjectSlugs(),
    getAllBlogSlugs(),
  ]);

  const projectUrls: MetadataRoute.Sitemap = projectSlugs.map(
    (slug: string) => ({
      url: `https://reachvivek.vercel.app/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  const serviceUrls: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `https://reachvivek.vercel.app/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const blogUrls: MetadataRoute.Sitemap = blogSlugs.map((slug: string) => ({
    url: `https://reachvivek.vercel.app/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: "https://reachvivek.vercel.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://reachvivek.vercel.app/menu",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: "https://reachvivek.vercel.app/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...serviceUrls,
    ...projectUrls,
    ...blogUrls,
  ];
}
