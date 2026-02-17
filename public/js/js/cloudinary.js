let imageUrl = "";

const widget = cloudinary.createUploadWidget({
  cloudName: "dzjy5tubx",
  uploadPreset: "souq-aldeir-prseset",
  multiple: false
}, (error, result) => {
  if (!error && result && result.event === "success") {
    imageUrl = result.info.secure_url;
    alert("تم رفع الصورة");
  }
});

document.getElementById("uploadBtn").onclick = () => {
  widget.open();
};