// slider.js
window.curSlide = 0;
window.sliderImages = [];

window.slideTo = function(idx) {
  const track = document.getElementById('sliderTrack');
  if (!track || !window.sliderImages.length) return;
  const total = window.sliderImages.length;
  if (idx < 0) idx = total - 1;
  if (idx >= total) idx = 0;
  window.curSlide = idx;
  track.style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
};

window.loadSlider = function(images) {
  window.sliderImages = images;
  const track = document.getElementById('sliderTrack');
  const dots = document.getElementById('sliderDots');
  if (!track) return;
  track.innerHTML = images.map(src => `<img src="${src}" alt="slider">`).join('');
  dots.innerHTML = images.map((_, i) => `<span class="dot ${i===0?'active':''}" onclick="window.slideTo(${i})"></span>`).join('');
  window.curSlide = 0;
  track.style.transform = 'translateX(0)';
};
