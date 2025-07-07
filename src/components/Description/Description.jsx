import styles from "./style.module.scss";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import { slideUp, opacity } from "./animation";
import Rounded from "../../common/RoundedButton/RoundedButton";
import { useTranslations } from "next-intl";

export default function Description() {
  const t = useTranslations("Description");
  const phrase = t("mainPhrase");
  const descriptionRef = useRef(null);
  const isInView = useInView(descriptionRef);

  return (
    <div ref={descriptionRef} id="description" className={styles.description}>
      <div className={styles.body}>
        <p>
          {phrase.split(" ").map((word, index) => {
            return (
              <span key={index} className={styles.mask}>
                <motion.span
                  variants={slideUp}
                  custom={index}
                  animate={isInView ? "open" : "closed"}
                  key={index}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </p>
        <motion.p variants={opacity} animate={isInView ? "open" : "closed"}>
          {t("secondaryText")}
        </motion.p>
        <div data-scroll data-scroll-speed={0.1}>
          <Rounded className={styles.button}>
            <p>{t("aboutMeButton")}</p>
          </Rounded>
        </div>
      </div>
    </div>
  );
}
