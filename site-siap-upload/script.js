AOS.init({
    duration: 1200,
    once: false
});

// Efek parallax modern
window.addEventListener("scroll",()=>{

let scroll = window.pageYOffset;

document.querySelectorAll(".card").forEach(card=>{

card.style.transform =
`translateY(${scroll * 0.01}px)`;

});

});