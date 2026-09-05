"use client";

import styles from "./style.module.scss";
import Image from "next/image";
import Rounded from "../../common/RoundedButton/RoundedButton";
import Magnetic from "../../common/Magnetic/Magnetic";
import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from "react";
import { useScroll, m, useTransform } from "framer-motion";
import { BsGithub } from "react-icons/bs";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ContactForm from "./ContactForm";
import { routing } from "@/i18n/routing";

const EMAIL = "guevaraeu1@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=Portfolio%20Contact&body=Hi%20Eugenio,`;
const GITHUB_URL = "https://github.com/Guevarnation";
const LINKEDIN_URL = "https://www.linkedin.com/in/eugenio-guevara-a8417b20b/";
const TIME_ZONE = "America/Monterrey";
const CLOCK_PLACEHOLDER = "--:--";

// Ticks every 30s; React re-reads the snapshot on each tick.
const subscribeToClock = (onChange) => {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
};

/** Live wall-clock in Monterrey. Renders a placeholder on the server and
 *  during hydration (via getServerSnapshot) so markup never mismatches. */
function useLocalTime(locale) {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
        timeZone: TIME_ZONE,
        timeZoneName: "short",
      }),
    [locale]
  );
  const getSnapshot = useCallback(
    () => formatter.format(new Date()),
    [formatter]
  );
  return useSyncExternalStore(
    subscribeToClock,
    getSnapshot,
    () => CLOCK_PLACEHOLDER
  );
}

export default function Contact() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const localTime = useLocalTime(locale);
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
  // Parallax lift. .body has 200px (desktop) / 100px (mobile) of top padding,
  // so a lift no larger than that keeps the title from sliding up behind the
  // GitHub repo cards; only the dark padding overlaps them.
  const yRange = isMobile ? [-80, 0] : [-200, 0];
  const x = useTransform(scrollYProgress, [0, 1], xRange);
  const y = useTransform(scrollYProgress, [0, 1], yRange);
  const rotate = useTransform(scrollYProgress, [0, 1], [120, 90]);

  return (
    <m.div style={{ y }} ref={container} className={styles.contact}>
      <div className={styles.body}>
        <div className={styles.title}>
          <span>
            <div className={styles.imageContainer}>
              <Image
                fill={true}
                sizes="(max-width: 768px) 60vw, 100px"
                alt="Eugenio Guevara portfolio contact section background"
                src={`/images/background.jpeg`}
              />
            </div>
            <h2>{t("letsWork")}</h2>
          </span>
          <h2>{t("together")}</h2>
          <m.div style={{ x }} className={styles.buttonContainer}>
            <Rounded
              as="a"
              href={MAILTO}
              backgroundColor={"#000000"}
              className={styles.button}
            >
              <p>{t("getInTouch")}</p>
            </Rounded>
          </m.div>
          <m.svg
            style={{ rotate, scale: 2 }}
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
              fill="white"
            />
          </m.svg>
        </div>
        <div className={styles.nav} id="contact">
          <Rounded as="a" href={MAILTO}>
            <p>{EMAIL}</p>
          </Rounded>
          <div className={styles.github}>
            <Rounded
              as="a"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsGithub className={styles.githubIcon} aria-hidden="true" />
              <p>{t("github")}</p>
            </Rounded>
          </div>
        </div>
        <ContactForm />
        <div className={styles.info}>
          <div>
            {/* div, not span: h3/nav are flow content (invalid inside span). */}
            <div className={styles.infoGroup}>
              <h3>{t("version")}</h3>
              <p>{t("edition")}</p>
            </div>
            <div className={styles.infoGroup}>
              <h3>{t("localTime")}</h3>
              <p>
                <time suppressHydrationWarning>{localTime}</time>
              </p>
            </div>
            <div className={styles.infoGroup}>
              <h3>{t("language")}</h3>
              <nav
                className="flex flex-row gap-2"
                aria-label={t("language")}
              >
                {/* href="/" + locale for the OTHER locale: next-intl prefixes
                    it per the routing mode and syncs the locale cookie. The
                    active locale gets no `locale` prop, otherwise next-intl
                    forces "/en", which the proxy redirects to "/". */}
                {routing.locales.map((code) => (
                  <Link
                    key={code}
                    href="/"
                    locale={code === locale ? undefined : code}
                    hrefLang={code}
                    lang={code}
                    aria-label={t(`languages.${code}`)}
                    aria-current={code === locale ? "page" : undefined}
                    className={styles.langButton}
                  >
                    {t(`languageCodes.${code}`)}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div>
            <Magnetic>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("linkedinAria")}
              >
                Linkedin
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </m.div>
  );
}
