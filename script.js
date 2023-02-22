const loading = document.querySelector(".loading");
const hamBtn = document.getElementById("hamburger");
const hiddenElements = document.querySelectorAll(".hidden");
const hiddenElements2 = document.querySelectorAll(".hidden2");
const body = document.body;

// animate when scrolling effect

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("showing");
        }
    })
});

hiddenElements.forEach(element => observer.observe(element));
hiddenElements2.forEach(element => observer.observe(element));

//hamburger menu effect

setTimeout(() => {
    loading.classList.add('hideLoading');
}, 2000);

hamBtn.addEventListener("click", () => {
    document.getElementById("navigation").classList.toggle("showNavigation");
    document.getElementById("hamburger").classList.toggle("animateBtn");
});

// eye hover effect

document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    const face = document.getElementById("face");
    const rekt = face.getBoundingClientRect();
    
    console.log({ rekt })

    const faceX = rekt.left + rekt.width / 2;
    const faceY = rekt.top + rekt.height / 2;
    
    const angle = calculateAngle(mouseX, mouseY, faceX, faceY);

    const eyes = document.querySelectorAll(".eye");

    eyes.forEach(eye => {
        eye.style.transform = `rotate(${90 + angle}deg)`
    });
    
    const cursor = document.querySelector(".mouse");

    cursor.style.top = `${mouseY}px`;
    cursor.style.left = `${mouseX}px`;
});

function calculateAngle(cx, cy, ex, ey) {
    const dy = ey - cy;
    const dx = ex - cx;
    const rad = Math.atan2(dy, dx);
    const deg = rad * 180 / Math.PI;
    return deg
}

// change page language

let language = localStorage.getItem("lang");
if(!language) {
    language = "en";
    localStorage.setItem("lang", language);
}

switchLang(language);

function switchLang(lang) {
    const textsEnglish = document.querySelectorAll(".en");
    const textsGerman = document.querySelectorAll(".de");
    const textsArabic = document.querySelectorAll(".ar");

    switch (lang) {
        case "ar":
            localStorage.setItem('lang', 'ar');
            textsEnglish.forEach(e => {
                e.style.display = 'none';
            });
            textsGerman.forEach(e => {
                e.style.display = 'none';
            });
            textsArabic.forEach(e => {
                e.style.display = 'block';
            });
            break;
        case "en":
            localStorage.setItem('lang', 'en');
            textsEnglish.forEach(e => {
                e.style.display = 'block';
            });
            textsGerman.forEach(e => {
                e.style.display = 'none';
            });
            textsArabic.forEach(e => {
                e.style.display = 'none';
            });
            break;
        case "de":
            localStorage.setItem('lang', 'de');
            textsEnglish.forEach(e => {
                e.style.display = 'none';
            });
            textsGerman.forEach(e => {
                e.style.display = 'block';
            });
            textsArabic.forEach(e => {
                e.style.display = 'none';
            });
            break;
        default:
            break;
    }
}