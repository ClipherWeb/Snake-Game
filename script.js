const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score-value');
const rankDisplay = document.getElementById('rank-title'); // 🆕 Get rank element
const boardSize = 20;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = spawnFood();
let score = 0;
let intervalTime = 150;
let gameLoop = null;
let hasStarted = false;

// 🧠 Head emoji depending on score
function getHeadEmoji(score) {
  if (score >= 45) return '👑';     // King
  if (score >= 30) return '😈';     // Pro
  if (score >= 15) return '😎';     // Cool
  return '😐';                      // Noob
}

// 🧠 Title text depending on score
function getRankTitle(score) {
  if (score >= 45) return 'King';
  if (score >= 30) return 'Pro';
  if (score >= 15) return 'Cool';
  return 'Noob';
}

function drawBoard() {
  board.innerHTML = '';
  for (let y = 1; y <= boardSize; y++) {
    for (let x = 1; x <= boardSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      const index = snake.findIndex(segment => segment.x === x && segment.y === y);
      if (index === 0) {
        cell.classList.add('snake-head');
        cell.textContent = getHeadEmoji(score);
        cell.style.fontSize = '18px';
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';

        // Rotate triangle/emoji based on direction
        let rotation = 0;
        if (direction.x === 1) rotation = 0;
        else if (direction.x === -1) rotation = 180;
        else if (direction.y === -1) rotation = -90;
        else if (direction.y === 1) rotation = 90;

        cell.style.transform = `rotate(${rotation}deg)`;
      } else if (index > 0) {
        cell.classList.add('snake');
      } else if (food.x === x && food.y === y) {
        cell.classList.add('food');
      }

      board.appendChild(cell);
    }
  }
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Game Over Conditions
  const hitWall = head.x < 1 || head.x > boardSize || head.y < 1 || head.y > boardSize;
  const hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);

  if (hitWall || hitSelf) {
    clearInterval(gameLoop);

    // Death animation (optional)
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      if (cell.textContent === getHeadEmoji(score)) {
        cell.classList.add('death');
      }
    });

    setTimeout(() => {
      alert('💀 Game Over! Final score: ' + score);
      location.reload();
    }, 900);

    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;

    // 🆕 Update rank title in DOM
    rankDisplay.textContent = getRankTitle(score);

    food = spawnFood();
  } else {
    snake.pop();
  }

  drawBoard();
}

function spawnFood() {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * boardSize) + 1,
      y: Math.floor(Math.random() * boardSize) + 1
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return newFood;
    }
  }
}

function changeDirection(e) {
  if (!hasStarted) {
    gameLoop = setInterval(moveSnake, intervalTime);
    hasStarted = true;
  }

  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}

document.addEventListener('keydown', changeDirection);

// Set initial rank title
rankDisplay.textContent = getRankTitle(score);

// Draw initial board
drawBoard();
