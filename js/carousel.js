

class Carousel {

    constructor(element, interval = 5000) {
        this.carousel = element;
        this.slides = this.carousel.querySelectorAll(".carousel-slide");
        this.dotsContainer = this.carousel.querySelector(".carousel-dots");

        this.currentIndex = 0;
        this.interval = interval;

        this.createDots();
        this.showSlide(this.currentIndex);
        this.startAutoSlide();
    }

    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.classList.add("carousel-dot");

            dot.addEventListener("click", () => {
                this.showSlide(index);
            });

            this.dotsContainer.appendChild(dot);
        });

        this.dots = this.carousel.querySelectorAll(".carousel-dot");
    }

    showSlide(index) {
        if (index >= this.slides.length) this.currentIndex = 0;
        else if (index < 0) this.currentIndex = this.slides.length - 1;
        else this.currentIndex = index;

        this.slides.forEach(s => s.classList.remove("active"));
        this.dots.forEach(d => d.classList.remove("active"));

        this.slides[this.currentIndex].classList.add("active");
        this.dots[this.currentIndex].classList.add("active");
    }

    startAutoSlide() {
        setInterval(() => {
            this.showSlide(this.currentIndex + 1);
        }, this.interval);
    }
}