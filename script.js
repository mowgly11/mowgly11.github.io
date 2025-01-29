document.addEventListener("DOMContentLoaded", async() => {
    const data = await fetch("./config.json").then(res => res.json());
    let root = document.querySelector(':root');
    let availableText = document.getElementById("status");

    if(data.available) {
        root.style.setProperty("--availability", 'green');
        availableText.textContent = "Available";
    } else {
        root.style.setProperty("--availability", 'red');
        availableText.textContent = "On Vacation";
    }
});

function takeToSite(site) {
    window.open(site);
}

let cooldown = false;
let emailElement = document.getElementById("email");
let copiedText = document.getElementById("copied-text");
function copyEmail() {
    navigator.clipboard.writeText("oussamabouzalim4@gmail.com");
    if (cooldown) return;
    cooldown = true;
    copiedText.style.opacity = 1;

    setTimeout(() => {
        copiedText.style.opacity = 0;
        cooldown = false;
    }, 2000);
}