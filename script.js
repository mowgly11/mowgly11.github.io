const loading = document.querySelector(".loading-screen");
const hamBtn = document.getElementById("hamburger");
const hiddenElements = document.querySelectorAll(".hidden");
const hiddenElements2 = document.querySelectorAll(".hidden2");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add("showing");
        }
    })
});

hiddenElements.forEach(element => observer.observe(element));
hiddenElements2.forEach(element => observer.observe(element));

function openSite(link) {
    window.open(`https://${link}`);
}

hamBtn.addEventListener("click", () => {
    document.getElementById("navigation").classList.toggle("showNavigation");
    document.getElementById("hamburger").classList.toggle("animateBtn");
});

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
    })
});

function calculateAngle(cx, cy, ex, ey) {
    const dy = ey - cy;
    const dx = ex - cx;
    const rad = Math.atan2(dy, dx);
    const deg = rad * 180 / Math.PI;
    return deg
}