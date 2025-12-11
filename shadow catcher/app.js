var player = document.getElementById("player");
var shadow = document.getElementById("shadow");
var scoreBox = document.getElementById("scoreBox");
var messageBox = document.getElementById("messageBox");
var msgText = document.getElementById("msgText");
var retryButton = document.getElementById("retryButton");
var nextLevelButton = document.getElementById("nextLevelButton");

var score = 0;
var tries = 0;
var maxTries = 10;
var targetScore = 10;

var x = 200, y = 200;
var speed = 10;

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

        scoreBox.innerText = "Score: " + Math.floor(score) + " | Tries: " + tries;

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
    player.style.display = "none";
    shadow.style.display = "none";
    messageBox.style.display = "block";

    if (result === "win") {
        msgText.innerText = "Hurrah! You won the match!";
        nextLevelButton.style.display = "inline-block";
        retryButton.style.display = "none";

    } else {
        msgText.innerText = "Oh no! You lost the match!";
        retryButton.style.display = "inline-block";
        nextLevelButton.style.display = "none";
    }
}

function nextLevel() {
    resetGame();
}

function resetGame() {
    score = 0;
    tries = 0;
    alreadyCaught = false;

    player.style.display = "block";
    shadow.style.display = "block";
    messageBox.style.display = "none";

    retryButton.style.display = "none";
    nextLevelButton.style.display = "none";

    scoreBox.innerText = "Score: 0 | Tries: 0";

    x = 200;
    y = 200;
    player.style.top = y + "px";
    player.style.left = x + "px";
}