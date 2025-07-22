let ground = document.getElementById("ground");

let particles = [
    'assets/flower1.webp',
    'assets/flower2.webp',
    'assets/flower3.webp',
    'assets/flower4.webp',
    'assets/rock.webp'
];

const amountOfParticles = RandomInteger(20, 30);

for(let i = 0; i < amountOfParticles; i++) {
    let particleImg = document.createElement('img');
    let choosenParticle = RandomInteger(0, particles.length);
    particleImg.src = particles[choosenParticle];
    particleImg.style.width = '45px';
    particleImg.style.height = '45px';
    if(particles[choosenParticle].includes("rock")) {
        particleImg.style.width = '25px';
        particleImg.style.height = '25px';
    }
    particleImg.style.position = "absolute";
    particleImg.style.left = `${RandomInteger(0, 95)}%`;
    particleImg.style.top = `${RandomInteger(0, 95)}%`;
    particleImg.draggable = false;
    ground.append(particleImg);
}

function RandomInteger(min=0, max=100) {
    return Math.floor(Math.random() * (max - min)) + min;
}