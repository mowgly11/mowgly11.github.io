document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetch("./config.json").then(res => res.json());
    let root = document.querySelector(':root');
    let availableText = document.getElementById("status");
    let face = document.getElementById("face");
    let playBtn = document.getElementById("play-btn");
    let dialogue = document.getElementById("dialogue");
    let dialogueText = document.getElementById("dialogue-text");
    let audio = document.getElementById("tts");
    let faceContainer = document.getElementById("face-container");
    let assistanceText = document.getElementById("assistance");

    if (data.available) {
        root.style.setProperty("--availability", 'green');
        availableText.textContent = "Available";
    } else {
        root.style.setProperty("--availability", 'red');
        availableText.textContent = "On Vacation";
    }

    document.body.style.pointerEvents = 'none';
    document.body.style.opacity = '0.5';

    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.textContent = 'Loading assets...';
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '50%';
    loadingIndicator.style.left = '50%';
    loadingIndicator.style.transform = 'translate(-50%, -50%)';
    loadingIndicator.style.zIndex = '9999';
    loadingIndicator.style.background = 'rgba(0, 0, 0, 0.8)';
    loadingIndicator.style.color = 'white';
    loadingIndicator.style.padding = '20px';
    loadingIndicator.style.borderRadius = '10px';
    loadingIndicator.style.fontSize = '18px';
    document.body.appendChild(loadingIndicator);

    const preloadedImages = {};
    const preloadedImageElements = {};

    function preloadImages(imageArray) {
        return Promise.all(imageArray.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    preloadedImages[src] = img.src;
                    preloadedImageElements[src] = img;
                    resolve();
                };
                img.onerror = reject;
                img.src = src;
            });
        }));
    }

    function preloadAudio(audioSrc) {
        return new Promise((resolve, reject) => {
            if (!audioSrc) {
                resolve();
                return;
            }
            const audioElement = new Audio();
            audioElement.oncanplaythrough = resolve;
            audioElement.onerror = reject;
            audioElement.src = audioSrc;
            audioElement.load();
        });
    }

    function setImageSrc(element, src) {
        if (preloadedImages[src]) {
            element.src = preloadedImages[src];
        } else {
            element.src = src;
        }
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

    const faceImgs = [
        "./imgs/face.webp",
        "./imgs/face-talking.webp"
    ];

    const ttsLines = [
        "Osama: Hi! I'm Oussama Bouzalim, a 20-year-old software developer passionate about",
        "tech and problem-solving. I specialize in front-end development with HTML,",
        "CSS, and JavaScript , and build back-end systems using Node.js,",
        "Bun, and Python I'm also exploring Rust for high-performance applications.",
        "Outside of coding, I enjoy playing cards, reading, and working out.",
        "I speak Arabic, French, and English, and love collaborating with people from different",
        " backgrounds. Feel free to check out my work or reach out—let's build something great!",
    ];

    try {
        await Promise.all([
            preloadImages(runnerImgs),
            preloadImages(bookImgs),
            preloadImages(faceImgs),
            preloadAudio(audio ? audio.src : null)
        ]);

        if (loadingIndicator && loadingIndicator.parentNode) {
            document.body.removeChild(loadingIndicator);
        }
        document.body.style.pointerEvents = 'auto';
        document.body.style.opacity = '1';
    } catch (error) {
        if (loadingIndicator) {
            loadingIndicator.textContent = 'Error loading assets. Please refresh the page.';
            loadingIndicator.style.background = 'rgba(255, 0, 0, 0.8)';
        }
    }

    const runnerImg = document.getElementById("runner-animation");
    let runnerInterval;

    runnerImg.onmouseenter = function () {
        let i = 0;
        runnerInterval = setInterval(() => {
            if (i === runnerImgs.length) i = 0;
            setImageSrc(runnerImg, runnerImgs[i]);
            i++;
        }, 300);
    };

    runnerImg.onmouseleave = function () {
        clearInterval(runnerInterval);
        setImageSrc(runnerImg, runnerImgs[0]);
    };

    const bookImg = document.getElementById("book-animation");

    bookImg.onmouseenter = async function () {
        setImageSrc(bookImg, "./imgs/book-half.webp");
        await new Promise(res => setTimeout(res, 300));
        setImageSrc(bookImg, "./imgs/book-open.webp");
    };

    bookImg.onmouseleave = async function () {
        setImageSrc(bookImg, "./imgs/book-half.webp");
        await new Promise(res => setTimeout(res, 300));
        setImageSrc(bookImg, "./imgs/book-closed.webp");
    };

    document.getElementById("age").textContent = new Date().getFullYear() - 2005;
    let oldPos = parseFloat(getComputedStyle(face).left.replace('px', '')) * 100 / window.innerWidth;
    
    face.addEventListener("click", () => {
        playBtn.style.display = "block";
        assistanceText.style.opacity = 0;
        faceContainer.style.opacity = .3;
        document.body.addEventListener("mousemove", followMouse);

        document.body.addEventListener('mouseleave', mouseLeavesPage);

        faceContainer.addEventListener("click", (e) => {
            faceContainer.style.opacity = 1;
            assistanceText.style.opacity = 1;
            playBtn.style.display = "none";
            document.body.removeEventListener('mousemove', followMouse);
            document.body.removeEventListener('mouseleave', mouseLeavesPage);
            face.removeAttribute('style')
            face.animate({
                top: '20px',
                left: `${oldPos+.5}%`
            }, { duration: 700, fill: "forwards" });
        });
    });

    function followMouse(e) {
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
    }

    function mouseLeavesPage(e) {
        face.animate({
            left: `50%`,
            top: `25%`
        }, { duration: 700, fill: "forwards" });
        face.removeAttribute("style");
        face.style.position = "absolute";
    }


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
                    setImageSrc(face, './imgs/face-talking.webp');
                } else {
                    setImageSrc(face, './imgs/face.webp');
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
            setImageSrc(face, './imgs/face.webp');
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
                    if (mouthInterval) clearInterval(mouthInterval);
                    setImageSrc(face, './imgs/face.webp');
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
