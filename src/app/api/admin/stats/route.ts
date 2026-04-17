import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BlogPost, Enquiry } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();

    const [posts, totalEnquiries, unreadEnquiries] = await Promise.all([
      BlogPost.find({}).lean(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ read: false }),
    ]);

    const totalPosts = posts.length;
    const publishedPosts = posts.filter((p: any) => p.published).length;
    const draftPosts = totalPosts - publishedPosts;
    const totalViews = posts.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
    const totalClaps = posts.reduce((sum: number, p: any) => sum + (p.claps || 0), 0);

    // Views per post (for bar chart)
    const viewsPerPost = posts
      .map((p: any) => ({
        title: p.title,
        slug: p.slug,
        views: p.views || 0,
      }))
      .sort((a: any, b: any) => b.views - a.views);

    // Top performing posts
    const topPosts = viewsPerPost.slice(0, 5);

    // Views over time (group by month from publishedAt)
    const viewsByMonth: Record<string, number> = {};
    posts.forEach((p: any) => {
      if (p.publishedAt) {
        const date = new Date(p.publishedAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        viewsByMonth[key] = (viewsByMonth[key] || 0) + (p.views || 0);
      }
    });

    const viewsOverTime = Object.entries(viewsByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, views]) => ({ month, views }));

    return NextResponse.json({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalClaps,
      viewsPerPost,
      topPosts,
      viewsOverTime,
      totalEnquiries,
      unreadEnquiries,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
