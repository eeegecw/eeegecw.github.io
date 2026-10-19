// Static GitHub Pages form. Connect Formspree before accepting real applications.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORMSPREE_ID";
const form = document.getElementById("applicationForm");
const status = document.getElementById("formStatus");
document.getElementById("year").textContent = new Date().getFullYear();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.className = "form-status";
  if (FORMSPREE_ENDPOINT.includes("YOUR_FORMSPREE_ID")) {
    status.classList.add("error");
    status.textContent = "Applications are not connected yet. The site owner must add a Formspree endpoint in script.js before this form can receive responses.";
    return;
  }
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
