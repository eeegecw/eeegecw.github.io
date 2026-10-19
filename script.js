// AEEE ExCom website interactions and scroll animations.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/myekapvb";
const form = document.getElementById("applicationForm");
const status = document.getElementById("formStatus");
document.getElementById("year").textContent = new Date().getFullYear();

// Mark content for reveal-on-scroll. Content remains visible if JS or the observer is unavailable.
document.body.classList.add("js-motion");
const revealTargets = [
  [".hero-topline", "left"], [".hero-copy", "left"], [".hero-visual", "right"],
  [".hero-bottomline", "up"], [".form-intro", "left"], [".application-form", "right"],
  [".footer-brand", "up"], [".footer-message", "up"], [".back-top", "up"], [".footer-bottom", "up"]
];
revealTargets.forEach(([selector, direction]) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.dataset.reveal = direction;
  });
});
// Stagger key form fields so they appear in a gentle sequence.
const formFields = document.querySelectorAll(".application-form > label, .application-form > input, .application-form > textarea, .application-form > .two-columns, .application-form > .consent, .application-form > .submit-button");
formFields.forEach((element, index) => {
  element.dataset.reveal = "up";
  element.style.setProperty("--reveal-delay", `${Math.min(index * 55, 330)}ms`);
});
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
}

// Use a normal HTML POST to Formspree. This avoids fetch/CORS failures on some browsers/networks.
if (form) {
  form.action = FORMSPREE_ENDPOINT;
  form.method = "POST";
  form.removeAttribute("target");
}
