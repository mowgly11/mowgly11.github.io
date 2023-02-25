const loading = document.querySelector(".loading");
const hamBtn = document.getElementById("hamburger");
const hiddenElements = document.querySelectorAll(".hidden");
const hiddenElements2 = document.querySelectorAll(".hidden2");
const langsList = document.querySelector(".select");
const themes = document.querySelector(".themes");
const root = document.querySelector(':root');

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

    const faceX = rekt.left + rekt.width / 2;
    const faceY = rekt.top + rekt.height / 2;

    const angle = calculateAngle(mouseX, mouseY, faceX, faceY);

    const eyes = document.querySelectorAll(".eye");

    eyes.forEach(eye => {
        eye.style.transform = `rotate(${90 + angle}deg)`
    });
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
let theme = localStorage.getItem("theme");

if (!language) {
    language = "en";
    localStorage.setItem("lang", language);
}

if (!theme) {
    theme = "theme1";
    localStorage.setItem("theme", theme);
}

switchLang(language);
switchTheme(theme);

function showLangs() {
    if (themes.classList.contains("showThemes")) themes.classList.remove("showThemes");
    langsList.classList.toggle("showLangsIcons");
}

function showThemes() {
    if (langsList.classList.contains("showLangsIcons")) langsList.classList.remove("showLangsIcons");
    themes.classList.toggle("showThemes");
}

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

function switchTheme(theme) {
    const face = document.getElementById("face");
    const eyes = document.querySelectorAll(".eye");
    const body = document.querySelector("body");

    body.style.transition = '0.5s';

    switch (theme) {
        case "theme1":
            localStorage.setItem('theme', 'theme1');
            let rootVariablesTheme1 = {
                "--clr-1": "#0E050F",
                "--clr-2": "#9388A2",
                "--clr-3": "#341948",
                "--clr-4": "#170B3B",
                "--clr-5": "rgb(182, 0, 182)",
                "--clr-6": "rgb(218, 170, 255)"
            }

            body.style.background = "url(./imgs/bg-theme1.png) no-repeat";

            body.style.backgroundSize = 'cover';
            body.style.backgroundAttachment = 'fixed';

            face.setAttribute("src", "./imgs/faceTheme1.png");
            eyes.forEach(e => e.setAttribute("src", "./imgs/eyeTheme1.png"));

            setVariables(rootVariablesTheme1);
            break;
        case "theme2":
            localStorage.setItem('theme', 'theme2');

            let rootVariablesTheme2 = {
                "--clr-1": "#000000",
                "--clr-2": "#9388A2",
                "--clr-3": "#282A3A",
                "--clr-4": "#282A3A",
                "--clr-5": "red",
                "--clr-6": "#C69749"
            }

            body.style.background = "url(./imgs/bg-theme2.png) no-repeat";

            body.style.backgroundSize = 'cover';
            body.style.backgroundAttachment = 'fixed';

            face.setAttribute("src", "./imgs/faceTheme2.png");
            eyes.forEach(e => e.setAttribute("src", "./imgs/eyeTheme2.png"));

            setVariables(rootVariablesTheme2);
            break;
        case "theme3":
            localStorage.setItem('theme', 'theme3');

            let rootVariablesTheme3 = {
                "--clr-1": "#0E050F",
                "--clr-2": "white",
                "--clr-3": "#3A98B9",
                "--clr-4": "#3A98B9",
                "--clr-5": "#3A98B9",
                "--clr-6": "#FFF1DC"
            }

            body.style.background = "url(./imgs/bg-theme3.png) no-repeat";

            body.style.backgroundSize = 'cover';
            body.style.backgroundAttachment = 'fixed';

            face.setAttribute("src", "./imgs/faceTheme3.png");
            eyes.forEach(e => e.setAttribute("src", "./imgs/eyeTheme3.png"));

            setVariables(rootVariablesTheme3);
            break;
        default:
            break;
    }
}

function setVariables(vars) {
    return Object.entries(vars).forEach(v => root.style.setProperty(v[0], v[1]));
}