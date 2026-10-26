const DROPGRAM_ENDPOINT =
  "https://dropgram.anokhagecw.workers.dev/f/fk_xafV6BHiEnZKU38RZBAQXA";

const form = document.getElementById("applicationForm");
const status = document.getElementById("formStatus");
const year = document.getElementById("year");

// COPYRIGHT YEAR
if (year) {
  year.textContent = new Date().getFullYear();
}

// REVEAL ON SCROLL
// Content remains visible if reduced motion is enabled or
// IntersectionObserver is unavailable.
if (
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  "IntersectionObserver" in window
) {
  document.body.classList.add("js-motion");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -24px 0px"
    }
  );

  document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay =
      `${Math.min(index * 45, 270)}ms`;

    observer.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("is-visible");
  });
}

// DROPGRAM FORM SUBMISSION
if (form) {
  // Ensure the correct provider is used.
  form.action = DROPGRAM_ENDPOINT;
  form.method = "POST";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Validate required fields.
    if (!form.reportValidity()) {
      return;
    }

    const button = form.querySelector("button[type='submit']");
    const buttonText = button?.querySelector(".button-text");
    const originalText =
      buttonText?.textContent || "SEND APPLICATION";

    // Prevent duplicate submissions.
    if (button?.disabled) {
      return;
    }

    if (button) button.disabled = true;
    if (buttonText) buttonText.textContent = "SENDING APPLICATION...";

    if (status) {
      status.textContent = "";
      status.style.color = "#666";
      status.setAttribute("role", "status");
    }

    try {
      const response = await fetch(DROPGRAM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      // Some form providers may return a non-JSON response.
      let result = {};

      try {
        result = await response.json();
      } catch (_) {
        // A successful HTTP response without JSON is still accepted.
      }

      if (!response.ok || result.errors?.length) {
        const errorMessage = result.errors
          ?.map((error) => error.message)
          .filter(Boolean)
          .join(", ");

        throw new Error(
          errorMessage || `Submission failed (${response.status}).`
        );
      }

      // SUCCESS
      form.reset();
      window.location.href = "thankyou.html";

      if (status) {
        status.textContent =
          "Thank you! Your application has been submitted successfully.";
        status.style.color = "#39751c";
        status.setAttribute("role", "status");
      }

      if (buttonText) {
        buttonText.textContent = "APPLICATION SENT";
      }

    } catch (error) {
      console.error("AEEE application submission error:", error);

      if (status) {
        status.textContent =
          "We couldn't submit your application. Please check your connection and try again.";
        status.style.color = "#b42318";
        status.setAttribute("role", "alert");
      }

      if (buttonText) {
        buttonText.textContent = originalText;
      }

    } finally {
      if (button) {
        button.disabled = false;
      }

      // Keep the success label visible until the user edits the form.
      if (buttonText && status?.getAttribute("role") === "status" &&
          status.textContent.includes("submitted successfully")) {
        buttonText.textContent = "APPLICATION SENT";
      }
    }
  });
}
