// متغير عام ليستعمله app.js
window.imageUrl = "";

window.addEventListener("DOMContentLoaded", () => {

  const uploadBtn = document.getElementById("uploadBtn");
  if (!uploadBtn) {
    console.error("زر رفع الصورة غير موجود");
    return;
  }

  const widget = cloudinary.createUploadWidget({
    cloudName: "dzjy5tubx",
    uploadPreset: "souq-aldeir-prseset",
    multiple: false
  }, (error, result) => {
    if (!error && result && result.event === "success") {
      window.imageUrl = result.info.secure_url;
      alert("تم رفع الصورة بنجاح");
    }
  });

  uploadBtn.addEventListener("click", () => {
    widget.open();
  });

});