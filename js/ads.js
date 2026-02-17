import {
  collection, query, orderBy, limit, startAfter, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js";

let lastDoc = null;
const PAGE_SIZE = 8;

export async function fetchAds() {
  let q = query(
    collection(db, "ads"),
    orderBy("isFeatured", "desc"),
    orderBy("createdAt", "desc"),
    limit(PAGE_SIZE)
  );

  if (lastDoc) q = query(q, startAfter(lastDoc));

  const snap = await getDocs(q);
  if (!snap.empty) lastDoc = snap.docs[snap.docs.length - 1];

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}