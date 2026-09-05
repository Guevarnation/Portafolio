"use client";

import { useState, useRef, useEffect } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";
import Image from "next/image";
import Rounded from "../../common/RoundedButton/RoundedButton";

// Cloudinary delivery transforms: best format/quality for the client, capped
// width. Posters are the first frame (so_0) of the same asset; f_auto lets
// Cloudinary pick AVIF/WebP for the poster too (verified: every poster URL
// still returns 200 with it).
const VIDEO_TRANSFORM = "f_auto,q_auto";
const POSTER_TRANSFORM = "so_0,q_auto,f_auto";
// The poster only shows until the video (auto-played once in view) has its
// first frame, and the slot is at most 700 CSS px wide, so 800 px is plenty:
// it halves poster bytes versus w_1200 (measured 60 KB -> 32 KB webp).
const POSTER_MAX_WIDTH = 800;

function cloudinaryVideo(url, width) {
  return url.replace(
    "/video/upload/",
    `/video/upload/${VIDEO_TRANSFORM},w_${width}/`,
  );
}

function cloudinaryPoster(url, width) {
  const w = Math.min(width, POSTER_MAX_WIDTH);
  return url
    .replace("/video/upload/", `/video/upload/${POSTER_TRANSFORM},w_${w}/`)
    .replace(/\.(mp4|mov)$/, ".jpg");
}

// The media column is `flex: 1.3` of a 1300px container capped at 700px.
const MEDIA_SIZES = "(max-width: 768px) calc(100vw - 40px), 700px";

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

  // Every media element declares its intrinsic size (width/height attributes
  // + an explicit aspect-ratio), so the box is laid out at its final height
  // before the poster or video metadata arrives: no layout shift.
  const { width: mediaWidth, height: mediaHeight } = project.media;
  const aspectRatio = `${mediaWidth} / ${mediaHeight}`;
  // Portrait recordings (phone captures) sit in a narrow centred column.
  const isPortrait = mediaHeight > mediaWidth;
  const mediaStyle = {
    aspectRatio,
    objectFit: isPortrait ? "contain" : "cover",
    borderRadius: "12px",
    willChange: "transform",
  };

  // Cards with a link: the whole media box is one real anchor (no nested
  // interactive elements; the title link and the CTA are separate anchors).
  const MediaWrapper = project.link ? "a" : "div";
  const mediaWrapperProps = project.link
    ? {
        href: project.link,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": t("openSite", { name: title }),
      }
    : {};

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
          style={isPortrait ? { maxWidth: "330px", margin: "0 auto" } : {}}
        >
          <MediaWrapper
            className={styles.imageWrapper}
            style={{
              transform:
                hoveredIndex === index && !prefersReducedMotion
                  ? "scale(1.02)"
                  : "scale(1)",
              transition: "transform 0.3s ease",
            }}
            {...mediaWrapperProps}
          >
            {project.videoSrc ? (
              <video
                ref={videoRef}
                src={cloudinaryVideo(project.videoSrc, mediaWidth)}
                poster={cloudinaryPoster(project.videoSrc, mediaWidth)}
                width={mediaWidth}
                height={mediaHeight}
                autoPlay={false}
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={title}
                style={mediaStyle}
              />
            ) : (
              <Image
                src={`/images/${project.src}`}
                width={mediaWidth}
                height={mediaHeight}
                sizes={MEDIA_SIZES}
                alt={title}
                style={mediaStyle}
              />
            )}
          </MediaWrapper>
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

  // `media` is the delivered asset's intrinsic size (videos: the Cloudinary
  // rendition at that width, measured from the encoded stream; images: the
  // file in /public/images). It drives width/height + aspect-ratio, so keep
  // it in sync when swapping an asset.
  const projects = [
    {
      translationKey: "YEYAR",
      technologies:
        "Next.js, TypeScript, Hono, Drizzle ORM, PostgreSQL, Stripe, Turborepo",
      videoSrc:
        "https://res.cloudinary.com/dnbsem7vr/video/upload/v1788567922/Screen_Recording_2026-09-04_at_6.10.56_p.m._1_bngrab.mov",
      // Measured on the delivered f_auto,q_auto,w_1200 rendition (Cloudinary
      // rounds video heights to even numbers, so measure the video, not the
      // poster).
      media: { width: 1200, height: 752 },
      color: "#8C8C8C",
      link: "https://yeyar.mx",
    },
    {
      translationKey: "YEYARMobile",
      technologies: "React Native, Expo, Stripe, Pusher, Native APIs",
      videoSrc:
        "https://res.cloudinary.com/dnbsem7vr/video/upload/v1764027231/ScreenRecording_11-24-2025_17-30-58_1_t0aqgx.mp4",
      // Portrait phone recording delivered at w_800 (measured 800x1730 on the
      // rendition); height > width switches on the narrow centred column.
      media: { width: 800, height: 1730 },
      color: "#EFE8D3",
      appStoreLink: true,
    },
    {
      translationKey: "MiContax",
      technologies: "Next.js, Hono, Clerk, Drizzle ORM, PostgreSQL, Stripe",
      src: "micontax.jpg",
      media: { width: 1400, height: 900 },
      color: "#1f4d3a",
      link: "https://www.micontax.mx",
    },
    {
      translationKey: "InsertBid",
      technologies: "React, Express, Bootstrap, SEO, Core Web Vitals",
      src: "insertbid.jpg",
      media: { width: 1400, height: 900 },
      color: "#f5b800",
      link: "https://www.insertbid.com",
    },
    {
      translationKey: "AIRAGSystems",
      technologies:
        "Next.js, Vercel AI SDK, OpenAI, Anthropic, pgvector, Supabase",
      videoSrc:
        "https://res.cloudinary.com/drjfzsw6m/video/upload/v1752083845/ew_nixk0e.mp4",
      media: { width: 1200, height: 630 },
      color: "#000000",
    },
    {
      translationKey: "Dropper",
      technologies: "Flutter, Node.js, Puppeteer, CAPTCHA Solver, Google Cloud",
      videoSrc:
        "https://res.cloudinary.com/drjfzsw6m/video/upload/v1752085528/Screen_Recording_2025-07-09_at_12.18.00_p.m._1_.mp4_kqnph4.mp4",
      media: { width: 1200, height: 716 },
      color: "#000000",
    },
    {
      translationKey: "ChromeExtension",
      technologies: "JavaScript, Chrome API, Custom UI Framework",
      videoSrc:
        "https://res.cloudinary.com/drjfzsw6m/video/upload/tm_1_cmv0l6.mp4",
      media: { width: 1200, height: 778 },
      color: "#000000",
    },
    {
      translationKey: "PolymarketEngine",
      technologies: "Rust, WebSockets, AWS EC2, Go",
      // Private repo: generated poster, no public link.
      src: "polymarket-engine.png",
      media: { width: 1200, height: 800 },
      color: "#0f1011",
    },
    {
      translationKey: "BlockchainSolutions",
      technologies: "Solidity, Ethereum, Web3.js",
      src: "blockchain.jpg",
      media: { width: 1600, height: 876 },
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
