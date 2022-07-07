class Slider {
    constructor() {
        this.wrapper = document.getElementById('slider');
        this.slidesContainer = document.getElementById('slides');
        this.prev = document.getElementById('prev');
        this.next = document.getElementById('next');
        this.slides = this.slidesContainer.getElementsByClassName('slide');

        this.posInitial = 0;

        this.slidesLength = this.slides.length;
        this.slideSize = this.slidesContainer.getElementsByClassName('slide')[0].offsetWidth;
        this.firstSlide = this.slides[0];
        this.lastSlide = this.slides[this.slidesLength - 1];
        this.cloneFirst = this.firstSlide.cloneNode(true);
        this.cloneLast = this.lastSlide.cloneNode(true);
        this.index = 0;
        this.allowShift = true;

        this.listen();
    }

    listen() {
        // Clone first and last slide
        this.slidesContainer.appendChild(this.cloneFirst);
        this.slidesContainer.insertBefore(this.cloneLast, this.firstSlide);
        this.wrapper.classList.add('loaded');

        // Click events
        this.prev.addEventListener('click', () => {
            this.shiftSlide(-1);
        });
        this.next.addEventListener('click', () => {
            this.shiftSlide(1);
        });

        // Transition events
        this.slidesContainer.addEventListener('transitionend', () => {
            this.checkIndex();
        });
    }

    shiftSlide(dir, action) {
        this.slidesContainer.classList.add('shifting');

        if (this.allowShift) {
            if (!action) {
                this.posInitial = this.slidesContainer.offsetLeft;
            }

            if (dir === 1) {
                this.slidesContainer.style.left = (this.posInitial - this.slideSize) + "px";
                this.index++;
            } else if (dir === -1) {
                this.slidesContainer.style.left = (this.posInitial + this.slideSize) + "px";
                this.index--;
            }
        }


        this.allowShift = false;
    }

    checkIndex() {
        this.slidesContainer.classList.remove('shifting');

        if (this.index === -1) {
            this.slidesContainer.style.left = -(this.slidesLength * this.slideSize) + "px";
            this.index = this.slidesLength - 1;
        }

        if (this.index === this.slidesLength) {
            this.slidesContainer.style.left = -(1 * this.slideSize) + "px";
            this.index = 0;
        }

        this.allowShift = true;
    }
}

new Slider();
