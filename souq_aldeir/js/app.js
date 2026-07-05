// ======================================
// سوق دير الزور
// app.js
// ======================================

// بيانات تجريبية
const ads = [

{
id:1,
title:"هيونداي توسان 2020",
price:"18,500 $",
category:"سيارات",
city:"دير الزور",
image:"https://picsum.photos/500/350?1"
},

{
id:2,
title:"منزل للبيع",
price:"45,000 $",
category:"عقارات",
city:"الميادين",
image:"https://picsum.photos/500/350?2"
},

{
id:3,
title:"iPhone 15 Pro",
price:"900 $",
category:"موبايلات",
city:"البوكمال",
image:"https://picsum.photos/500/350?3"
},

{
id:4,
title:"مكتب خشب",
price:"120 $",
category:"أثاث",
city:"دير الزور",
image:"https://picsum.photos/500/350?4"
},

{
id:5,
title:"فرصة عمل محاسب",
price:"راتب ممتاز",
category:"وظائف",
city:"دير الزور",
image:"https://picsum.photos/500/350?5"
}

];

// =======================

const latestAds = document.getElementById("latestAds");
const featuredAds = document.getElementById("featuredAds");

// =======================

function createCard(ad){

return `

<div class="card">

<img src="${ad.image}" alt="${ad.title}">

<div class="cardBody">

<h3>${ad.title}</h3>

<p>${ad.category}</p>

<p>${ad.city}</p>

<div class="price">

${ad.price}

</div>

</div>

</div>

`;

}

// =======================

function loadAds(){

latestAds.innerHTML="";

featuredAds.innerHTML="";

ads.forEach(ad=>{

latestAds.innerHTML+=createCard(ad);

});

ads.slice(0,3).forEach(ad=>{

featuredAds.innerHTML+=createCard(ad);

});

}

loadAds();

// =======================
// البحث
// =======================

const searchInput=document.querySelector(".search input");

searchInput.addEventListener("keyup",()=>{

const value=searchInput.value.toLowerCase();

const result=ads.filter(ad=>{

return(

ad.title.toLowerCase().includes(value)

||

ad.category.toLowerCase().includes(value)

||

ad.city.toLowerCase().includes(value)

);

});

latestAds.innerHTML="";

result.forEach(ad=>{

latestAds.innerHTML+=createCard(ad);

});

});

// =======================
// زر إضافة إعلان
// =======================

const floating=document.querySelector(".floating");

floating.addEventListener("click",()=>{

alert("قريباً سيتم فتح صفحة إضافة إعلان");

});

// =======================
// نهاية الملف
// =======================
