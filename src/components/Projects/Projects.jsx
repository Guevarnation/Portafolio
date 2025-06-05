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
      "A modern platform for exploring the  presale real estate market in Mexico, users can browse hotest projects in Mexico, invest, and track their investments in real-time. Users can see individual unit info as well as developer info to make an informed decision.",
    technologies: "Next.js, React, Tanstack, MySQL, Stripe, TailwindCSS",
    src: "YEYAR.png",
    videoSrc: "yeyar.mp4",
    color: "#8C8C8C",
    link: "https://yeyar.mx",
  },
  {
    title: "YEYAR Mobile App",
    description:
      "Developed a cross-platform mobile application allowing users to browse products, receive notifications, and track orders in real-time. Implemented native device features including camera integration and push notifications.",
    technologies: "React Native, Expo, Stripe, Pusher, Native APIs",
    src: "YEYAR-app.png",
    color: "#EFE8D3",
    link: "https://apps.apple.com/us/app/yeyar/id6737579256",
  },
  {
    title: "AI & RAG Systems",
    description:
      "Lead a team of 3 developers to build advanced AI Chatbot that connects to SEC api to retirve company like finacials from 10K, 10Q, 8K, etc. also had heavy comapny information on own db and also connects to api to know real time price and scrapes google for any news and allows users to ask questions about the company and get the information they need.",
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
      "Built a custom chrome extension that allows users to quickly grab adjacent ticket seats by only clicking on one seat. Extension allows for heavy customization and a license key is needed to use it. Works for all ticket websites.",
    technologies: "JavaScript, Chrome API, Custom UI Framework",
    src: "chrome-extension.png",
    videoSrc: "tm.mov",
    color: "#000000",
    link: "#",
  },
  {
    title: "Blockchain Solutions",
    description:
      "Started practice with blockchain and smart contracts, built a simple token and a simple dapp that allows users to buy and sell the token.",
    technologies: "Solidity, Ethereum, Web3.js",
    src: "blockchain.png",
    color: "#706D63",
    link: "#",
  },
];

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index, 10);
          if (entry.isIntersecting) {
            if (videoRefs.current[index]) {
              videoRefs.current[index].play().catch((e) => {
                console.log("Auto-play was prevented");
              });
            }
          } else {
            if (videoRefs.current[index]) {
              videoRefs.current[index].pause();
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.dataset.index = index;
        observer.observe(video);
      }
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, []);

  // Simplified animation variants
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
    <section className={styles.projects} id="work">
      <div className={styles.container}>
        {/* <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2> */}

        {projects.map((project, index) => {
          const imageOnLeft = index % 2 === 0;
          const { ref, inView } = useInView({
            triggerOnce: true,
            threshold: 0.1,
            rootMargin: "0px 0px 100px 0px",
          });

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
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() =>
                project.link && window.open(project.link, "_blank")
              }
            >
              <div
                className={styles.projectContent}
                style={{ flexDirection: imageOnLeft ? "row" : "row-reverse" }}
              >
                {/* Image Container */}
                <motion.div
                  className={styles.imageContainer}
                  variants={scaleIn}
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
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
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
                  <motion.h3
                    className={styles.projectTitle}
                    variants={fadeInUp}
                  >
                    {project.title}
                  </motion.h3>

                  <motion.p
                    className={styles.projectDescription}
                    variants={fadeInUp}
                  >
                    {project.description}
                  </motion.p>

                  <motion.div className={styles.techStack} variants={fadeInUp}>
                    <span className={styles.techLabel}>Technologies:</span>
                    <p>{project.technologies}</p>
                  </motion.div>

                  {project.link && (
                    <motion.div
                      className={styles.projectLink}
                      variants={fadeInUp}
                    >
                      <Rounded>
                        <p>View Project</p>
                      </Rounded>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
