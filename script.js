const loading = document.querySelector(".loading-screen");
const hamBtn = document.getElementById("hamburger");
const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add("showing");
        }
    })
});

hiddenElements.forEach(element => observer.observe(element));

function openSite(link) {
    window.open(`https://${link}`);
}

hamBtn.addEventListener("click", () => {
    document.getElementById("bg").classList.toggle("showHam");
    document.getElementById("navigation-links").classList.toggle("showHamNav");
    document.getElementById("hamburger").classList.toggle("fixHam");
});