// Smooth reveal when scrolling to resume
const resumeSection = document.getElementById("resume");
const resumeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        resumeSection.style.opacity = 1;
        resumeSection.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.2 },
);

resumeSection.style.opacity = 0;
resumeSection.style.transform = "translateY(40px)";
resumeObserver.observe(resumeSection);
