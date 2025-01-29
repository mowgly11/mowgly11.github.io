let emailElement = document.getElementById("email");
let copiedText = document.getElementById("copied-text");

function takeToSite(site) {
    window.open(site);
}

let cooldown = false;
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