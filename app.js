let ads=
JSON.parse(
localStorage.getItem(
"ads"
)
)||[];

render();

function openModal(){

modal.style.display=
"block";

}

function closeModal(){

modal.style.display=
"none";

}

function saveAd(){

const file=
image.files[0];

if(!file)
return;

const reader=
new FileReader();

reader.onload=()=>{

ads.unshift({

id:
Date.now(),

title:
title.value,

price:
price.value,

phone:
phone.value,

image:
reader.result

});

localStorage.setItem(
"ads",
JSON.stringify(
ads
)
);

closeModal();

render();

};

reader.readAsDataURL(
file
);

}

function render(){

const q=
search.value
?.toLowerCase()
||"";

ads.innerHTML="";

window.ads
.filter(
a=>
a.title
.toLowerCase()
.includes(q)
)

.forEach(a=>{

ads.innerHTML+=`

<div class=card>

<img
src="${a.image}"
>

<div class=info>

<h2>

${a.title}

</h2>

<div class=price>

${a.price}$

</div>

<div>

${a.phone}

</div>

<a href=
details.html?id=${a.id}
>

فتح

</a>

</div>

</div>

`;

});

}

search.oninput=
render;