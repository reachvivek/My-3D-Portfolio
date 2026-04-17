export interface ProjectData {
  _id?: string;
  title: string;
  slug: string;
  desc: string;
  imgPath: string;
  tags: string[];
  category: string;
  order?: number;
  problem?: string;
  solution?: string;
  impact?: string[];
  stack?: string[];
  role?: string;
  duration?: string;
  liveUrl?: string;
  screenshots?: string[];
  videoUrl?: string;
}

export interface StatData {
  value: string;
  label: string;
}

export interface ProcessData {
  step: string;
  title: string;
  desc: string;
}

export interface CompanyData {
  name: string;
  logo: string;
  highlight: boolean;
}

export interface ServiceData {
  icon: string;
  title: string;
  desc: string;
}

export interface TestimonialData {
  name: string;
  role: string;
  text: string;
  imgPath: string;
}

export interface SocialLinkData {
  name: string;
  url: string;
}

export interface NavLinkData {
  name: string;
  href: string;
}

export interface HeroData {
  headline: string;
  headlineAccent: string;
  subline: string;
  location: string;
}

export interface ExperienceData {
  title: string;
  company: string;
  date: string;
  location?: string;
  highlights: string[];
  tags?: string[];
  order?: number;
}

export interface FlagshipData {
  title: string;
  slug?: string;
  problem: string;
  solution: string;
  impact: string[];
  stack: string[];
  imgPath: string;
}

export interface BlogPostData {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt: string;
  readTime: string;
  claps?: number;
  views?: number;
}
