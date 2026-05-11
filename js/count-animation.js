(function () {
    // Select all count elements
    const countElements = document.querySelectorAll('.count');

    // Function to animate a single element
    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;
        let current = 0;
        const increment = Math.ceil(target / 50); // smooth increment
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target;
                clearInterval(timer);
            } else {
                el.innerText = current;
            }
        }, 20);
    }

    // Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                animateCount(el);
                obs.unobserve(el); // animate only once
            }
        });
    }, { threshold: 0.3 });

    countElements.forEach(el => observer.observe(el));
})();