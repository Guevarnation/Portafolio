// import React, { useState } from "react";
// import styles from "./style.module.scss";
// import { motion } from "framer-motion";
// import { usePathname } from "next/navigation";
// import { useTranslations } from "next-intl";
// import { menuSlide } from "../animation";
// import Link from "./Link/Link";
// import Curve from "./Curve/Curve";
// import Footer from "./Footer/Footer";

// export default function Nav() {
//   const t = useTranslations("Index");
//   const pathname = usePathname();
//   const [selectedIndicator, setSelectedIndicator] = useState(pathname);

//   const navItems = [
//     {
//       title: t("Home"),
//       href: "/",
//     },
//     {
//       title: t("Work"),
//       href: "/work",
//     },
//     {
//       title: t("About"),
//       href: "/about",
//     },
//     {
//       title: t("Contact"),
//       href: "/contact",
//     },
//   ];

//   return (
//     <motion.div
//       variants={menuSlide}
//       initial="initial"
//       animate="enter"
//       exit="exit"
//       className={styles.menu}
//     >
//       <div className={styles.body}>
//         <div
//           onMouseLeave={() => {
//             setSelectedIndicator(pathname);
//           }}
//           className={styles.nav}
//         >
//           <div className={styles.header}>
//             <p>Navigation</p>
//           </div>
//           {navItems.map((data, index) => {
//             return (
//               <Link
//                 key={index}
//                 data={{ ...data, index }}
//                 isActive={selectedIndicator == data.href}
//                 setSelectedIndicator={setSelectedIndicator}
//               ></Link>
//             );
//           })}
//         </div>
//         <Footer />
//       </div>
//       <Curve />
//     </motion.div>
//   );
// }
