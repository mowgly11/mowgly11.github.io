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

    function preloadImages(imageArray) {
        imageArray.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    const runnerImgs = [
        "./imgs/runner-frame3.webp",
        "./imgs/runner-frame2.webp",
        "./imgs/runner-frame4.webp",
        "./imgs/runner-frame1.webp",
    ];

    const bookImgs = [
        "./imgs/book-half.webp",
        "./imgs/book-open.webp",
        "./imgs/book-closed.webp"
    ];

    preloadImages(runnerImgs);
    preloadImages(bookImgs);

    const runnerImg = document.getElementById("runner-animation");
    let runnerInterval;

    runnerImg.onmouseenter = function () {
        let i = 0;
        runnerInterval = setInterval(() => {
            if (i === runnerImgs.length) i = 0;
            runnerImg.setAttribute("src", runnerImgs[i]);
            i++;
        }, 300);
    };

    runnerImg.onmouseleave = function () {
        clearInterval(runnerInterval);
        runnerImg.setAttribute("src", runnerImgs[0]); 
    };

    const bookImg = document.getElementById("book-animation");

    bookImg.onmouseenter = async function () {
        bookImg.setAttribute("src", "./imgs/book-half.webp");
        await new Promise(res => setTimeout(res, 300));
        bookImg.setAttribute("src", "./imgs/book-open.webp");
    };

    bookImg.onmouseleave = async function () {
        bookImg.setAttribute("src", "./imgs/book-half.webp");
        await new Promise(res => setTimeout(res, 300));
        bookImg.setAttribute("src", "./imgs/book-closed.webp");
    };

    document.getElementById("age").textContent = new Date().getFullYear() - 2005;
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