"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { motion } from "motion/react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TechIcon = {
  name: string;
  /** A .glb in /public/models, or "java" for the coffee cup built from primitives below. */
  modelPath: string;
  scale: number;
  rotation: number[];
};

const techIcons: TechIcon[] = [
  { name: "Java", modelPath: "java", scale: 0.95, rotation: [0.25, -0.5, 0] },
  { name: ".NET / C#", modelPath: "/models/csharp.glb", scale: 1, rotation: [0, -Math.PI / 2, 0] },
  { name: "Node.js", modelPath: "/models/node-transformed.glb", scale: 2.8, rotation: [0, -Math.PI / 2, 0] },
  { name: "React", modelPath: "/models/react_logo-transformed.glb", scale: 0.55, rotation: [0, 0, 0] },
  { name: "Angular", modelPath: "/models/angular.glb", scale: 1, rotation: [0, -Math.PI / 2, 0] },
  { name: "Python", modelPath: "/models/python-transformed.glb", scale: 0.45, rotation: [0, 0, 0] },
  { name: "AWS", modelPath: "/models/aws.glb", scale: 0.55, rotation: [0, 0, 0] },
  { name: "Docker", modelPath: "/models/docker.glb", scale: 5, rotation: [0, -0.3, 0] },
  { name: "Three.js", modelPath: "/models/three.js-transformed.glb", scale: 1, rotation: [0, 0, 0] },
  { name: "Git", modelPath: "/models/git.glb", scale: 3.5, rotation: [0, 0, 0] },
];

const JAVA_BLUE = "#5382a1";
const JAVA_ORANGE = "#f89820";

/** Java's coffee cup and steam, built from primitives (no .glb needed). */
function JavaCup() {
  const cupProfile = [
    [0, 0], [0.85, 0], [0.95, 0.08], [1.1, 1.7], [1.0, 1.7], [0.86, 0.16], [0, 0.16],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const steam = (dx: number, h: number) =>
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(dx - 0.15, 1.95, 0),
      new THREE.Vector3(dx + 0.15, 1.95 + h * 0.33, 0),
      new THREE.Vector3(dx - 0.15, 1.95 + h * 0.66, 0),
      new THREE.Vector3(dx + 0.12, 1.95 + h, 0),
    ]);
  return (
    <group position={[0, -1.35, 0]}>
      <mesh>
        <latheGeometry args={[cupProfile, 48]} />
        <meshStandardMaterial color={JAVA_BLUE} metalness={0.3} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.12, 0.92, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.42, 0.09, 16, 48, Math.PI]} />
        <meshStandardMaterial color={JAVA_BLUE} metalness={0.3} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[1.55, 1.35, 0.12, 48]} />
        <meshStandardMaterial color={JAVA_BLUE} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh>
        <tubeGeometry args={[steam(-0.25, 1.15), 48, 0.075, 12, false]} />
        <meshStandardMaterial color={JAVA_ORANGE} metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh>
        <tubeGeometry args={[steam(0.3, 0.85), 48, 0.065, 12, false]} />
        <meshStandardMaterial color={JAVA_ORANGE} metalness={0.2} roughness={0.4} />
      </mesh>
    </group>
  );
}

function GltfModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene.clone()} />;
}

function TechModel({ model }: { model: TechIcon }) {
  return (
    <Float speed={4} rotationIntensity={0.5} floatIntensity={0.8}>
      <group
        scale={model.scale}
        rotation={model.rotation as [number, number, number]}
      >
        {model.modelPath === "java" ? <JavaCup /> : <GltfModel path={model.modelPath} />}
      </group>
    </Float>
  );
}

function TechCard({ model }: { model: TechIcon }) {
  return (
    <div className="tech-stack-card glass rounded-xl overflow-hidden group hover:border-gold/15 transition-all">
      <div className="h-36 sm:h-40 relative">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.4} color="#d4a853" />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <TechModel model={model} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      <div className="px-4 py-3 text-center">
        <p className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">
          {model.name}
        </p>
      </div>
    </div>
  );
}

export default function TechStack3D() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".tech-stack-card");
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="skills" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <p className="mt-3 text-white/40 text-sm sm:text-base">
            Technologies I work with daily.
          </p>
        </motion.div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {techIcons.map((icon) => (
            <TechCard key={icon.name} model={icon} />
          ))}
        </div>

        {/* GitHub Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <a
            href="https://github.com/reachvivek"
            target="_blank"
            rel="noopener noreferrer"
            className="block glass rounded-xl p-6 sm:p-8 group hover:border-gold/15 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white/60 group-hover:text-white transition-colors">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                    @reachvivek
                  </p>
                  <p className="text-xs text-white/30">
                    View my open source contributions
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-white/20 group-hover:text-gold group-hover:translate-x-1 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
            {/* GitHub contribution graph image */}
            <div className="rounded-lg overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">
              <img
                src="/images/github-contributions.png"
                alt="GitHub contribution history"
                className="w-full h-auto"
              />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
