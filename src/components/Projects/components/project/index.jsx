"use client";

import styles from "./style.module.scss";

export default function index({ index, title, manageModal, onClick }) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={(e) => {
        manageModal(true, index, e.clientX, e.clientY);
      }}
      onMouseLeave={(e) => {
        manageModal(false, index, e.clientX, e.clientY);
      }}
      className={styles.project}
    >
      <h2>{title}</h2>
      <p>Design & Development</p>
    </div>
  );
}
