// storage.js
window.uploadImage = function(file, path = 'ads/') {
  if (!file) return Promise.resolve(null);
  const ref = storage.ref(path + Date.now() + '_' + file.name);
  return ref.put(file).then(snap => snap.ref.getDownloadURL());
};
