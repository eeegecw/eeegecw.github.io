const FORMSPREE_ENDPOINT = "https://formspree.io/f/myekapvb";
const form = document.getElementById("applicationForm");
const status = document.getElementById("formStatus");
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Gentle reveal-on-scroll. Content remains visible if motion APIs are unavailable.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  document.body.classList.add("js-motion");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
  document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 45, 270)}ms`;
    observer.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

// Submit in the background and show success only when Formspree confirms receipt.
if (form) {
  form.action = FORMSPREE_ENDPOINT;
  form.method = "POST";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector("button[type='submit']");
    const buttonText = button?.querySelector(".button-text");
    const originalText = buttonText?.textContent || "SEND APPLICATION";
    if (status) {
      status.textContent = "Sending your application…";
      status.style.color = "#666";
    }
    if (button) button.disabled = true;
    if (buttonText) buttonText.textContent = "SENDING…";
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      let result = {};
      try { result = await response.json(); } catch (_) {}
      if (!response.ok || result.errors) {
        throw new Error((result.errors || []).map((e) => e.message).join(", ") || "Submission failed.");
      }
      form.reset();
      if (status) {
        status.textContent = "Thank you! Your application has been submitted successfully.";
        status.style.color = "#39751c";
        status.setAttribute("role", "status");
      }
      if (buttonText) buttonText.textContent = "APPLICATION SENT";
    } catch (error) {
      console.error("AEEE application submission error:", error);
      if (status) {
        status.textContent = "We couldn't submit your application. Please check your connection and try again.";
        status.style.color = "#b42318";
        status.setAttribute("role", "alert");
      }
      if (buttonText) buttonText.textContent = originalText;
    } finally {
      if (button) button.disabled = false;
    }
  });
}
