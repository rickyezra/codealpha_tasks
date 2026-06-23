const counters = document.querySelectorAll('.counter');
const revealItems = document.querySelectorAll('.reveal');

const animateCounter = (counter) => {
    const target = Number(counter.dataset.target);
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        counter.textContent = Math.ceil(progress * target);

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    };

    requestAnimationFrame(tick);
};

const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add('is-visible');

        if (entry.target.classList.contains('counter')) {
            animateCounter(entry.target);
            observerInstance.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

revealItems.forEach((item) => observer.observe(item));
counters.forEach((counter) => observer.observe(counter));

const form = document.querySelector('.contact-form');

if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        form.reset();
        const button = form.querySelector('button');
        button.textContent = 'Message sent';
        setTimeout(() => {
            button.textContent = 'Send message';
        }, 1800);
    });
}