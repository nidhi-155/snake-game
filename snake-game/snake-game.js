// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("gameCanvas"); // as HTMLCanvasElement;
const context = canvas.getContext("2d"); // as CanvasRenderingContext2D;

// Define the size of each grid cell and calculate the width and height of the grid
const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

// Initialize the snake, food, and direction variables
let snake = [{ x: 5, y: 5 }];
let food = { x: 10, y: 10 };
let snakeSpeed = { x: 0, y: 0 };
let direction = "arrowright";

// Define variables to keep track of the game status and score
let gameOver = false;
let intervalId = 0;
let score = 0;

/**
 * Update the game state and redraw the canvas
 */
function update() {
  //console.log(snake.map((_) => _.x + "-" + _.y).join("|"));

  // Calculate the new head position based on the current direction
  const head = {
    x: (snake[0].x + snakeSpeed.x + gridWidth) % gridWidth,
    y: (snake[0].y + snakeSpeed.y + gridHeight) % gridHeight,
  };
  let grown = false;

  // Check if the snake has collided with its own body
  if (
    snake.length > 1 &&
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    // If so, set a flag to indicate that the game is over
    console.log("game over");
    gameOver = true;
    toggleGame();
    updateScoreboard();
  }

  // Check if the snake has eaten the food
  if (head.x === food.x && head.y === food.y) {
    // If so, generate new food
    generateFood();
    score++;
    updateScoreboard();
    grown = true;
  } else {
    // If not, remove the last segment from the snake, to show tail movement
    snake.pop();
  }

  // Add the new head to the beginning of the snake, to show head movement
  snake.unshift({ ...head });

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw each segment of the snake with decreasing brightness from head to tail
  let red = 0;
  let green = 255;
  let blue = 0;
  console.log("snake color");
  snake.forEach((segment) => {
    // Calculate the color based on the segment index
    context.fillStyle = `rgb(${red}, ${green}, ${blue})`;

    // Decrease the RGB values for the next segment
    if (green > red) {
      red += 5;
      green -= 5;
      blue += 5;
    }

    // Ensure the RGB values stay within the valid range (0-255)
    red = Math.max(0, Math.min(255, red));
    green = Math.max(0, Math.min(255, green));
    blue = Math.max(0, Math.min(255, blue));

    context.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
  if (grown) {
    console.log(`rgb(${red}, ${green}, ${blue})`);
    grown = false;
  }

  // Draw the food
  context.fillStyle = "red";
  context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

/**
 * Generate new food at a random position on the grid
 */
function generateFood() {
  food = {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
  };
}

/**
 * Change the direction of the snake based on the user's keyboard input
 * @param {string} key - The keyboard event key
 */
function changeDirection(key) {
  // console.log("changeDirection", key);
  const oppositeDirections = {
    arrowup: "arrowdown",
    arrowdown: "arrowup",
    arrowleft: "arrowright",
    arrowright: "arrowleft",
  };

  if (oppositeDirections[key] !== direction) {
    // If not, update the direction based on the keyboard input
    snakeSpeed = {
      x:
        key === "arrowleft" || key === "arrowright"
          ? key === "arrowright"
            ? 1
            : -1
          : 0,
      y:
        key === "arrowup" || key === "arrowdown"
          ? key === "arrowdown"
            ? 1
            : -1
          : 0,
    };
    direction = key;
    updateSnakeDirection();
  }
}

// Update the snake direction in the info panel
function updateSnakeDirection() {
  const snakeDirection = document.getElementById("snake-direction");
  snakeDirection.innerText = direction.substring(5);
}

/**
 * Start or pause the game when the space key is pressed
 */
function toggleGame() {
  if (intervalId) {
    console.log("pause");
    clearInterval(intervalId);
    intervalId = 0;
  } else if (!gameOver) {
    console.log("start/resume");
    intervalId = setInterval(update, 100);
  }
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();
  const keypress = document.getElementById("key-press");
  keypress.innerText = key;
  switch (key) {
    case "arrowdown":
    case "arrowup":
    case "arrowright":
    case "arrowleft":
      // case "s":
      // case "w":
      // case "d":
      // case "a":
      changeDirection(key);
      break;
    case " ":
      toggleGame();
      break;
    default:
      break;
  }
}

// Define a function to update the scoreboard
function updateScoreboard() {
  const scoreboard = document.getElementById("scoreboard"); // as HTMLDivElement;
  let scoreboardContent = `Score: ${score}`;
  if (gameOver) scoreboardContent += `\nGame Over`;
  scoreboard.innerText = scoreboardContent;
}

// Add event listener to capture keyboard input
document.addEventListener("keydown", handleKeyDown);

// Initialize the game
update();
changeDirection("arrowright");
updateScoreboard();
