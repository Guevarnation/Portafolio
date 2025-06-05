"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./style.module.scss";
import Image from "next/legacy/image";
import Rounded from "../../common/RoundedButton/RoundedButton";

const projects = [
  {
    title: "YEYAR",
    description:
      "Spearheaded the design and development of YEYAR, a real estate investment platform focused on verified presale properties across Mexico. Selected and implemented the entire tech stack including infrastructure, database design, and deployment strategy. Built interactive property maps with Google Maps API, advanced filtering, and investor dashboards. Led the creation of an internal CMS for editorial content published by in-house journalists, offering users real estate insights. Integrated Stripe for secure payments and implemented a reservation system for units.",
    technologies: "Next.js, React, Tanstack, MySQL, Stripe, TailwindCSS",
    src: "YEYAR.png",
    videoSrc: "yeyar.mp4",
    color: "#8C8C8C",
    link: "https://yeyar.mx",
  },
  {
    title: "YEYAR Mobile App",
    description:
      "Engineered a cross-platform mobile application using React Native and Expo, delivering native performance across iOS and Android. Implemented real-time push notifications using Pusher for investment updates and property alerts. Integrated device-native features including camera functionality for document uploads and biometric authentication. Built offline-capable architecture with data synchronization, ensuring seamless user experience regardless of connectivity. Successfully deployed to both App Store and Google Play with 4+ rating.",
    technologies: "React Native, Expo, Stripe, Pusher, Native APIs",
    src: "YEYAR-app.png",
    color: "#EFE8D3",
    link: "https://apps.apple.com/us/app/yeyar/id6737579256",
  },
  {
    title: "AI & RAG Systems",
    description:
      "Led a 3-developer team at a New York-based fintech company to architect an advanced AI system achieving 90% accuracy on FinanceBench evaluations. Built a sophisticated RAG (Retrieval-Augmented Generation) pipeline integrating Claude 3.7 with SEC EDGAR database for real-time financial document analysis. The system processes 10-K, 10-Q, and 8-K filings, extracting key financial metrics and generating intelligent responses to complex investment queries. Implemented vector embeddings with pgvector for semantic search across millions of financial documents, while integrating multiple financial APIs for live market data, earnings calendars, and EPS projections.",
    technologies:
      "Next.js, Vercel AI SDK, OpenAI, Anthropic, pgvector, Supabase",
    src: "EW.png",
    videoSrc: "ew.mp4",
    color: "#000000",
    link: "#",
  },
  {
    title: "Chrome Extension",
    description:
      "Developed a sophisticated custom browser extension that automatically selects adjacent seats with a single click. Engineered a universal solution compatible with all major ticketing platforms through advanced DOM manipulation and pattern recognition algorithms. Implemented a robust licensing system with encrypted authentication and user management. Built a custom UI framework optimized for overlay interfaces across different websites. The extension features extensive customization options, automated seat mapping, and intelligent seat grouping algorithms that reduces bulk purchase time by 80%.",
    technologies: "JavaScript, Chrome API, Custom UI Framework",
    src: "chrome-extension.png",
    videoSrc: "tm.mov",
    color: "#000000",
    link: "#",
  },
  {
    title: "Blockchain Solutions",
    description:
      "Created and deployed a simple ERC-20 token and accompanying dApp as part of a blockchain learning initiative. Users could mint, buy, and sell the token via a minimal UI using MetaMask and Web3.js. Designed smart contract logic, handled deployment on Ethereum testnets, and gained familiarity with gas optimization, wallets, and security concerns in smart contract development.",
    technologies: "Solidity, Ethereum, Web3.js",
    src: "blockchain.png",
    color: "#706D63",
    link: "#",
  },
];

// Custom hook for individual project visibility
function useProjectInView() {
  return useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px 100px 0px",
  });
}

// Individual project component to handle hooks properly
function ProjectItem({
  project,
  index,
  hoveredIndex,
  onMouseEnter,
  onMouseLeave,
  prefersReducedMotion,
  videoRef,
}) {
  const imageOnLeft = index % 2 === 0;
  const { ref, inView } = useProjectInView();

  const fadeInUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      key={index}
      className={styles.projectItem}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={onMouseLeave}
      onClick={() => project.link && window.open(project.link, "_blank")}
    >
      <div
        className={styles.projectContent}
        style={{ flexDirection: imageOnLeft ? "row" : "row-reverse" }}
      >
        {/* Image Container */}
        <motion.div className={styles.imageContainer} variants={scaleIn}>
          <div
            className={styles.imageWrapper}
            style={{
              transform:
                hoveredIndex === index && !prefersReducedMotion
                  ? "scale(1.02)"
                  : "scale(1)",
              transition: "transform 0.3s ease",
            }}
          >
            {project.videoSrc ? (
              <video
                ref={videoRef}
                width="100%"
                height="auto"
                autoPlay={false}
                loop
                muted
                playsInline
                preload="metadata"
                loading="lazy"
                style={{
                  objectFit: "cover",
                  borderRadius: "12px",
                  willChange: "transform",
                }}
              >
                <source
                  src={`/videos/${project.videoSrc}#t=0.1`}
                  type="video/mp4"
                />
                {/* Fallback image if video fails */}
                <Image
                  src={`/images/${project.src}`}
                  width={600}
                  height={400}
                  alt={project.title}
                  objectFit="cover"
                  style={{ borderRadius: "12px" }}
                  unoptimized={false}
                  priority={index < 2}
                />
              </video>
            ) : (
              <Image
                src={`/images/${project.src}`}
                width={600}
                height={400}
                alt={project.title}
                objectFit="cover"
                unoptimized={false}
                priority={index < 2}
                style={{
                  borderRadius: "12px",
                  willChange: "transform",
                }}
              />
            )}
          </div>
        </motion.div>

        {/* Project Details */}
        <div className={styles.projectDetails}>
          <motion.h3 className={styles.projectTitle} variants={fadeInUp}>
            {project.title}
          </motion.h3>

          <motion.p className={styles.projectDescription} variants={fadeInUp}>
            {project.description}
          </motion.p>

          <motion.div className={styles.techStack} variants={fadeInUp}>
            <span className={styles.techLabel}>Technologies:</span>
            <p>{project.technologies}</p>
          </motion.div>

          {project.link && (
            <motion.div className={styles.projectLink} variants={fadeInUp}>
              <Rounded>
                <p>View Project</p>
              </Rounded>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const videoRefs = useRef([]);

  const handleMouseEnter = (index) => {
    if (!prefersReducedMotion) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!prefersReducedMotion) {
      setHoveredIndex(null);
    }
  };

  // Control video playback based on visibility
  useEffect(() => {
    const currentVideoRefs = videoRefs.current; // Copy ref to variable

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index, 10);
          if (entry.isIntersecting) {
            if (currentVideoRefs[index]) {
              currentVideoRefs[index].play().catch((e) => {
                console.log("Auto-play was prevented");
              });
            }
          } else {
            if (currentVideoRefs[index]) {
              currentVideoRefs[index].pause();
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    currentVideoRefs.forEach((video, index) => {
      if (video) {
        video.dataset.index = index;
        observer.observe(video);
      }
    });

    return () => {
      currentVideoRefs.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, []);

  return (
    <section className={styles.projects} id="work">
      <div className={styles.container}>
        {projects.map((project, index) => (
          <ProjectItem
            key={index}
            project={project}
            index={index}
            hoveredIndex={hoveredIndex}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            prefersReducedMotion={prefersReducedMotion}
            videoRef={(el) => {
              videoRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
