import styles from "./style.module.scss";
import Image from "next/image";
import Rounded from "../../common/RoundedButton/RoundedButton";
import Magnetic from "../../common/Magnetic/Magnetic";
import { useRef, useEffect, useState } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import { BsGithub } from "react-icons/bs";
import { useTranslations } from "next-intl";

export default function Contact() {
  const t = useTranslations("Contact");
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const xRange = isMobile ? [0, 0] : [0, 100];
  const yRange = isMobile ? [-100, 0] : [-500, 0];
  const x = useTransform(scrollYProgress, [0, 1], xRange);
  const y = useTransform(scrollYProgress, [0, 1], yRange);
  const rotate = useTransform(scrollYProgress, [0, 1], [120, 90]);

  const handleEmailClick = () => {
    window.location.href =
      "mailto:guevaraeu1@gmail.com?subject=Portfolio Contact&body=Hi Eugenio,";
  };

  return (
    <motion.div style={{ y }} ref={container} className={styles.contact}>
      <div className={styles.body}>
        <div className={styles.title}>
          <span>
            <div className={styles.imageContainer}>
              <Image
                fill={true}
                alt="Eugenio Guevara portfolio contact section background"
                src={`/images/background.jpeg`}
              />
            </div>
            <h2>{t("letsWork")}</h2>
          </span>
          <h2>{t("together")}</h2>
          <motion.div style={{ x }} className={styles.buttonContainer}>
            <Rounded backgroundColor={"#000000"} className={styles.button}>
              <p>{t("getInTouch")}</p>
            </Rounded>
          </motion.div>
          <motion.svg
            style={{ rotate, scale: 2 }}
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
              fill="white"
            />
          </motion.svg>
        </div>
        <div className={styles.nav} id="contact">
          <Rounded onClick={handleEmailClick}>
            <p>guevaraeu1@gmail.com</p>
          </Rounded>
          <div className={styles.github}>
            <Rounded
              onClick={() =>
                window.open("https://github.com/Guevarnation", "_blank")
              }
            >
              <BsGithub className={styles.githubIcon} />
              <p>{t("github")}</p>
            </Rounded>
          </div>
        </div>
        <div className={styles.info}>
          <div>
            <span>
              <h3>{t("version")}</h3>
              <p>{t("edition")}</p>
            </span>
            <span>
              <h3>{t("version")}</h3>
              <p>11:49 PM GMT+2</p>
            </span>
            <span>
              <h3>{t("language")}</h3>
              <div className="flex flex-row gap-2">
                <p
                  onClick={() => {
                    window.location.href = "/en";
                  }}
                >
                  En
                </p>
                <p
                  onClick={() => {
                    window.location.href = "/es";
                  }}
                >
                  Es
                </p>
              </div>
            </span>
          </div>
          <div>
            <Magnetic>
              <p
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/eugenio-guevara-a8417b20b/",
                    "_blank"
                  )
                }
              >
                Linkedin
              </p>
            </Magnetic>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
