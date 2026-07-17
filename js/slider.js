/* ============================================================
   slider.js  –  v3
   Featured-ads hero slider — 16:9 landscape, full-bleed image,
   info bar pinned to bottom (OpenSooq-style).
   ============================================================ */

function buildSlider(ads) {
  featuredAds = ads;
  const wrap = document.getElementById('sliderWrap');
  wrap.style.display = 'block';

  if (!ads.length) {
    document.getElementById('sliderInner').innerHTML = `
      <div class="slide slide-promo" onclick="openFeaturedModal()" style="cursor:pointer">
        <div class="slide-promo-content">
          <div class="slide-promo-icon"><i class="fa fa-star"></i></div>
          <div class="slide-promo-title">أبرز إعلانك أمام آلاف المشترين</div>
          <div class="slide-promo-sub">ابدأ بـ 1$ فقط · اضغط لطلب التمييز</div>
        </div>
      </div>`;
    document.getElementById('sliderDots').innerHTML = '';
    return;
  }

  document.getElementById('sliderInner').innerHTML = ads.map((ad, i) => {
    const imgSrc = (ad.images && ad.images[0]) || ad.imageUrl || '';
    const loc    = ad.area || 'دير الزور';
    const price  = formatPrice(ad);
    return `
    <div class="slide" onclick="openDetail('${ad.id}')" style="cursor:pointer">
      ${imgSrc
        ? `<img class="slide-bg" src="${imgSrc}" loading="${i===0?'eager':'lazy'}" alt="${ad.title||''}">`
        : `<div class="slide-bg slide-no-photo"><i class="fa fa-image"></i></div>`}
      <div class="slide-gradient"></div>
      <div class="slide-info">
        <span class="slide-info-badge">⭐ إعلان مميز</span>
        <div class="slide-info-title">${ad.title || ''}</div>
        <div class="slide-info-row">
          <span class="slide-info-price">${price}</span>
          <span class="slide-info-loc"><i class="fa fa-map-marker-alt"></i> ${loc}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('sliderDots').innerHTML = ads.map((_, i) =>
    `<div class="sdot ${i===0?'active':''}" onclick="event.stopPropagation();goSlide(${i})"></div>`
  ).join('');

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
