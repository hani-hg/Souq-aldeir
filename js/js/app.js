import { fetchAds } from "./ads.service.js";
import { renderAds, renderSkeleton } from "./ads.ui.js";

const adsGrid = document.getElementById("adsGrid");
let loading = false;

async function loadMoreAds() {
  if (loading) return;
  loading = true;

  const ads = await fetchAds();
  renderAds(ads, adsGrid);

  loading = false;
}

renderSkeleton(adsGrid);
loadMoreAds();

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    loadMoreAds();
  }
});