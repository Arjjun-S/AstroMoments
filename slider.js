const slides = document.querySelector('.slides');
const navDots = document.querySelectorAll('.slider-nav li');

navDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const slideIndex = dot.getAttribute('data-slide');
    slides.style.animation = 'none'; // Pause animation
    slides.style.transform = `translateX(-${slideIndex * 100}%)`;

    setTimeout(() => {
      slides.style.animation = ''; // Resume animation
    }, 100);

    navDots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
  });
});
