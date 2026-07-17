/* ============================================================
   components/slider.js
   Featured-ads slider at the top of the home feed.
   ============================================================ */

function buildSlider(ads) {
  featuredAds = ads;
  const wrap = document.getElementById('sliderWrap');
  if (!ads.length) {
    wrap.style.display = 'block';
    document.getElementById('sliderInner').innerHTML = `
      <div class="slide" onclick="openFeaturedModal()" style="cursor:pointer">
        <div class="slide-no-img"><i class="fa fa-star"></i></div>
        <div class="slide-info">
          <div class="slide-badge">⭐ إعلانات مميزة</div>
          <div class="slide-title">إعلانك هنا أمام آلاف المشترين</div>
          <div class="slide-price">ابدأ بـ 1$ فقط</div>
          <div class="slide-loc">اضغط لطلب التمييز الآن</div>
        </div>
      </div>`;
    document.getElementById('sliderDots').innerHTML = '';
    return;
  }
  wrap.style.display = 'block';
  document.getElementById('sliderInner').innerHTML = ads.map(ad => `
    <div class="slide" onclick="openDetail('${ad.id}')">
      ${ad.imageUrl ? `<img class="slide-img" src="${ad.imageUrl}" loading="lazy">` : `<div class="slide-no-img"><i class="fa fa-image"></i></div>`}
      <div class="slide-info">
        <div class="slide-badge">⭐ إعلان مميز</div>
        <div class="slide-title">${ad.title || ''}</div>
        <div class="slide-price">${formatPrice(ad)}</div>
        <div class="slide-loc"><i class="fa fa-map-marker-alt"></i> ${ad.area || 'دير الزور'}</div>
      </div>
    </div>`).join('');
  document.getElementById('sliderDots').innerHTML = ads.map((_, i) => `<div class="sdot ${i === 0 ? 'active' : ''}" onclick="goSlide(${i})"></div>`).join('');
  slideIdx = 0;
  startSlider();
}

function goSlide(i) {
  slideIdx = i;
  document.getElementById('sliderInner').style.transform = `translateX(${i * 100}%)`;
  document.querySelectorAll('.sdot').forEach((d, j) => (d.className = 'sdot' + (j === i ? ' active' : '')));
}

function slideMove(dir) {
  let i = (slideIdx + dir + featuredAds.length) % featuredAds.length;
  goSlide(i);
}

function startSlider() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => slideMove(1), 5000);
}


