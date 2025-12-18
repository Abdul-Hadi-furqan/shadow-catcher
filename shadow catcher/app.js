var player = document.getElementById("player");
var shadow = document.getElementById("shadow");
var scoreBox = document.getElementById("scoreBox");
var messageBox = document.getElementById("messageBox");
var msgText = document.getElementById("msgText");
var retryButton = document.getElementById("retryButton");
var nextLevelButton = document.getElementById("nextLevelButton");

var score = 0;
var tries = 0;
var maxTries = 3;
var targetScore = 10;
var timeLeft = 10;
var timerId;
var audioCtx;

var x = 200, y = 200;
var speed = 20;

document.addEventListener("keydown", movePlayer);

function movePlayer(e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === "ArrowUp") y -= speed;
    if (e.key === "ArrowDown") y += speed;
    if (e.key === "ArrowLeft") x -= speed;
    if (e.key === "ArrowRight") x += speed;

    var maxX = window.innerWidth - player.offsetWidth;
    var maxY = window.innerHeight - player.offsetHeight;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    player.style.top = y + "px";
    player.style.left = x + "px";

    checkCatch();
}

setInterval(function () {
    var sx = Math.random() * (window.innerWidth - 50);
    var sy = Math.random() * (window.innerHeight - 50);
    shadow.style.left = sx + "px";
    shadow.style.top = sy + "px";
}, 3000);

var alreadyCaught = false;

function playTone(freq, duration, type = 'sine', volume = 0.1) {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtx;
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
}

function playCatchSound() {
    playTone(660, 150);
    setTimeout(() => playTone(780, 150), 150);
}

function playWinSound() {
    playTone(523.25, 200);
    setTimeout(() => playTone(659.25, 200), 200);
    setTimeout(() => playTone(784, 400), 400);
}

function playLoseSound() {
    playTone(392, 300);
    setTimeout(() => playTone(349, 300), 300);
    setTimeout(() => playTone(330, 500), 600);
}

function playTick() {
    playTone(150, 80, 'triangle', 0.03);
}

function updateDisplay() {
    scoreBox.innerText = "Score: " + Math.floor(score) + " | Tries: " + tries + " | Time: " + timeLeft;
}

function startTimer() {
    updateDisplay();
    timerId = setInterval(function () {
        timeLeft--;
        updateDisplay();
        playTick();
        if (timeLeft <= 0) {
            clearInterval(timerId);
            endGame("lose");
        }
    }, 1000);
}

function checkCatch() {
    if (tries >= maxTries) return;

    var p = player.getBoundingClientRect();
    var s = shadow.getBoundingClientRect();

    var overlapX = Math.max(0, Math.min(p.right, s.right) - Math.max(p.left, s.left));
    var overlapY = Math.max(0, Math.min(p.bottom, s.bottom) - Math.max(p.top, s.top));
    var overlapArea = overlapX * overlapY;

    if (overlapArea > 0 && alreadyCaught === false) {
        score += overlapArea / 100;
        tries += 1;
        alreadyCaught = true;
        playCatchSound();

        updateDisplay();

        if (score >= targetScore) {
            endGame("win");
        } else if (tries >= maxTries) {
            endGame("lose");
        }
    }

    if (overlapArea === 0) {
        alreadyCaught = false;
    }
}

function endGame(result) {
    if (result === "win") {
        playWinSound();
        msgText.innerText = "Hurrah! You won the match!";
        nextLevelButton.style.display = "inline-block";
        retryButton.style.display = "none";
    } else {
        playLoseSound();
        msgText.innerText = "Oh no! You lost the match!";
        retryButton.style.display = "inline-block";
        nextLevelButton.style.display = "none";
    }

    player.style.display = "none";
    shadow.style.display = "none";
    messageBox.style.display = "block";

    if (timerId) {
        clearInterval(timerId);
    }
}

function nextLevel() {
    resetGame();
}

function retry() {
    resetGame();
}

function resetGame() {
    score = 0;
    tries = 0;
    timeLeft = 10;
    alreadyCaught = false;

    if (timerId) {
        clearInterval(timerId);
    }

    player.style.display = "block";
    shadow.style.display = "block";
    messageBox.style.display = "none";

    retryButton.style.display = "none";
    nextLevelButton.style.display = "none";

    x = 200;
    y = 200;
    player.style.top = y + "px";
    player.style.left = x + "px";

    startTimer();
}

resetGame();
