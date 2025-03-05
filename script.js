// Remove instructions overlay on first key press
const instructionsDiv = document.getElementById("instructions");
document.addEventListener("keydown", () => {
  if (instructionsDiv.style.display !== "none") {
    instructionsDiv.style.display = "none";
  }
});

// --- Window Controls for Main Game Window ---
const win98Window = document.getElementById("win98-window");
const gameContent = win98Window.querySelector(".win98-content");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const errorPopup = document.getElementById("errorPopup");
const errorOkButton = document.getElementById("errorOkButton");

const minimizeBtn = document.getElementById("minimizeBtn");
const maximizeBtn = document.getElementById("maximizeBtn");
const closeBtn = document.getElementById("closeBtn");

minimizeBtn.addEventListener("click", () => {
  gameContent.style.display = gameContent.style.display === "none" ? "block" : "none";
});
maximizeBtn.addEventListener("click", () => {
  if (win98Window.classList.contains("maximized")) {
    win98Window.style.width = "800px";
    win98Window.style.height = "600px";
    win98Window.classList.remove("maximized");
  } else {
    win98Window.style.width = window.innerWidth + "px";
    win98Window.style.height = window.innerHeight + "px";
    win98Window.classList.add("maximized");
  }
  resizeCanvas();
});
// When closing the game, hide the window and reset the game.
closeBtn.addEventListener("click", () => {
  win98Window.style.display = "none";
  resetGame();
});

// --- Window Controls for Error Popup ---
const minimizeErrorBtn = document.getElementById("minimizeErrorBtn");
const maximizeErrorBtn = document.getElementById("maximizeErrorBtn");
const closeErrorBtn = document.getElementById("closeErrorBtn");
const errorContentElem = errorPopup.querySelector(".win98-content");

minimizeErrorBtn.addEventListener("click", () => {
  errorContentElem.style.display = errorContentElem.style.display === "none" ? "block" : "none";
});
maximizeErrorBtn.addEventListener("click", () => {
  if (errorPopup.classList.contains("maximized")) {
    errorPopup.style.width = "300px";
    errorPopup.classList.remove("maximized");
  } else {
    errorPopup.style.width = gameContent.clientWidth + "px";
    errorPopup.classList.add("maximized");
  }
});
closeErrorBtn.addEventListener("click", () => {
  errorPopup.style.display = "none";
});

// --- Taskbar Start Menu Toggle ---
const startButton = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");
startButton.addEventListener("click", (e) => {
  e.stopPropagation();
  if (startMenu.style.display === "block") {
    startMenu.style.display = "none";
    startButton.classList.remove("active");
  } else {
    startMenu.style.display = "block";
    startButton.classList.add("active");
  }
});
document.addEventListener("click", () => {
  startMenu.style.display = "none";
  startButton.classList.remove("active");
});

// --- Start Menu item event listeners for Araknoid and Admin ---
document.getElementById("startMenuAraknoid").addEventListener("click", () => {
  win98Window.style.display = "block";
  resetGame();
  startMenu.style.display = "none";
  startButton.classList.remove("active");
});
document.getElementById("startMenuAdmin").addEventListener("click", () => {
  adminWindow.style.display = "block";
  resetAdminWindow();
  startMenu.style.display = "none";
  startButton.classList.remove("active");
});

// --- Desktop Icon for Game: Reopen game window and reset the game ---
const gameDesktopIcon = document.getElementById("gameDesktopIcon");
gameDesktopIcon.addEventListener("click", () => {
  win98Window.style.display = "block";
  resetGame();
});

// --- Desktop Icon for Admin: Open admin window and reset it ---
const adminDesktopIcon = document.getElementById("adminDesktopIcon");
const adminWindow = document.getElementById("adminWindow");
const adminCloseBtn = document.getElementById("adminCloseBtn");
adminDesktopIcon.addEventListener("click", () => {
  adminWindow.style.display = "block";
  resetAdminWindow();
});
adminCloseBtn.addEventListener("click", () => {
  adminWindow.style.display = "none";
});

// Global variable to store the admin PIN entry
let adminPin = "";

function updatePinDisplay() {
  document.getElementById("pinDisplay").textContent = adminPin;
}

// Reset admin window and set up dialpad
function resetAdminWindow() {
  const adminContent = document.getElementById("adminContent");
  adminContent.innerHTML = `
    <div id="pinDisplay"></div>
    <div id="dialpad">
      <button class="dial-btn">1</button>
      <button class="dial-btn">2</button>
      <button class="dial-btn">3</button>
      <button class="dial-btn">4</button>
      <button class="dial-btn">5</button>
      <button class="dial-btn">6</button>
      <button class="dial-btn">7</button>
      <button class="dial-btn">8</button>
      <button class="dial-btn">9</button>
      <button class="dial-btn">Clear</button>
      <button class="dial-btn">0</button>
      <button class="dial-btn">Submit</button>
    </div>
  `;
  adminPin = "";
  updatePinDisplay();
  document.querySelectorAll('.dial-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      let text = this.textContent;
      if (text === "Clear") {
        adminPin = "";
        updatePinDisplay();
      } else if (text === "Submit") {
        if (adminPin === "0806") {
          document.getElementById("adminContent").innerHTML = `<p style="text-align:center; font-size: 24px;">Brajesh 💖 Manya</p>`;
        } else {
          document.getElementById("adminContent").innerHTML = `<p style="text-align:center; font-size: 24px;">It is a static page, what are you expecting here HackerMan 😑</p>`;
        }
      } else {
        adminPin += text;
        updatePinDisplay();
      }
    });
  });
}

// --- Canvas Resize ---
function resizeCanvas() {
  canvas.width = gameContent.clientWidth;
  canvas.height = gameContent.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// --- Digital Clock Update (current date and time) ---
function updateClock() {
  const now = new Date();
  const dateString = now.toLocaleDateString();
  const timeString = now.toLocaleTimeString();
  document.getElementById("clock").textContent = `${dateString} ${timeString}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- Game Logic ---
const paddleSpeed = 8;
let paddle = {
  x: canvas.width / 2 - 75,
  y: canvas.height - 30,
  width: 150,
  height: 15,
  dx: 0,
};
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  dx: 4,
  dy: -4,
};
let blocks = [];
const blockWidth = 15, blockHeight = 15;
const letterSpacing = 5;
const letters = {
  C: { width: 4, pattern: [[1,1,1,1], [1,0,0,0], [1,0,0,0], [1,0,0,0], [1,1,1,1]] },
  O: { width: 4, pattern: [[1,1,1,1], [1,0,0,1], [1,0,0,1], [1,0,0,1], [1,1,1,1]] },
  M: { width: 5, pattern: [[1,0,0,0,1], [1,1,0,1,1], [1,0,1,0,1], [1,0,0,0,1], [1,0,0,0,1]] },
  I: { width: 1, pattern: [[1], [1], [1], [1], [1]] },
  N: { width: 5, pattern: [[1,0,0,0,1], [1,1,0,0,1], [1,0,1,0,1], [1,0,0,1,1], [1,0,0,0,1]] },
  G: { width: 4, pattern: [[1,1,1,1], [1,0,0,0], [1,0,1,1], [1,0,0,1], [1,1,1,1]] },
  S: { width: 4, pattern: [[1,1,1,1], [1,0,0,0], [1,1,1,1], [0,0,0,1], [1,1,1,1]] }
};
function createBlocks() {
  const phrase = "COMING SOON";
  let totalWidth = 0;
  for (let i = 0; i < phrase.length; i++) {
    let letter = phrase[i];
    if (letter === " ") {
      totalWidth += blockWidth * 3 + letterSpacing;
    } else if (letters[letter]) {
      totalWidth += letters[letter].width * blockWidth + letterSpacing;
    }
  }
  let startX = (canvas.width - totalWidth) / 2;
  let startY = 50;
  for (let i = 0; i < phrase.length; i++) {
    let letter = phrase[i];
    if (letter === " ") {
      startX += blockWidth * 3;
      continue;
    }
    let letterData = letters[letter];
    if (letterData) {
      for (let row = 0; row < letterData.pattern.length; row++) {
        for (let col = 0; col < letterData.pattern[row].length; col++) {
          if (letterData.pattern[row][col]) {
            blocks.push({
              x: startX + col * blockWidth,
              y: startY + row * blockHeight,
              width: blockWidth,
              height: blockHeight,
              active: true,
            });
          }
        }
      }
      startX += letterData.width * blockWidth + letterSpacing;
    }
  }
}
createBlocks();

function drawPaddle() {
  ctx.fillStyle = "#000";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

// Draw blocks in white
function drawBlocks() {
  blocks.forEach((block) => {
    if (block.active) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(block.x, block.y, block.width, block.height);
    }
  });
}

function checkCollisions() {
  blocks.forEach((block) => {
    if (
      block.active &&
      ball.x > block.x &&
      ball.x < block.x + block.width &&
      ball.y - ball.radius < block.y + block.height &&
      ball.y + ball.radius > block.y
    ) {
      ball.dy *= -1;
      block.active = false;
    }
  });
  // Check if all blocks are destroyed:
  if (blocks.every(block => !block.active)) {
    showCompletePopup();
  }
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  checkCollisions();
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.dx *= -1;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }
  // Paddle collision with exaggerated reflection:
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    // Calculate collision point relative to paddle center (range -1 to 1)
    let collidePoint = (ball.x - (paddle.x + paddle.width/2)) / (paddle.width/2);
    // Maximum reflection angle (60° in radians)
    let maxAngle = Math.PI / 3;
    let angle = collidePoint * maxAngle;
    // Exaggerate the angle by 10%
    let factor = 0.1;
    let newAngle = angle * (1 + factor);
    // Clamp the angle within the maximum range
    newAngle = Math.max(-maxAngle, Math.min(maxAngle, newAngle));
    // Calculate the current ball speed
    let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    ball.dx = speed * Math.sin(newAngle);
    ball.dy = -speed * Math.cos(newAngle);
  }
  if (ball.y + ball.radius > canvas.height) {
    showErrorPopup();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    paddle.dx = -paddleSpeed;
  } else if (e.key === "ArrowRight") {
    paddle.dx = paddleSpeed;
  }
});
document.addEventListener("keyup", () => {
  paddle.dx = 0;
});

function showErrorPopup() {
  errorPopup.style.display = "block";
  errorPopup.style.top = (gameContent.clientHeight - errorPopup.offsetHeight) / 2 + "px";
  errorPopup.style.left = (gameContent.clientWidth - errorPopup.offsetWidth) / 2 + "px";
}

errorOkButton.addEventListener("click", () => {
  errorPopup.style.display = "none";
  resetGame();
});

// Show game complete popup
function showCompletePopup() {
  const completePopup = document.getElementById("completePopup");
  completePopup.style.display = "block";
  completePopup.style.top = (gameContent.clientHeight - completePopup.offsetHeight) / 2 + "px";
  completePopup.style.left = (gameContent.clientWidth - completePopup.offsetWidth) / 2 + "px";
}

// Event listeners for complete popup buttons
document.getElementById("closeCompleteBtn").addEventListener("click", () => {
  document.getElementById("completePopup").style.display = "none";
});
document.getElementById("completeOkButton").addEventListener("click", () => {
  document.getElementById("completePopup").style.display = "none";
});

// Reset game: reposition paddle/ball and reactivate all blocks
function resetGame() {
  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.y = canvas.height - 30;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 4;
  ball.dy = -4;
  blocks.forEach(block => block.active = true);
  update();
}

function update() {
  // If game complete or error popup is showing, stop update loop.
  if (document.getElementById("completePopup").style.display === "block") return;
  if (errorPopup.style.display === "block") return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveBall();
  drawBlocks();
  drawPaddle();
  drawBall();
  paddle.x += paddle.dx;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }
  requestAnimationFrame(update);
}
update();
// --- Desktop Icon for CV: Open CV window ---
const cvDesktopIcon = document.getElementById("cvDesktopIcon");
const cvWindow = document.getElementById("cvWindow");
cvDesktopIcon.addEventListener("click", () => {
  cvWindow.style.display = "block";
});

// --- Start Menu CV item event listener ---
document.getElementById("startMenuCV").addEventListener("click", () => {
  cvWindow.style.display = "block";
  startMenu.style.display = "none";
  startButton.classList.remove("active");
});

// --- CV Window close button ---
const cvCloseBtn = document.getElementById("cvCloseBtn");
cvCloseBtn.addEventListener("click", () => {
  cvWindow.style.display = "none";
});
