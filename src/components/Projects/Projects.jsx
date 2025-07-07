"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";
import Image from "next/legacy/image";
import Rounded from "../../common/RoundedButton/RoundedButton";

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
  const t = useTranslations("Projects");
  const imageOnLeft = index % 2 === 0;
  const { ref, inView } = useProjectInView();

  const handleClick = (e, link) => {
    if (e.target.closest("a")) {
      return;
    }
    e.preventDefault();
    if (link) {
      window.open(link, "_blank");
    }
  };

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
      onClick={(e) => handleClick(e, project.link)}
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
                  alt={t(`${project.translationKey}.title`)}
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
                alt={t(`${project.translationKey}.title`)}
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
            {t(`${project.translationKey}.title`)}
          </motion.h3>

          <motion.p className={styles.projectDescription} variants={fadeInUp}>
            {t(`${project.translationKey}.description`)}
          </motion.p>

          <motion.div className={styles.techStack} variants={fadeInUp}>
            <span className={styles.techLabel}>{t("Technologies")}</span>
            <p>{project.technologies}</p>
          </motion.div>

          {project.link && !project.appStoreLink && (
            <motion.div className={styles.projectLink} variants={fadeInUp}>
              <Rounded>
                <p>{t("ViewProject")}</p>
              </Rounded>
            </motion.div>
          )}
          {project.appStoreLink && (
            <motion.div className={styles.projectLink} variants={fadeInUp}>
              <div className="flex flex-row justify-center items-center gap-4 mt-6">
                <a
                  href="https://apps.apple.com/app/id6737579256"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-16 w-40 flex justify-center items-center"
                >
                  <img
                    src="/images/download-black.svg"
                    alt="Download on the App Store"
                    className="h-full w-full object-contain"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.yeyar.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-16 w-40 flex justify-center items-center"
                >
                  <img
                    src="/images/google-play-download.svg"
                    alt="Get it on Google Play"
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
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

  const projects = [
    {
      translationKey: "YEYAR",
      technologies: "Next.js, React, Tanstack, MySQL, Stripe, TailwindCSS",
      src: "YEYAR.png",
      videoSrc: "yeyar.mp4",
      color: "#8C8C8C",
      link: "https://yeyar.mx",
    },
    {
      translationKey: "YEYARMobile",
      technologies: "React Native, Expo, Stripe, Pusher, Native APIs",
      src: "YEYAR-app.png",
      color: "#EFE8D3",
      appStoreLink: true,
    },
    {
      translationKey: "AIRAGSystems",
      technologies:
        "Next.js, Vercel AI SDK, OpenAI, Anthropic, pgvector, Supabase",
      src: "EW.png",
      videoSrc: "ew.mp4",
      color: "#000000",
      link: "#",
    },
    {
      translationKey: "ChromeExtension",
      technologies: "JavaScript, Chrome API, Custom UI Framework",
      src: "chrome-extension.png",
      videoSrc: "tm.mov",
      color: "#000000",
      link: "#",
    },
    {
      translationKey: "BlockchainSolutions",
      technologies: "Solidity, Ethereum, Web3.js",
      src: "blockchain.png",
      color: "#706D63",
      link: "#",
    },
  ];

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
