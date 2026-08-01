class Carousel {
  constructor(element, interval = 5000) {
    this.carousel = element;
    this.slides = this.carousel.querySelectorAll(".carousel-slide");
    this.dotsContainer = this.carousel.querySelector(".carousel-dots");
    this.prevBtn = this.carousel.querySelector(".carousel-arrow-prev");
    this.nextBtn = this.carousel.querySelector(".carousel-arrow-next");

    this.currentIndex = 0;
    this.interval = interval;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.createDots();
    this.showSlide(this.currentIndex);
    this.bindControls();
    this.startAutoSlide();
  }

  createDots() {
    this.slides.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.classList.add("carousel-dot");
      dot.setAttribute("role", "button");
      dot.setAttribute("tabindex", "0");
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

      dot.addEventListener("click", () => this.showSlide(index));
      dot.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.showSlide(index);
        }
      });

      this.dotsContainer.appendChild(dot);
    });

    this.dots = this.carousel.querySelectorAll(".carousel-dot");
  }

  bindControls() {
    this.prevBtn?.addEventListener("click", () => this.showSlide(this.currentIndex - 1));
    this.nextBtn?.addEventListener("click", () => this.showSlide(this.currentIndex + 1));

    this.carousel.addEventListener("mouseenter", () => this.pause());
    this.carousel.addEventListener("mouseleave", () => this.startAutoSlide());
    this.carousel.addEventListener("focusin", () => this.pause());
    this.carousel.addEventListener("focusout", () => this.startAutoSlide());
  }

  showSlide(index) {
    if (index >= this.slides.length) this.currentIndex = 0;
    else if (index < 0) this.currentIndex = this.slides.length - 1;
    else this.currentIndex = index;

    this.slides.forEach(s => s.classList.remove("active"));
    this.dots.forEach(d => {
      d.classList.remove("active");
      d.removeAttribute("aria-current");
    });

    this.slides[this.currentIndex].classList.add("active");
    this.dots[this.currentIndex].classList.add("active");
    this.dots[this.currentIndex].setAttribute("aria-current", "true");
  }

  startAutoSlide() {
    this.pause();
    if (this.reducedMotion) return;
    this.timer = setInterval(() => this.showSlide(this.currentIndex + 1), this.interval);
  }

  pause() {
    clearInterval(this.timer);
  }
}