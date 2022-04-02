const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const boxes = [];
const blocksEl = document.querySelector(".blocks");
const btnReset = document.querySelector(".reset");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let difficulty = 3;
let numBoxes = 3;

const character = {
  right: false,
  left: false,
  up: false,
  jumping: false,
  x: canvas.width / 2,
  y: canvas.height - 25,
  xVelocity: 0,
  yVelocity: 0,
};

const randomDoorXPosition = Math.random() * canvas.width - 40 + 30;
const randomDoorYPosition = Math.random() * (canvas.height - 400);

let squares;

if (randomDoorYPosition > 200) {
  squares = 1;
}

if (randomDoorYPosition < 200) {
  squares = 2;
}

if (randomDoorYPosition < 50) {
  squares = 3;
}

blocksEl.textContent = `Blocks Remaining: ${squares}`;

function keyListner(e) {
  const keyPressed = e.type === "keydown" ? true : false;

  if (e.keyCode === 37) {
    //   LEFT
    character.left = keyPressed;
  }

  if (e.keyCode === 39) {
    //   RIGHT
    character.right = keyPressed;
  }

  if (e.keyCode === 38 ?? !keyPressed) {
    //   UP
    if (!character.jumping) {
      character.yVelocity -= 60;
      character.jumping = true;
    }
  }
}

const checkIfPass = function () {
  if (
    character.x >= randomDoorXPosition &&
    character.x <= randomDoorXPosition + 70 &&
    character.y >= randomDoorYPosition &&
    character.y <= randomDoorYPosition + 100
  ) {
    window.location.reload();
  }
};

const loop = function () {
  let falling =
    character.yVelocity > -63 || character.yVelocity < -61 ? true : false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (character.right) {
    character.xVelocity += 2;
  }

  if (character.left) {
    character.xVelocity -= 2;
  }

  if (character.yVelocity > canvas.height - 25) {
    character.yVelocity = canvas.height - 25;
  }

  character.x += character.xVelocity;
  character.y += character.yVelocity;

  character.yVelocity *= 0.9;
  character.xVelocity *= 0.9;
  const box = boxes.some((box) => {
    return (
      character.y >= box.y - 25 &&
      character.y <= box.y + 25 &&
      character.x >= box.x - 24 &&
      character.x <= box.x + 120 &&
      falling === true
    );
  });

  if (box) {
    const boxEl = boxes.filter((b) => {
      return (
        character.y >= b.y - 25 &&
        character.y <= b.y + 25 &&
        character.x >= b.x - 50 &&
        character.x <= b.x + 120 &&
        falling === true
      );
    })[0];
    character.y = boxEl.y - 25;
    character.jumping = false;
    character.yVelocity = 0;
    character.jumping = false;
    falling = false;
  } else {
    character.yVelocity += 6.5;
  }

  if (character.y > canvas.height - 25) {
    character.jumping = false;
    character.y = canvas.height - 25;
    character.yVelocity = 0;
    falling = false;
  }

  if (character.x > canvas.width) {
    character.x = 0;
  }

  if (character.x < 0) {
    character.x = canvas.width;
  }

  boxes.forEach((box) => box.draw());

  checkIfPass();

  ctx.beginPath();
  ctx.fillStyle = "rgb(66, 135, 245)";

  ctx.rect(character.x, character.y, 25, 25);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "rgb(226, 205, 19)";
  ctx.rect(randomDoorXPosition, randomDoorYPosition, 70, 100);
  ctx.fill();
  ctx.closePath();

  requestAnimationFrame(loop);
};

loop();

document.addEventListener("keydown", keyListner);
document.addEventListener("keyup", keyListner);

// BOX PART

canvas.addEventListener("click", (e) => {
  if (boxes.length === squares) return;
  blocksEl.textContent = `Blocks Remaining: ${squares - 1 - boxes.length}`;
  const box = {
    x: e.x,
    y: e.y,
    draw() {
      ctx.beginPath();
      ctx.fillStyle = "rgb(245, 66, 66)";
      ctx.rect(this.x, this.y, 120, 20);
      ctx.fill();
      ctx.closePath();
    },
  };

  boxes.push(box);
});

ctx.beginPath();
ctx.fillStyle = "yellow";
ctx.rect(randomDoorXPosition, randomDoorYPosition, 70, 100);
ctx.fill();
ctx.closePath();

btnReset.addEventListener("click", () => {
  window.location.reload();
});
