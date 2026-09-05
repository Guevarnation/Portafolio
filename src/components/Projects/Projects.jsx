"use client";

import { useState, useRef, useEffect } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";
import Image from "next/image";
import Rounded from "../../common/RoundedButton/RoundedButton";

// Cloudinary delivery transforms: best format/quality for the client, capped
// width. Posters are the first frame (so_0) of the same asset as a JPEG.
const VIDEO_TRANSFORM = "f_auto,q_auto";
const POSTER_TRANSFORM = "so_0,q_auto";

function cloudinaryVideo(url, width) {
  return url.replace(
    "/video/upload/",
    `/video/upload/${VIDEO_TRANSFORM},w_${width}/`,
  );
}

function cloudinaryPoster(url, width) {
  return url
    .replace("/video/upload/", `/video/upload/${POSTER_TRANSFORM},w_${width}/`)
    .replace(/\.mp4$/, ".jpg");
}

const linkStyle = { color: "inherit", textDecoration: "none" };

// Custom hook for individual project visibility (Motion's own useInView).
function useProjectInView() {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: "0px 0px 100px 0px",
  });
  return { ref, inView };
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
  const title = t(`${project.translationKey}.title`);

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

  const videoWidth = project.videoWidth || 1200;

  return (
    <m.div
      ref={ref}
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
    >
      <div
        className={styles.projectContent}
        style={{ flexDirection: imageOnLeft ? "row" : "row-reverse" }}
      >
        {/* Image Container */}
        <m.div
          className={styles.imageContainer}
          variants={scaleIn}
          style={project.customContainerStyle || {}}
        >
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
                src={cloudinaryVideo(project.videoSrc, videoWidth)}
                poster={cloudinaryPoster(project.videoSrc, videoWidth)}
                autoPlay={false}
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={title}
                style={{
                  objectFit: project.videoFit || "cover",
                  borderRadius: "12px",
                  willChange: "transform",
                }}
              />
            ) : (
              <Image
                src={`/images/${project.src}`}
                width={600}
                height={400}
                alt={title}
                style={{
                  objectFit: "cover",
                  borderRadius: "12px",
                  willChange: "transform",
                }}
              />
            )}
          </div>
        </m.div>

        {/* Project Details */}
        <div className={styles.projectDetails}>
          <m.h3 className={styles.projectTitle} variants={fadeInUp}>
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                {title}
              </a>
            ) : (
              title
            )}
          </m.h3>

          <m.p className={styles.projectDescription} variants={fadeInUp}>
            {t(`${project.translationKey}.description`)}
          </m.p>

          <m.div className={styles.techStack} variants={fadeInUp}>
            <span className={styles.techLabel}>{t("Technologies")}</span>
            <p>{project.technologies}</p>
          </m.div>

          {project.link && !project.appStoreLink && (
            <m.div className={styles.projectLink} variants={fadeInUp}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("ViewProject")}: ${title}`}
                style={{ ...linkStyle, display: "inline-block" }}
              >
                <Rounded>
                  <p>{t("ViewProject")}</p>
                </Rounded>
              </a>
            </m.div>
          )}
          {project.appStoreLink && (
            <m.div className={styles.projectLink} variants={fadeInUp}>
              <div className="flex flex-row justify-center items-center gap-4 mt-6">
                <a
                  href="https://apps.apple.com/app/id6737579256"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-16 w-40 flex justify-center items-center"
                >
                  <Image
                    src="/images/download-black.svg"
                    alt={t("appStoreAlt")}
                    width={160}
                    height={53}
                    className="h-full w-full object-contain"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.yeyar.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-16 w-40 flex justify-center items-center"
                >
                  <Image
                    src="/images/google-play-download.svg"
                    alt={t("googlePlayAlt")}
                    width={160}
                    height={54}
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
            </m.div>
          )}
        </div>
      </div>
    </m.div>
  );
}

export default function Projects() {
  const t = useTranslations("Projects");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const videoRefs = useRef([]);

  const projects = [
    {
      translationKey: "YEYAR",
      technologies:
        "Next.js, TypeScript, Hono, Drizzle ORM, PostgreSQL, Stripe, Turborepo",
      videoSrc:
        "https://res.cloudinary.com/dnbsem7vr/video/upload/v1764027454/Screen_Recording_2025-11-24_at_5.29.27_p.m._crxuh5.mp4",
      color: "#8C8C8C",
      link: "https://yeyar.mx",
    },
    {
      translationKey: "YEYARMobile",
      technologies: "React Native, Expo, Stripe, Pusher, Native APIs",
      videoSrc:
        "https://res.cloudinary.com/dnbsem7vr/video/upload/v1788567922/Screen_Recording_2026-09-04_at_6.10.56_p.m._1_bngrab.mov",
      // Portrait phone recording rendered in a 330px column.
      videoWidth: 800,
      color: "#EFE8D3",
      appStoreLink: true,
      videoFit: "contain",
      customContainerStyle: { maxWidth: "330px", margin: "0 auto" },
    },
    {
      translationKey: "MiContax",
      technologies: "Next.js, Hono, Clerk, Drizzle ORM, PostgreSQL, Stripe",
      src: "micontax.jpg",
      color: "#1f4d3a",
      link: "https://www.cmsconsultores.mx",
    },
    {
      translationKey: "AIRAGSystems",
      technologies:
        "Next.js, Vercel AI SDK, OpenAI, Anthropic, pgvector, Supabase",
      videoSrc:
        "https://res.cloudinary.com/drjfzsw6m/video/upload/v1752083845/ew_nixk0e.mp4",
      color: "#000000",
    },
    {
      translationKey: "Dropper",
      technologies: "Flutter, Node.js, Puppeteer, CAPTCHA Solver, Google Cloud",
      videoSrc:
        "https://res.cloudinary.com/drjfzsw6m/video/upload/v1752085528/Screen_Recording_2025-07-09_at_12.18.00_p.m._1_.mp4_kqnph4.mp4",
      color: "#000000",
    },
    {
      translationKey: "ChromeExtension",
      technologies: "JavaScript, Chrome API, Custom UI Framework",
      videoSrc:
        "https://res.cloudinary.com/drjfzsw6m/video/upload/tm_1_cmv0l6.mp4",
      color: "#000000",
    },
    {
      translationKey: "PolymarketEngine",
      technologies: "Rust, WebSockets, AWS EC2, Go",
      // Private repo: generated poster, no public link.
      src: "polymarket-engine.png",
      color: "#0f1011",
    },
    {
      translationKey: "BlockchainSolutions",
      technologies: "Solidity, Ethereum, Web3.js",
      src: "blockchain.jpg",
      color: "#706D63",
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
              currentVideoRefs[index].play().catch(() => {});
            }
          } else {
            if (currentVideoRefs[index]) {
              currentVideoRefs[index].pause();
            }
          }
        });
      },
      { threshold: 0.2 },
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
      {/* Keeps the heading outline h1 -> h2 -> h3 without changing the design. */}
      <h2 className="sr-only">{t("sectionTitle")}</h2>
      <div className={styles.container}>
        {projects.map((project, index) => (
          <ProjectItem
            key={project.translationKey}
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
