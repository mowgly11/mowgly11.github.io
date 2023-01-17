const loading = document.querySelector(".loading-screen");
const hamBtn = document.getElementById("hamburger");

function openSite(link) {
    window.open(`https://${link}`);
}

window.addEventListener("load", () => {
    setTimeout(() => {
        loading.classList.add("hide");
    }, 2000);
});

hamBtn.addEventListener("click", () => {
    document.getElementById("bg").classList.toggle("showHam");
    document.getElementById("navigation-links").classList.toggle("showHamNav");
    document.getElementById("hamburger").classList.toggle("fixHam");
});