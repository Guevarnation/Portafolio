import styles from "./page.module.scss";
import IntroOverlay from "@/components/IntroOverlay/IntroOverlay";
import Landing from "@/components/Landing/Landing";
import Description from "@/components/Description/Description";
import Projects from "@/components/Projects/Projects";
import TechStack from "@/components/TechStack/TechStack";
import GitHub from "@/components/GitHub/GitHub";
import Contact from "@/components/Contact/Contact";

export default function Home() {
  return (
    <main className={styles.main}>
      <IntroOverlay />
      <Landing />
      <Description />
      <Projects />
      <TechStack />
      <GitHub />
      <Contact />
    </main>
  );
}
