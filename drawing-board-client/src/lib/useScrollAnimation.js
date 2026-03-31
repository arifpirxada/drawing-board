import { useEffect } from "react";

/**
 * Attach IntersectionObserver to every `.animate-on-scroll` element.
 * When one enters the viewport it receives the `in-view` class,
 * triggering the CSS fade-up transition.
 */
const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

export default useScrollAnimation;
