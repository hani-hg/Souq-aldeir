/* ============================================================
   SLIDER COMPONENT
   سلايدر الإعلانات المميزة (يدور تلقائياً كل 5 ثوانٍ)
============================================================ */

let curSlide = 0;
let slideAds = [];
let slideTimer = null;

function buildSlider(ads) {
  slideAds = ads;
  const track = document.getElementById('sliderTrack');
  const dots = document.getElementById('sliderDots');
  if (!track) return;

  if (!ads.length) {
    track.innerHTML = `
      <div class="slide" onclick="openFeatured()">
        <div class="slide-noimg">⭐</div>
        <div class="slide-info">
          <div class="slide-badge">إعلانات مميزة</div>
          <div class="slide-title">إعلانك هنا أمام آلاف المشترين</div>
          <div class="slide-price">ابدأ من 1$ فقط</div>
          <div class="slide-loc">اضغط لمعرفة التفاصيل</div>
        </div>
      </div>`;
    if (dots) dots.innerHTML = '';
    return;
  }

  track.innerHTML = ads.map(ad => `
    <div class="slide" onclick="openDetail('${ad.id}')">
      ${ad.imageUrl
        ? `<img class="slide-img" src="${ad.imageUrl}" loading="lazy">`
        : `<div class="slide-noimg"><i class="fa fa-image"></i></div>`}
      <div class="slide-info">
        <div class="slide-badge">⭐ مميز</div>
        <div class="slide-title">${ad.title || ''}</div>
        <div class="slide-price">${formatPrice(ad.price)}</div>
        <div class="slide-loc"><i class="fa fa-map-marker-alt"></i> ${ad.area || 'دير الزور'}</div>
      </div>
    </div>`).join('');

  if (dots) {
    dots.innerHTML = ads.map((_, i) =>
      `<span class="sdot ${i === 0 ? 'on' : ''}" onclick="slideTo(${i})"></span>`).join('');
  }

  slideTo(0);
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => slideTo((curSlide + 1) % slideAds.length), 5000);
}

function slideTo(i) {
  if (!slideAds.length) return;
  curSlide = (i + slideAds.length) % slideAds.length;
  const track = document.getElementById('sliderTrack');
  if (track) track.style.transform = `translateX(${curSlide * 100}%)`;
  document.querySelectorAll('.sdot').forEach((d, j) => d.className = 'sdot' + (j === curSlide ? ' on' : ''));
}
