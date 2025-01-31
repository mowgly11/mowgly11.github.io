let possibleCommands = await fetch("./commands_data.json").then(data => data.json());
let asciiArt = await fetch("./hobbies_art.json").then(data => data.json());

let windowResolution = document.querySelector("#resolution");
let terminalWindow = document.querySelector(".terminal");
let terminalTop = document.querySelector(".terminal-top");
let terminalNewLine = document.querySelector("#terminal-new-line");
let terminalCommandInput = document.querySelector(".command-line");
let terminalBody = document.querySelector(".terminal-body");
let terminalResponseTemplate = document.querySelector("#terminal-response");
let vesionText = document.getElementById("version");

let lastUsedCommands = [];
let lastUsedCommandsIndex;
let currentDelay = 500;
let currentAsciiDelay = 0;
let isOnFullScreen = false;
toggleFullscreen();
document.getElementById("expand-dot").onclick = () => toggleFullscreen();
document.getElementById("red-dot").onclick = () => window.close();
document.getElementById("minimize-dot").onclick = () => location.href = "https://osamabouzalim.com";

windowResolution.textContent = `${terminalWindow.clientWidth} x ${terminalWindow.clientHeight}`;

window.addEventListener("resize", () => {
    let newterminalWindow = document.querySelector(".terminal");
    windowResolution.textContent = `${newterminalWindow.clientWidth} x ${newterminalWindow.clientHeight}`;
});

setupCmdDetector(terminalCommandInput);

function handleEnterKey(e, inputNode) {
    if (e.key === "Enter") {
        inputNode.setAttribute("disabled", true);

        var cmd = inputNode.value?.trim().replace(/[<>]/g, "");
        lastUsedCommands.push(cmd);

        lastUsedCommandsIndex = lastUsedCommands.length - 1

        executeCommand(cmd);

        addNewTerminalLine();
    } else if (e.key === "ArrowUp") navigateCommandHistory(-1, inputNode, 0);
    else if (e.key === "ArrowDown") navigateCommandHistory(1, inputNode, lastUsedCommands.length - 1);

}

function navigateCommandHistory(direction, node, stop) {
    if (lastUsedCommandsIndex == null) return;

    node.value = lastUsedCommands[lastUsedCommandsIndex];

    if (checkValidCommand(node.value?.trim())) node.style.color = "#608ffc";
    else node.style.color = "white";

    if (lastUsedCommandsIndex === stop) return;
    lastUsedCommandsIndex += direction;
}

function executeCommand(userCmd) {
    if (userCmd === "") return;
    let terminalOutput = terminalResponseTemplate.content.cloneNode(true);

    const commandExists = possibleCommands.find(cmd => cmd.split("::")[0] === userCmd);

    if (userCmd === "clear") terminalBody.innerHTML = "";
    else if (userCmd === "poweroff" || userCmd === "exit") location.href = "https://osamabouzalim.com";
    else if (userCmd === "reboot") location.reload();
    else if (userCmd === "sudo rm -rf /") {
        let allInputs = document.querySelectorAll("input");
        let allTexts = document.querySelectorAll("p");
        let allDivs = document.querySelectorAll("div");

        let elements = [...allInputs, ...allTexts, ...allDivs, terminalTop, terminalWindow];

        for (let i = 0; i < elements.length; i++) {
            setTimeout(() => {
                elements[i].remove();
            }, currentDelay);
            currentDelay += 10;
        }
    } else if (userCmd === "cat hobbies.html") {
        let hobbiesIndex = 0;
        let asciiKeys = Object.keys(asciiArt);

        let hobbiesList = ["Cards", "Programming", "Reading", "Workout"];
        let terminalOutputText = terminalOutput.querySelector(".terminal-text");

        asciiKeys.forEach(key => {
            asciiArt[key].forEach(async (line, index) => {
                wait(currentAsciiDelay).then(() => {
                    if (index === 0) {
                        terminalOutputText.innerHTML += `<h1 class='text-center'><b>${hobbiesList[hobbiesIndex]}</b></h1>`;
                        hobbiesIndex++;
                    }
                    terminalOutputText.innerHTML += `<p class='text-center' style='font-size: 2.7px; margin: 0;'>${line.split("").map(l => l + " ").join("")}</p>`;
                    if (index === asciiArt[key].length - 1) terminalWindow.scrollBy(0, 1000);
                });
                currentAsciiDelay += 20;
            });
        })

        currentAsciiDelay = 200;
    } else if (userCmd.startsWith("echo")) {
        let echoing = userCmd.split(" ");
        echoing.shift();
        terminalOutput.querySelector(".terminal-text").innerHTML = echoing.join(" ");
    } else if (commandExists != null) {
        let commandResponse = commandExists.split("::")[1];
        terminalOutput.querySelector(".terminal-text").innerHTML = commandResponse;
    } else terminalOutput.querySelector(".terminal-text").innerHTML = `${userCmd}: command not found`;

    terminalBody.append(terminalOutput);
}

function addNewTerminalLine() {
    const terminalPromptClone = terminalNewLine.content.cloneNode(true);
    const newCommandLine = terminalPromptClone.querySelector(".command-line");

    newCommandLine.addEventListener("keydown", (e) => handleEnterKey(e, newCommandLine));
    setupCmdDetector(newCommandLine);

    terminalBody.append(terminalPromptClone);

    newCommandLine.focus();
}
terminalCommandInput.addEventListener("keydown", (e) => handleEnterKey(e, terminalCommandInput));

function setupCmdDetector(inputElement) {
    inputElement.addEventListener("input", function () {
        if (checkValidCommand(inputElement.value?.trim())) inputElement.style.color = "#608ffc";
        else inputElement.style.color = "white"
    });
}

function checkValidCommand(userCmd) {
    if (possibleCommands.find(cmd => cmd.split("::")[0] === userCmd?.trim())) return true;
    return false;
}

function toggleFullscreen() {
    isOnFullScreen = !isOnFullScreen;

    const styles = isOnFullScreen
        ? {
            terminalWindow: { height: '100vh', width: '100vw', borderRadius: '0' },
            terminalTop: { width: '100vw', top: '0', left: '0', borderRadius: '0' },
            versionTextColor: 'white',
        }
        : {
            terminalWindow: { height: '80vh', width: '85vw', borderRadius: '15px' },
            terminalTop: {
                width: '85vw',
                top: '10vh',
                left: '7.5vw',
                borderTopLeftRadius: '14px',
                borderTopRightRadius: '14px',
            },
            versionTextColor: 'black',
        };

    Object.assign(terminalWindow.style, styles.terminalWindow);
    Object.assign(terminalTop.style, styles.terminalTop);
    vesionText.style.color = styles.versionTextColor;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}