export function adCard(ad) {
  return `
    <div class="ad">
      <img loading="lazy" src="${ad.imageUrl}">
      <h3>${ad.title}</h3>
      <p>${ad.price} ل.س</p>
    </div>
  `;
}