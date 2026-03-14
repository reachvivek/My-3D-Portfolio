"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    // Parallax effect on ambient orbs
    gsap.utils.toArray<HTMLElement>(".parallax-slow").forEach((el) => {
      gsap.to(el, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") || el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    // Fade-up reveal for all sections with .gsap-reveal
    gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Staggered reveal for card grids
    gsap.utils.toArray<HTMLElement>(".gsap-stagger-parent").forEach((parent) => {
      const children = parent.querySelectorAll(".gsap-stagger-child");
      gsap.fromTo(
        children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: parent,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Horizontal slide-in for text elements
    gsap.utils.toArray<HTMLElement>(".gsap-slide-right").forEach((el) => {
      gsap.fromTo(
        el,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Scale-in for special elements
    gsap.utils.toArray<HTMLElement>(".gsap-scale-in").forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
