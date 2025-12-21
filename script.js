document.addEventListener("DOMContentLoaded", async () => {
    const loadTheme = localStorage.getItem("theme");
    if (!loadTheme || !["default", "jungle"].includes(loadTheme)) localStorage.setItem('theme', "default");
    let currentTheme = loadTheme;

    const root = document.querySelector(":root");
    const face = document.getElementById("face");
    const playBtn = document.getElementById("play-btn");
    const dialogue = document.getElementById("dialogue");
    const dialogueText = document.getElementById("dialogue-text");
    const audio = document.getElementById("tts");
    audio.volume = .6;
    const audio2 = document.getElementById("parrot-tts");
    audio2.volume = .4;
    const faceContainer = document.getElementById("face-container");
    const bucket = document.getElementById("bucket");
    const bgMonkeys = document.getElementById("bg-monkeys");
    const bgBushes = document.getElementById("bg-bushes");
    const landingSection = document.getElementById("landing-section");
    const cham = document.getElementById("cham-green");
    const parrot = document.getElementById("parrot");

    let parallaxElements = [bgMonkeys, bgBushes];

    landingSection.addEventListener("mousemove", parallax);

    function parallax(e) {
        parallaxElements.forEach(shift => {
            const position = shift.getAttribute("value");
            const x = (window.innerWidth - e.pageX * position) / 90;
            const y = (window.innerHeight - e.pageY * position) / 90;

            shift.style.transform = `translateX(${x}px) translateY(${y}px)`;
        })
    }

    const bnwThemeVars = {
        "--color-1": "#e6e6e6",
        "--color-2": "#242424",
        "--color-3": "rgb(98, 98, 98)",
        "--color-4": "#c4c4c4",
        "--color-5": "rgb(0, 0, 0, .2)",
        "--color-6": "white",
        "--color-7": "#F5F5F5",
        "--color-8": "#242424"
    };

    const colorfulThemeVars = {
        "--color-1": "#d7d66e",
        "--color-2": "#206733",
        "--color-3": "#217132",
        "--color-4": "#5e9239",
        "--color-5": "rgb(0, 0, 0, .2)",
        "--color-6": "#c3ce7c",
        "--color-7": "#a7c367",
        "--color-8": "#e0d973"
    };

    bucket.addEventListener("click", (e) => {
        let theme = localStorage.getItem('theme');

        if (theme === "jungle") {
            localStorage.setItem("theme", "default");
            switchTheme("default");
            currentTheme = "default";
        }
        else if (theme === "default") {
            localStorage.setItem("theme", "jungle");
            switchTheme("jungle");
            currentTheme = "jungle";
        } else {
            localStorage.setItem("theme", "default");
            switchTheme("default");
            currentTheme = "default";
        }
    });

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
        "imgs/runner-frame1.webp",
        "imgs/runner-frame3.webp",
        "imgs/runner-frame2.webp",
        "imgs/runner-frame4.webp",
    ];

    const bookImgs = [
        "imgs/book-half.webp",
        "imgs/book-open.webp",
        "imgs/book-closed.webp"
    ];

    const faceImgs = [
        "imgs/face.webp",
        "imgs/face-talking.webp"
    ];

    const otherImgs = [
        "imgs/laptop.webp",
        "imgs/laptop-green.webp",
        "imgs/info.webp",
        "imgs/info-green.webp",
        "imgs/ace.webp",
        "imgs/ace-green.webp",
        "imgs/jungle-tree-green.webp",
        "imgs/grass1-green.webp",
        "imgs/grass4-green.webp",
        "imgs/background-green.webp",
        "imgs/monkeys-green.webp",
        "imgs/bushes-green.webp",
        "imgs/cham-yellow-green.webp",
        "imgs/cham-red-green.webp",
        "imgs/cham-blue-green.webp",
        "imgs/cham-pink-green.webp",
        "imgs/parrot1-green.webp",
        "imgs/parrot2-green.webp",
    ]

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
            preloadImages([...runnerImgs, ...runnerImgs.map(i => i.replace(".webp", "-green.webp"))]),
            preloadImages([...bookImgs, ...bookImgs.map(i => i.replace(".webp", "-green.webp"))]),
            preloadImages([...faceImgs, ...faceImgs.map(i => i.replace(".webp", "-green.webp"))]),
            preloadImages(otherImgs),
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
            setImageSrc(runnerImg, convertToThemeName(currentTheme, runnerImgs[i]));
            i++;
        }, 300);
    };

    runnerImg.onmouseleave = function () {
        clearInterval(runnerInterval);
        setImageSrc(runnerImg, convertToThemeName(currentTheme, runnerImgs[0]));
    };

    const bookImg = document.getElementById("book-animation");

    bookImg.onmouseenter = async function () {
        setImageSrc(bookImg, convertToThemeName(currentTheme, "imgs/book-half.webp"));
        await new Promise(res => setTimeout(res, 300));
        setImageSrc(bookImg, convertToThemeName(currentTheme, "imgs/book-open.webp"));
    };

    bookImg.onmouseleave = async function () {
        setImageSrc(bookImg, convertToThemeName(currentTheme, "imgs/book-half.webp"));
        await new Promise(res => setTimeout(res, 300));
        setImageSrc(bookImg, convertToThemeName(currentTheme, "imgs/book-closed.webp"));
    };

    document.getElementById("age").textContent = new Date().getFullYear() - 2005;
    let oldPos = parseFloat(getComputedStyle(face).left.replace('px', '')) * 100 / window.innerWidth;

    face.addEventListener("click", () => {
        playBtn.style.display = "block";
        faceContainer.style.opacity = .3;
        document.body.addEventListener("mousemove", followMouse);

        document.body.addEventListener('mouseleave', mouseLeavesPage);

        faceContainer.addEventListener("click", (e) => {
            faceContainer.style.opacity = 1;
            playBtn.style.display = "none";
            document.body.removeEventListener('mousemove', followMouse);
            document.body.removeEventListener('mouseleave', mouseLeavesPage);
            face.removeAttribute('style');
            face.animate({
                top: '20px',
                left: `${oldPos + .5}%`
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

        if (y > document.documentElement.scrollHeight - 100) {
            face.animate({
                top: `${y - 80}px`
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
                    setImageSrc(face, convertToThemeName(currentTheme, 'imgs/face-talking.webp'));
                } else {
                    setImageSrc(face, convertToThemeName(currentTheme, 'imgs/face.webp'));
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
            setImageSrc(face, convertToThemeName(currentTheme, 'imgs/face.webp'));
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
                    setImageSrc(face, convertToThemeName(currentTheme, 'imgs/face.webp'));
                    dialogue.style.zIndex = -1;
                    dialogue.style.opacity = 0;
                }, 5000);
            };
            dialogueText.textContent = "Osama: " + ttsLines[currentLineIndex];
            currentLineIndex++;
        }, 5000);
    }

    let replaceableAssets = [
        ...runnerImgs,
        ...bookImgs,
        ...faceImgs,
        "imgs/info.webp",
        "imgs/laptop.webp",
        "imgs/ace.webp",
        "imgs/linkedin.webp",
        "imgs/gmail.webp",
        "imgs/github.webp",
        "imgs/fiverr.webp",
        "imgs/instagram.webp",
    ];

    let hideableAssets = [
        "imgs/grass1-green.webp",
        "imgs/grass2-green.webp",
        "imgs/grass3-green.webp",
        "imgs/grass4-green.webp",
        "imgs/grass5-green.webp",
        "imgs/palm-tree-green.webp",
        "imgs/jungle-tree-green.webp",
        "imgs/lianas-green.webp",
        "imgs/lianas-brown-green.webp",
        "imgs/background-green.webp",
        "imgs/monkeys-green.webp",
        "imgs/bushes-green.webp",
        "imgs/monkey1-green.webp",
        "imgs/monkey2-green.webp",
        "imgs/monkey3-green.webp",
        "imgs/head-green.webp",
        "imgs/tail-green.webp",
        "imgs/cham-green.webp",
        "imgs/cham-yellow-green.webp",
        "imgs/cham-red-green.webp",
        "imgs/cham-blue-green.webp",
        "imgs/cham-pink-green.webp",
        "imgs/crocodile-green.webp",
        "imgs/fish-green.webp",
        "imgs/parrot1-green.webp",
        "imgs/parrot2-green.webp",
    ];

    function switchTheme(theme = "default") {
        let allImgs = Array.from(document.querySelectorAll("img"));
        let themeKeys;
        switch (theme) {
            case "default":
                bucket.style.backgroundImage = "url(./imgs/bucket-colored.webp)";

                themeKeys = bnwThemeVars;
                allImgs.forEach(img => {
                    let replacementSrc = replaceableAssets
                        .find(a => a === img.src.replace(window.location.origin + "/", "").replace("-green", ""));

                    if (replacementSrc) {
                        setImageSrc(img, replacementSrc);
                    }
                });

                allImgs.forEach(img => {
                    let imgSrc = img.src.replace(window.location.origin + "/", "");
                    if (hideableAssets.includes(imgSrc)) img.style.opacity = 0;
                });

                landingSection.style.background = "linear-gradient(to bottom, var(--color-7), var(--color-4))";
                cham.style.display = "none";

                break;
            case "jungle":
                bucket.style.backgroundImage = "url(./imgs/bucket-black.webp)";
                bucket.style.backgroundSize = "cover";

                themeKeys = colorfulThemeVars;
                allImgs.forEach(img => {
                    let replacementSrc = replaceableAssets
                        .find(a => a === img.src.replace(window.location.origin + "/", ""));

                    if (replacementSrc) {
                        setImageSrc(img, replacementSrc.replace(".webp", "-green.webp"));
                    }
                });

                allImgs.forEach(img => {
                    let imgSrc = img.src.replace(window.location.origin + "/", "");
                    if (hideableAssets.includes(imgSrc)) img.style.opacity = 1;
                });

                landingSection.style.background = "none";
                cham.style.display = "block";
                
                break;
            default:
                switchTheme("default");
        }

        for (const key in themeKeys) {
            root.style.setProperty(key, themeKeys[key]);
        }
    }

    switchTheme(currentTheme);

    function convertToThemeName(theme, source) {
        let result;
        switch (theme) {
            case "default":
                result = source.replace("-green.webp", ".webp");
                break;
            case "jungle":
                result = source.replace(".webp", "-green.webp")
                break;
            default:
                result = convertToThemeName("default", source);
        }

        return result;
    }

    let chamImages = [
        "imgs/cham-yellow-green.webp",
        "imgs/cham-red-green.webp",
        "imgs/cham-blue-green.webp",
        "imgs/cham-pink-green.webp",
        "imgs/cham-green.webp",
    ];

    let interval;
    let index = 0;
    cham.addEventListener("mouseenter", (e) => {
        cham.style.backgroundImage = `url(${chamImages[index]})`;
        index++;
        if(index === chamImages.length) index = 0;

        interval = setInterval(() => {
            cham.style.backgroundImage = `url(${chamImages[index]})`;
            index++;
            if(index === chamImages.length) index = 0;
        }, 700);
    });

    cham.addEventListener("mouseleave", (e) => {
        clearInterval(interval);
    });

    let setSrc;
    parrot.onclick = () => {
        if(setSrc) clearTimeout(setSrc);
        audio2.currentTime = 0;
        audio2.play();
        setImageSrc(parrot, "imgs/parrot2-green.webp");
        setSrc = setTimeout(() =>setImageSrc(parrot, "imgs/parrot1-green.webp"),600)
    }

    document.getElementById("year").textContent = new Date().getFullYear()
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

function randomInteger(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min)) + min;
}