
const FORMSPREE_ENDPOINT = "https://formspree.io/f/myekapvb";

const form = document.getElementById("applicationForm");
const status = document.getElementById("formStatus");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Scroll animations
document.body.classList.add("js-motion");

const revealTargets = [
  [".hero-topline", "left"],
  [".hero-copy", "left"],
  [".hero-visual", "right"],
  [".hero-bottomline", "up"],
  [".form-intro", "left"],
  [".application-form", "right"],
  [".footer-brand", "up"],
  [".footer-message", "up"],
  [".back-top", "up"],
  [".footer-bottom", "up"]
];

revealTargets.forEach(([selector, direction]) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.dataset.reveal = direction;
  });
});

// Stagger form field animations
const formFields = document.querySelectorAll(
  ".application-form > label, " +
  ".application-form > input, " +
  ".application-form > textarea, " +
  ".application-form > .two-columns, " +
  ".application-form > .consent, " +
  ".application-form > .submit-button"
);

formFields.forEach((element, index) => {
  element.dataset.reveal = "up";
  element.style.setProperty(
    "--reveal-delay",
    `${Math.min(index * 55, 330)}ms`
  );
});

// Reveal elements as the user scrolls
if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -35px 0px"
  });

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    observer.observe(element);
  });
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    element.classList.add("is-visible");
  });
}

// Submit to Formspree without leaving the website
if (form) {
  form.action = FORMSPREE_ENDPOINT;
  form.method = "POST";

  const submitButton = form.querySelector(
    'button[type="submit"], input[type="submit"], .submit-button'
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (status) {
      status.textContent = "Sending your application...";
      status.style.color = "";
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.opacity = "0.7";
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.errors) {
        throw new Error(
          result.errors?.map((error) => error.message).join(", ") ||
          "Your application could not be submitted."
        );
      }

      form.reset();

      if (status) {
        status.textContent =
          "Thank you! Your application has been submitted successfully.";
        status.style.color = "#65a30d";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
      }

    } catch (error) {
      console.error("Application submission failed:", error);

      if (status) {
        status.textContent =
          "We couldn't submit your application. Please check your connection and try again.";
        status.style.color = "#dc2626";
        status.setAttribute("role", "alert");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.style.opacity = "";
      }
    }
  });
}
