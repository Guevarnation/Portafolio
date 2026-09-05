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
      {/* One dark canvas for the last three sections: TechStack and GitHub
          are transparent, so Contact (which slides up under GitHub) shows
          through the repo-card gaps with no white ever visible. */}
      <div className={styles.dark}>
        <TechStack />
        <GitHub />
        <Contact />
      </div>
    </main>
  );
}
