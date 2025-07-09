import styles from "./style.module.scss";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function GitHub() {
  // Container ref for scroll animations
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 85%", "end start"], // Changed from ["start end", "end start"] to trigger earlier
  });

  // Create scroll-based animations - optimized for earlier visibility
  const y1 = useTransform(scrollYProgress, [0, 1], [20, -30]); // Start with slight offset for smooth entry
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.8], [0, 1, 0.9]); // Show much earlier (15% instead of 50%)
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]); // Add subtle scale animation
  const blur = useTransform(scrollYProgress, [0, 0.1], [4, 0]); // Add subtle blur effect for smooth entrance
  const height = useTransform(scrollYProgress, [0, 0.9], [30, 0]);

  // GitHub username and state
  const username = "Guevarnation";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchGitHubInfo = async () => {
      try {
        setLoading(true);

        // Just fetch basic user data for the name
        const userResponse = await fetch(
          `https://api.github.com/users/${username}`
        );
        if (!userResponse.ok)
          throw new Error("Failed to fetch GitHub user data");
        const userData = await userResponse.json();
        setName(userData.name || userData.login);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubInfo();
  }, [username]);

  return (
    <div ref={container} className={styles.slidingImages}>
      <motion.div
        style={{
          y: y1,
          opacity,
          scale,
          filter: `blur(${blur}px)`, // Apply blur effect for smooth entrance
        }}
        className={styles.githubContainer}
      >
        {/* <h2 className={styles.title}>GitHub Contributions</h2> */}

        {loading && (
          <div className={styles.loading}>Loading contribution data...</div>
        )}
        {error && <div className={styles.error}>Error: {error}</div>}

        <div className={styles.contributionSection}>
          <div className={styles.profileInfo}>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.username}
            >
              <FaGithub />
              <span>{name || username}</span>
            </a>
          </div>

          <motion.div className={styles.contributionGraph} style={{ y: y2 }}>
            <div className={styles.graphContainer}>
              <iframe
                src={`https://ghchart.rshah.org/${username}`}
                frameBorder="0"
                scrolling="no"
                width="100%"
                height="88"
                title="GitHub Contribution Chart"
              />
            </div>
            <div className={styles.legendContainer}>
              <span className={styles.legendText}>Less</span>
              <div className={styles.legendGradient}></div>
              <span className={styles.legendText}>More</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div style={{ height }} className={styles.circleContainer}>
        <div className={styles.circle}></div>
      </motion.div>
    </div>
  );
}
