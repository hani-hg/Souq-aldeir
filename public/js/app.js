const ads=[

{
title:"توكسان 2020",
price:"18,500$",

image:
"https://picsum.photos/600/400?1"
},

{
title:"شقة للبيع",

price:"25,000$",

image:
"https://picsum.photos/600/400?2"
},

{
title:"آيفون 15",

price:"850$",

image:
"https://picsum.photos/600/400?3"
}

];

const container=
document.getElementById(
"ads"
);

function loadAds(){

container.innerHTML="";

ads.forEach(ad=>{

container.innerHTML+=`

<div class="card">

<img src="${ad.image}">

<div class="content">

<h3>${ad.title}</h3>

<div class="price">

${ad.price}

</div>

</div>

</div>

`;

});

}

loadAds();

document
.querySelector(".publish")

.onclick=()=>{

document
.getElementById(
"modal"
)

.style.display=
"block";

};