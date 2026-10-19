// AEEE ExCom website interactions and scroll animations.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/myekapvb";
const form = document.getElementById("applicationForm");
const status = document.getElementById("formStatus");
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll-story: background is visible immediately; each layer pops in as the user scrolls.
const story = document.querySelector(".scroll-story");
const storyItems = [...document.querySelectorAll(".story-reveal")];
const progressBar = document.querySelector(".story-progress span");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (story && !reduceMotion) {
  const updateStory = () => {
    const rect = story.getBoundingClientRect();
    const travel = Math.max(1, story.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / travel));
    storyItems.forEach((item) => {
      const trigger = Number(item.dataset.story || 0);
      item.classList.toggle("story-on", progress >= trigger);
    });
    if (progressBar) progressBar.style.width = `${progress * 100}%`;
  };
  window.addEventListener("scroll", updateStory, { passive: true });
  window.addEventListener("resize", updateStory);
  updateStory();
} else {
  storyItems.forEach((item) => item.classList.add("story-on"));
  if (progressBar) progressBar.style.width = "100%";
}

// Reveal the application section and footer as they enter view.
const lowerTargets = [".form-intro", ".application-form", ".footer-brand", ".footer-message", ".back-top", ".footer-bottom"];
lowerTargets.forEach((selector) => document.querySelectorAll(selector).forEach((el) => el.dataset.lowerReveal = "true"));
if ("IntersectionObserver" in window && !reduceMotion) {
  const lowerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        lowerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  document.querySelectorAll("[data-lower-reveal]").forEach((el) => lowerObserver.observe(el));
} else {
  document.querySelectorAll("[data-lower-reveal]").forEach((el) => el.classList.add("is-visible"));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.className = "form-status";
  const button = form.querySelector('button[type="submit"]');
  const original = button.innerHTML;
  button.disabled = true;
  button.textContent = "SENDING...";
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });
    if (response.ok) {
      form.reset();
      status.classList.add("success");
      status.textContent = "Application submitted. Thank you for stepping forward!";
    } else {
      status.classList.add("error");
      status.textContent = "Submission failed. Please check your details and try again.";
    }
  } catch (error) {
    status.classList.add("error");
    status.textContent = "Unable to submit right now. Check your connection and try again.";
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
});
