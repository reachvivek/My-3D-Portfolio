import { getAllPageData } from "@/lib/queries";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Companies from "@/components/Companies";
import Projects from "@/components/Projects";
import Flagship from "@/components/Flagship";
import Process from "@/components/Process";
import Services from "@/components/Services";
import TechStack3D from "@/components/TechStack3D";
import Exploring from "@/components/Exploring";
import Highlights from "@/components/Highlights";
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
      <Hero hero={data.hero} />
      <Stats stats={data.stats} />
      <Companies companies={data.companies} />
      <Projects projects={data.projects} />
      <Flagship flagship={data.flagship} />
      <Experience experiences={data.experiences} />
      <Process process={data.process} />
      <Services services={data.services} />
      <TechStack3D />
      <Exploring />
      <Highlights />
      <Testimonials testimonials={data.testimonials} />
      <Contact socialLinks={data.socialLinks} />
      <Footer socialLinks={data.socialLinks} />
      <FloatingWhatsApp />
    </main>
  );
}
