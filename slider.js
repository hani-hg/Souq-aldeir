// src/components/slider.js
let slideIdx = 0;
let slideTimer = null;
let featuredAds = [];

export function buildSlider(ads) {
  featuredAds = ads || [];
  const wrap = document.getElementById('sliderWrap');
  const inner = document.getElementById('sliderInner');
  const dots = document.getElementById('sliderDots');
  if (!wrap || !inner || !dots) return;
  if (!featuredAds.length) {
    wrap.style.display = 'block';
    inner.innerHTML = `
      <div class="slide" onclick="window.openFeaturedModal()" style="cursor:pointer">
        <div class="slide-no-img"><i class="fa fa-star"></i></div>
        <div class="slide-info">
          <div class="slide-badge">⭐ إعلانات مميزة</div>
          <div class="slide-title">إعلانك هنا أمام آلاف المشترين</div>
          <div class="slide-price">ابدأ بـ 1$ فقط</div>
          <div class="slide-loc">اضغط لطلب التمييز الآن</div>
        </div>
      </div>`;
    dots.innerHTML = '';
    return;
  }
  wrap.style.display = 'block';
  inner.innerHTML = featuredAds.map(ad => `
    <div class="slide" onclick="window.openDetail('${ad.id}')">
      ${ad.imageUrl ? `<img class="slide-img" src="${ad.imageUrl}" loading="lazy">` : `<div class="slide-no-img"><i class="fa fa-image"></i></div>`}
      <div class="slide-info">
        <div class="slide-badge">⭐ إعلان مميز</div>
        <div class="slide-title">${ad.title || ''}</div>
        <div class="slide-price">${ad.price ? Number(ad.price).toLocaleString() + ' $' : 'مجاني'}</div>
        <div class="slide-loc"><i class="fa fa-map-marker-alt"></i> ${ad.area || 'دير الزور'}</div>
      </div>
    </div>`).join('');
  dots.innerHTML = featuredAds.map((_, i) => `<div class="sdot ${i === 0 ? 'active' : ''}" onclick="window.goSlide(${i})"></div>`).join('');
  slideIdx = 0;
  startSlider();
}

export function goSlide(i) {
  slideIdx = i;
  const inner = document.getElementById('sliderInner');
  if (inner) inner.style.transform = `translateX(${i * 100}%)`;
  document.querySelectorAll('.sdot').forEach((d, j) => d.className = 'sdot' + (j === i ? ' active' : ''));
}

export function slideMove(dir) {
  if (!featuredAds.length) return;
  let i = (slideIdx + dir + featuredAds.length) % featuredAds.length;
  goSlide(i);
}

export function startSlider() {
  if (slideTimer) clearInterval(slideTimer);
  if (featuredAds.length) {
    slideTimer = setInterval(() => slideMove(1), 5000);
  }
}

export function stopSlider() {
  if (slideTimer) clearInterval(slideTimer);
}

// جعل الدوال عامة
window.goSlide = goSlide;
window.slideMove = slideMove;