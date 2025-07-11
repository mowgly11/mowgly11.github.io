document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetch("./config.json").then(res => res.json());
    let root = document.querySelector(':root');
    let availableText = document.getElementById("status");
    let face = document.getElementById("face");
    let playBtn = document.getElementById("play-btn");
    let dialogue = document.getElementById("dialogue");
    let dialogueText = document.getElementById("dialogue-text");
    let audio = document.getElementById("tts");

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

    const ttsLines = [
        "Osama: Hi! I'm Oussama Bouzalim, a 20-year-old software developer passionate about",
        "tech and problem-solving. I specialize in front-end development with HTML,",
        "CSS, and JavaScript , and build back-end systems using Node.js,",
        "Bun, and Python I'm also exploring Rust for high-performance applications.",
        "Outside of coding, I enjoy playing cards, reading, and working out.",
        "I speak Arabic, French, and English, and love collaborating with people from different",
        " backgrounds. Feel free to check out my work or reach out—let’s build something great!",
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

    face.addEventListener("click", () => {
        playBtn.style.display = "block";
        document.getElementById("assistance").style.display = "none";
        document.body.addEventListener("mousemove", (e) => {
            let x = e.pageX;
            let y = e.pageY;
            face.style.position = "absolute";
            face.style.width = "50px";
            face.style.height = "60px";
            face.animate({
                left: `${x + 50}px`,
                top: `${y + 30}px`
            }, { duration: 500, fill: "forwards" });

            if (x > window.innerWidth - 100) {
                face.animate({
                    left: `${x - 50}px`,
                    top: `${y + 30}px`
                }, { duration: 150, fill: "forwards" });
            }
        });

        document.body.addEventListener('mouseleave', () => {
            face.animate({
                left: `50%`,
                top: `25%`
            }, { duration: 700, fill: "forwards" });
            face.removeAttribute("style");
            face.style.position = "absolute";
        });
    })


    let mouthInterval = null;
    let currentLineIndex = 1;
    let dialogueInterval = null;
    playBtn.onclick = function () {
        if (playBtn.textContent.trim() === "Play" || playBtn.textContent.trim() === "Replay") {
            currentLineIndex = 1;
            playBtn.textContent = "Shutup";
            playBtn.style.backgroundColor = "rgb(255, 57, 57)";
            face.style.scale = 1.7;

            dialogue.style.zIndex = 99;
            dialogue.style.opacity = 1;

            let mouthOpen = false;
            mouthInterval = setInterval(() => {
                if (mouthOpen) {
                    face.setAttribute('src', 'imgs/face-talking.webp');
                } else {
                    face.setAttribute('src', 'imgs/face.webp');
                }
                mouthOpen = !mouthOpen;
            }, 300);

            dialogueText.textContent = ttsLines[0];
            startTalking();

            audio.play();
        } else {
            playBtn.textContent = "Play";
            playBtn.style.backgroundColor = "rgb(40, 235, 40)";
            face.style.scale = 1;

            dialogue.style.zIndex = -1;
            dialogue.style.opacity = 0;

            audio.pause();
            audio.currentTime = 0;
            clearInterval(mouthInterval);
            clearInterval(dialogueInterval);
            face.setAttribute('src', 'imgs/face.webp');
        }
    }
    function startTalking() {
        dialogueInterval = setInterval(() => {
            if (currentLineIndex === ttsLines.length - 1) {
                clearInterval(dialogueInterval);
                setTimeout(() => {
                    playBtn.textContent = "Replay";
                    playBtn.style.backgroundColor = "rgb(255, 204, 37)";
                    face.style.scale = 1;
                    if(mouthInterval) clearInterval(mouthInterval);
                    face.setAttribute('src', 'imgs/face.webp');
                    dialogue.style.zIndex = -1;
                    dialogue.style.opacity = 0;
                }, 5000);
            };
            dialogueText.textContent = "Osama: " + ttsLines[currentLineIndex];
            currentLineIndex++;
        }, 5000);
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
