import {
  collection, query, orderBy, limit, startAfter, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";

let lastAd = null;
const PAGE_SIZE = 6;

export async function loadAds() {

  let q = query(
    collection(db, "ads"),
    orderBy("createdAt", "desc"),
    limit(PAGE_SIZE)
  );

  if (lastAd) {
    q = query(
      collection(db, "ads"),
      orderBy("createdAt", "desc"),
      startAfter(lastAd),
      limit(PAGE_SIZE)
    );
  }

  const snap = await getDocs(q);
  lastAd = snap.docs[snap.docs.length - 1];

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}