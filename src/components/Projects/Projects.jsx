"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    videoSrc: "yeyar.mov",
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
    videoSrc: "ew.mov",
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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.1, 0.25, 0.3, 1],
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.1, 0.25, 0.3, 1],
    },
  }),
};

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
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
          // We're explicitly determining whether each project should have image on left or right
          const imageOnLeft = index % 2 === 0;

          return (
            <motion.div
              key={index}
              className={styles.projectItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.1,
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
                  custom={1}
                  variants={scaleIn}
                >
                  <div
                    className={styles.imageWrapper}
                    style={{
                      transform:
                        hoveredIndex === index ? "scale(1.03)" : "scale(1)",
                      transition:
                        "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s ease",
                    }}
                  >
                    {project.videoSrc ? (
                      <video
                        width="100%"
                        height="auto"
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                          objectFit: "cover",
                          borderRadius: "12px",
                          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
                          transition: "all 0.5s ease",
                          transform:
                            hoveredIndex === index ? "scale(1.01)" : "scale(1)",
                        }}
                      >
                        <source
                          src={`/videos/${project.videoSrc}`}
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
                        />
                      </video>
                    ) : (
                      <Image
                        src={`/images/${project.src}`}
                        width={600}
                        height={400}
                        alt={project.title}
                        objectFit="cover"
                        style={{
                          borderRadius: "12px",
                          transition: "all 0.5s ease",
                          transform:
                            hoveredIndex === index ? "scale(1.01)" : "scale(1)",
                        }}
                      />
                    )}
                  </div>
                </motion.div>

                {/* Project Details */}
                <div className={styles.projectDetails}>
                  <motion.h3
                    className={styles.projectTitle}
                    custom={2}
                    variants={fadeInUp}
                  >
                    {project.title}
                  </motion.h3>

                  <motion.p
                    className={styles.projectDescription}
                    custom={3}
                    variants={fadeInUp}
                  >
                    {project.description}
                  </motion.p>

                  <motion.div
                    className={styles.techStack}
                    custom={4}
                    variants={fadeInUp}
                  >
                    <span className={styles.techLabel}>Technologies:</span>
                    <p>{project.technologies}</p>
                  </motion.div>

                  {project.link && (
                    <motion.div
                      className={styles.projectLink}
                      custom={5}
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
