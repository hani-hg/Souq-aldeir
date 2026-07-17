/* ============================================================
   slider.js  –  v2
   Featured-ads hero slider (OpenSooq-style large banner).
   ============================================================ */

function buildSlider(ads) {
  featuredAds = ads;
  const wrap = document.getElementById('sliderWrap');
  wrap.style.display = 'block';

  if (!ads.length) {
    document.getElementById('sliderInner').innerHTML = `
      <div class="slide promo-cta-slide" onclick="openFeaturedModal()" style="cursor:pointer">
        <div class="slide-text-side">
          <span class="slide-badge">⭐ إعلانات مميزة</span>
          <div class="slide-title">أبرز إعلانك أمام آلاف المشترين</div>
          <div class="slide-price">ابدأ بـ 1$ فقط</div>
          <div class="slide-cta-label">اضغط لطلب التمييز الآن ←</div>
        </div>
        <div class="slide-icon-side"><i class="fa fa-star"></i></div>
      </div>`;
    document.getElementById('sliderDots').innerHTML = '';
    return;
  }

  document.getElementById('sliderInner').innerHTML = ads.map(ad => {
    const imgSrc = (ad.images && ad.images[0]) || ad.imageUrl || '';
    return `
    <div class="slide" onclick="openDetail('${ad.id}')">
      <div class="slide-text-side">
        <span class="slide-badge">⭐ إعلان مميز</span>
        <div class="slide-title">${ad.title || ''}</div>
        <div class="slide-price">${formatPrice(ad)}</div>
        <div class="slide-loc"><i class="fa fa-map-marker-alt"></i> ${ad.area || 'دير الزور'}</div>
        <div class="slide-cta-label">عرض التفاصيل ←</div>
      </div>
      <div class="slide-img-side">
        ${imgSrc
          ? `<img class="slide-hero-img" src="${imgSrc}" loading="lazy" alt="${ad.title || ''}">`
          : `<div class="slide-no-img"><i class="fa fa-image"></i></div>`}
      </div>
    </div>`;
  }).join('');

  document.getElementById('sliderDots').innerHTML = ads.map((_, i) =>
    `<div class="sdot ${i === 0 ? 'active' : ''}" onclick="goSlide(${i})"></div>`).join('');

  slideIdx = 0;
  startSlider();
}

function goSlide(i) {
  slideIdx = i;
  document.getElementById('sliderInner').style.transform = `translateX(${i * 100}%)`;
  document.querySelectorAll('.sdot').forEach((d, j) =>
    (d.className = 'sdot' + (j === i ? ' active' : '')));
}

function slideMove(dir) {
  const len = featuredAds.length || 1;
  goSlide((slideIdx + dir + len) % len);
}

function startSlider() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => slideMove(1), 5000);
}
