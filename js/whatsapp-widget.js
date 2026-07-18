document.addEventListener("DOMContentLoaded", () => {
  const bubble = document.getElementById("waBubble");
  const closeBtn = document.getElementById("waBubbleClose");
  if (!bubble || !closeBtn) return;

  if (sessionStorage.getItem("waBubbleClosed") === "1") {
    bubble.classList.add("wa-hidden");
  }

  closeBtn.addEventListener("click", () => {
    bubble.classList.add("wa-hidden");
    sessionStorage.setItem("waBubbleClosed", "1");
  });
});