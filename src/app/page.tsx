import { getAllPageData } from "@/lib/queries";
import Navbar from "@/components/Navbar";
import HeroShowcase from "@/components/HeroShowcase";
import Credentials from "@/components/Credentials";
import About from "@/components/About";
import Projects from "@/components/Projects";
import CaseStudies from "@/components/CaseStudies";
import WorldMap from "@/components/WorldMap";
import Process from "@/components/Process";
import Services from "@/components/Services";
import TechStack3D from "@/components/TechStack3D";
import Exploring from "@/components/Exploring";
import Highlights from "@/components/Highlights";
import GitHub from "@/components/GitHub";
import BlogSection from "@/components/BlogSection";
import Testimonials from "@/components/Testimonials";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const revalidate = 60; // revalidate data every 60 seconds

export default async function Home() {
  const data = await getAllPageData();

  return (
    <main>
      <Preloader />
      <SmoothScroll />
      <Navbar navLinks={data.navLinks} />
      <HeroShowcase hero={data.hero} projects={data.projects} experiences={data.experiences} />
      <Credentials stats={data.stats} />
      <Projects projects={data.projects} />
      <CaseStudies projects={data.projects} />
      <WorldMap />
      <About />
      <Experience experiences={data.experiences} />
      <Process process={data.process} />
      <Services services={data.services} />
      <TechStack3D />
      <Exploring />
      <Highlights />
      <GitHub />
      <BlogSection posts={data.blogPosts} />
      <Testimonials testimonials={data.testimonials} />
      <Contact socialLinks={data.socialLinks} />
      <Footer socialLinks={data.socialLinks} />
      <FloatingWhatsApp />
    </main>
  );
}
