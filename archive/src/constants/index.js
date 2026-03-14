const navLinks = [
  {
    name: "Projects",
    link: "#work",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Skills",
    link: "#skills",
  },
  {
    name: "Testimonials",
    link: "#testimonials",
  },
];

const words = [
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
  { text: "Innovative", imgPath: "/images/ideas.svg" },
  { text: "Scalable", imgPath: "/images/concepts.svg" },
  { text: "Impactful", imgPath: "/images/designs.svg" },
  { text: "Structured", imgPath: "/images/code.svg" },
];

const counterItems = [
  { value: 3, suffix: "+", label: "Years of Experience" },
  { value: 10, suffix: "+", label: "Satisfied Clients" },
  { value: 100, suffix: "+", label: "Completed Projects" },
  { value: 90, suffix: "%", label: "Client Retention Rate" },
];

const logoIconsList = [
  {
    imgPath: "/images/logos/azmeel.png",
  },
  {
    imgPath: "/images/logos/blc.png",
  },
  {
    imgPath: "/images/logos/bse.png",
  },
  {
    imgPath: "/images/logos/cms.png",
  },
  {
    imgPath: "/images/logos/hoopr.png",
  },
  {
    imgPath: "/images/logos/nsdl.png",
  },
  {
    imgPath: "/images/logos/oneture.png",
  },
];

const abilities = [
  {
    imgPath: "/images/seo.png",
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Clear Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: "/images/time.png",
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];

const techStackImgs = [
  {
    name: "Angular Developer",
    imgPath: "/images/logos/react.png",
  },
  {
    name: "React Developer",
    imgPath: "/images/logos/react.png",
  },
  {
    name: ".Net Developer",
    imgPath: "/images/logos/python.svg",
  },
  {
    name: "Node.js Developer",
    imgPath: "/images/logos/node.png",
  },
  {
    name: "Interactive Developer",
    imgPath: "/images/logos/three.png",
  },
  {
    name: "Project Manager",
    imgPath: "/images/logos/git.svg",
  },
];

const techStackIcons = [
  {
    name: "Angular",
    modelPath: "/models/angular.glb", // Make sure this exists or add it to your models folder
    scale: 1.8,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "React",
    modelPath: "/models/react_logo-transformed.glb", // Make sure this exists or add it to your models folder
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: ".NET / C#",
    modelPath: "/models/csharp.glb", // Custom .NET model or a general C# logo
    scale: 1.8,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "Node.js",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "Python",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },
  {
    name: "DevOps & Docker",
    modelPath: "/models/docker.glb", // Add or find a docker-compatible GLB
    scale: 9,
    rotation: [0, -0.3, 0],
  },
  {
    name: "AWS Cloud Engineer",
    modelPath: "/models/aws.glb", // Add AWS model if available
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "Git & GitHub ",
    modelPath: "/models/git.glb",
    scale: 6,
    rotation: [0, 0, 0],
  },
];

const expCards = [
  {
    title: "Oneture Technologies",
    date: "Apr 2024 – Present",
    imgPath: "/images/experiences/exp-oneture.png",
    logoPath: "/images/logos/oneture.png",
    responsibilities: [
      "Developed scalable web applications for CMS Info Systems using .NET Core, Angular, and AWS.",
      "Designed and implemented robust RESTful APIs and cloud services to optimize performance and user experience.",
      "Collaborated with cross-functional teams to integrate new features and maintain high code quality.",
      "Ensured seamless front-end/back-end integration with best practices for scalability and maintainability.",
    ],
  },
  {
    title: "CMS Info Systems (Contract via Oneture Technologies)",
    date: "Feb 2024 – Present",
    imgPath: "/images/experiences/exp-cms.png",
    logoPath: "/images/logos/cms.png",
    responsibilities: [
      "Full Stack Development for Payment Advisory Portal (Clearpay) and Supervisory Report module",
      "Handled frontend-backend integration and major role in Employee Awards & Appraisal month extensions",
      "Direct collaboration with Komal Jadhav (PM) and Ruchira for deliverables and enhancements",
    ],
  },
  {
    title: "Bombay Stock Exchange (Contract via Oneture Technologies)",
    date: "Nov 2023 – Feb 2024",
    imgPath: "/images/experiences/exp-bse.png",
    logoPath: "/images/logos/bse.png",
    responsibilities: [
      "Backend ownership of BSE DaaS (Data as a Service) with optimized NodeJS-based APIs and database queries",
      "Coordinated with Ravi (PM) for regular feature deliveries, deployments, and client communication",
      "Implemented performance fixes and DevOps enhancements for data flow and storage optimization",
    ],
  },
  {
    title: "NSDL (Contract via Oneture Technologies)",
    date: "Jul 2023 – Nov 2023",
    imgPath: "/images/experiences/exp-nsdl.png",
    logoPath: "/images/logos/nsdl.png",
    responsibilities: [
      "Developed and maintained FPI dashboard using Angular and .NET Core stack",
      "Contributed to secure login flow, integration with multiple data sources and OTP mechanisms",
      "Collaborated with Vaibhav Malave and team for cross-functional module development and UAT fixes",
    ],
  },
  {
    title: "Blackcurrant Labs Pvt. Ltd.",
    date: "Nov 2021 – Mar 2024",
    imgPath: "/images/experiences/exp-emit.png",
    logoPath: "/images/logos/blc.png",
    responsibilities: [
      "Developed the Emit timesheet application with hashtag-based task clustering for reporting.",
      "Translated Figma designs into responsive Angular components for the Azmeel platform.",
      "Built and tested backend APIs with rigorous coverage and performance optimizations.",
      "Created an ML-based audio recognition module for Hoopr.AI to detect copyright risks.",
    ],
  },
  {
    title: "Hoopr.AI (Contract via Blackcurrant Labs)",
    date: "Jan 2023 – Jun 2023",
    imgPath: "/images/experiences/exp-hoopr.png",
    logoPath: "/images/logos/hoopr.png",
    responsibilities: [
      "Built microservices in Node.js for music licensing platform with AWS Lambda integrations",
      "Integrated payment workflows and music catalog management with a scalable backend architecture",
      "Closely worked with the product team to streamline user experience and API consumption",
    ],
  },
  {
    title: "AZMEEL Contracting (Contract via Blackcurrant Labs)",
    date: "Mar 2023 – Sep 2023",
    imgPath: "/images/experiences/exp-azmeel.png",
    logoPath: "/images/logos/azmeel.png",
    responsibilities: [
      "Developed responsive front-end components in Angular based on wireframe designs.",
      "Implemented RESTful backend services with Node.js and Express.js following best practices.",
      "Ensured code quality and scalability through rigorous testing and performance tuning.",
      "Collaborated with designers and stakeholders to deliver user-centric features on schedule.",
    ],
  },
];

const expLogos = [
  {
    name: "logo1",
    imgPath: "/images/logo1.png",
  },
  {
    name: "logo2",
    imgPath: "/images/logo2.png",
  },
  {
    name: "logo3",
    imgPath: "/images/logo3.png",
  },
];

const testimonials = [
  {
    name: "Komal Jadhav",
    mentions: "Manager - Application Developer, CMS Info Systems",
    review:
      "Vivek’s commitment to CMS was exceptional. From tight deadlines to high expectations, he consistently delivered with sharp UI decisions, rock-solid development, and a can-do attitude. His dedication and focus truly made a difference across our modules.",
    imgPath: "/images/testimonials/komal.png",
  },
  {
    name: "Mahesh Pathak",
    mentions: "CEO, Oneture Technologies",
    review:
      "Vivek has consistently proven his versatility and innovation while working with our clients at Oneture. Whether it was NSDL, BSE, or CMS, his ability to adapt, lead, and deliver high-quality solutions across technologies has made him one of our most valued engineers.",
    imgPath: "/images/testimonials/mahesh.jpg",
  },
  {
    name: "Ravi Mevcha",
    mentions: "CTO & Product Management Lead, Oneture Technologies",
    review:
      "At BSE, Vivek stepped up to take full ownership of both the UI and backend for our DaaS platform. His work ethic, speed, and quality of delivery under pressure were impressive. He brought structure, stability, and polish to the entire system.",
    imgPath: "/images/testimonials/ravi.jpg",
  },
  {
    name: "Ruchira Thakare",
    mentions: "Director, CMS Info Systems",
    review:
      "Vivek brought our vision to life with his clean, user-centric frontend development. His eye for detail, design intuition, and ability to iterate quickly helped us ship beautiful interfaces at CMS with consistency and quality.",
    imgPath: "/images/testimonials/ruchira.jpg",
  },
  {
    name: "Vaibhav Malave",
    mentions: "Engineering Manager, Oneture Technologies",
    review:
      "Vivek was one of the most reliable developers on the NSDL FPI project. He consistently went above and beyond — proactively solving challenges, collaborating across teams, and delivering end-to-end features with precision and care.",
    imgPath: "/images/testimonials/vaibhav.jpg",
  },
  {
    name: "Aayush Shah",
    mentions: "Director of Engineering, Oneture Technologies",
    review:
      "Vivek showed deep ownership on the BSE project. From complex backend flows to S3 data sync jobs and security-first development, he ensured our cloud infrastructure and services worked flawlessly. His backend skills are elite.",
    imgPath: "/images/testimonials/aayush.jpg",
  },
];

const socialImgs = [
  {
    name: "instagram",
    imgPath: "/images/insta.png",
    url: "https://instagram.com/rogerthatvivek",
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin.png",
    url: "https://linkedin.com/in/reachvivek",
  },
  {
    name: "github",
    imgPath: "/images/github.webp",
    url: "https://github.com/reachvivek",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
};
