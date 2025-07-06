document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetch("./config.json").then(res => res.json());
    let root = document.querySelector(':root');
    let availableText = document.getElementById("status");

    if (data.available) {
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

document.getElementById("age").textContent = new Date().getFullYear() - 2005;

let runnerImg = document.getElementById("runner-animation");
let bookImg = document.getElementById("book-animation");

let runnerImgs = [
    "./imgs/runner-frame3.png",
    "./imgs/runner-frame2.png",
    "./imgs/runner-frame4.png",
    "./imgs/runner-frame1.png",
];

let bookImgs = [
    "./imgs/book-half.png",
    "./imgs/book-open.png",
];

let runnerInterval;

runnerImg.onmouseenter = function () {
    let i = 0;
    runnerInterval = setInterval(() => {
        if (i === runnerImgs.length) i = 0;
        runnerImg.setAttribute("src", runnerImgs[i]);
        i++;
    }, 300);
}

runnerImg.onmouseleave = function() {
    clearInterval(runnerInterval);
}

bookImg.onmouseenter = async function () {
    bookImg.setAttribute("src", "./imgs/book-half.png");
    await new Promise(res => setTimeout(res, 300));
    bookImg.setAttribute("src", "./imgs/book-open.png");
}

bookImg.onmouseleave = async function() {
    bookImg.setAttribute("src", "./imgs/book-half.png");
    await new Promise(res => setTimeout(res, 300));
    bookImg.setAttribute("src", "./imgs/book-closed.png");
}