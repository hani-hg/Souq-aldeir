export function renderSkeleton(container, count = 6) {
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    container.innerHTML += `
      <div class="ad-card">
        <div class="skeleton" style="height:180px"></div>
        <div class="content">
          <div class="skeleton" style="height:14px;width:80%"></div>
          <div class="skeleton" style="height:14px;width:50%;margin-top:8px"></div>
        </div>
      </div>
    `;
  }
}

export function renderAds(ads, container) {
  ads.forEach(ad => {
    container.innerHTML += `
      <article class="ad-card" onclick="showAdDetail('${ad.id}')">
        <img loading="lazy" src="${ad.imageUrl}" alt="${ad.title}">
        <div class="content">
          <h3>${ad.title}</h3>
          <div class="price">${ad.price} ل.س</div>
          <small>${ad.city} • ${ad.category}</small>
        </div>
      </article>
    `;
  });
}