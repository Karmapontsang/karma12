let playerImg, goalImg, cutscene1Img, cutscene2Img, cutscene3Img;
let player;
let goal;
let obstacles = [];
let gameState = "start";

function preload() {
  playerImg = loadImage('Mike.png');
  goalImg = loadImage('Yeshihouse.jpeg');
  cutscene1Img = loadImage('Yeshi.jpg');
  cutscene2Img = loadImage('Mike.png');
  cutscene3Img = loadImage('Yeshi.jpg');
}

function setup() {
  createCanvas(600, 400);
  player = createVector(100, 200);
  goal = createVector(500, 200);
  
  for (let i = 0; i < 10; i++) {
    let x = random(150, 450);
    let y = random(50, 350);
    obstacles.push(createVector(x, y));
  }
}

function draw() {
  background(220);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "play") {
    drawPlayScreen();
  } else if (gameState === "cutscene1") {
    drawCutscene1();
  } else if (gameState === "cutscene2") {
    drawCutscene2();
  } else if (gameState === "cutscene3") {
    drawCutscene3();
  } else if (gameState === "quiz") {
    drawQuiz();
  }
}

function drawStartScreen() {
  background(50, 100, 200);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("Welcome to the Game!", width / 2, height / 2 - 20);
  textSize(20);
  text("Click to Start", width / 2, height / 2 + 30);
}

function drawPlayScreen() {
  background(200);
  image(playerImg, player.x, player.y, 40, 40);
  image(goalImg, goal.x, goal.y, 60, 60);

  fill(0);
  for (let obs of obstacles) {
    rect(obs.x, obs.y, 50, 20);
    if (
      player.x + 20 > obs.x &&
      player.x - 20 < obs.x + 50 &&
      player.y + 20 > obs.y &&
      player.y - 20 < obs.y + 20
    ) {
      player.set(100, 200);
    }
  }

  if (keyIsDown(LEFT_ARROW)) player.x -= 3;
  if (keyIsDown(RIGHT_ARROW)) player.x += 3;
  if (keyIsDown(UP_ARROW)) player.y -= 3;
  if (keyIsDown(DOWN_ARROW)) player.y += 3;

  if (dist(player.x, player.y, goal.x + 30, goal.y + 30) < 40) {
    gameState = "cutscene1";
  }
}

function drawCutscene1() {
  background(100);
  image(cutscene1Img, width / 2 - 100, 100, 200, 200);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textAlign(CENTER);
  textSize(16);
  text("What are you doing in the rain?", width / 2, 30);
}

function drawCutscene2() {
  background(100);
  image(cutscene2Img, width / 2 - 100, 100, 200, 200);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textAlign(CENTER);
  textSize(16);
  text("Choose wisely!", width / 2, 30);

  fill(255);
  rect(150, 300, 100, 40);
  rect(350, 300, 100, 40);

  fill(0);
  textSize(16);
  text("None of your business", 200, 325);
  text("I Don't have a place to live.", 400, 325);
}

function drawCutscene3() {
  background(100);
  image(cutscene3Img, width / 2 - 100, 100, 200, 200);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textAlign(CENTER);
  textSize(16);
  text("Do you want to go to my house for shelter.", width / 2, 30);
}

function drawQuiz() {
  background(150);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textAlign(CENTER);
  textSize(16);
  text("Quiz Time: Which path leads to shelter?", width / 2, 30);

  // Options for the quiz
  fill(255);
  rect(150, 300, 100, 40); // Option 1: Wrong
  rect(350, 300, 100, 40); // Option 2: Correct

  fill(0);
  textSize(16);
  text("Acept Yeshi's offer", 200, 325);
  text("Decline Yeshi's offer", 400, 325);
}

function mousePressed() {
  if (gameState === "start") {
    gameState = "play";
  } else if (gameState === "cutscene1") {
    gameState = "cutscene2";
  } else if (gameState === "cutscene2") {
    if (mouseX > 150 && mouseX < 250 && mouseY > 300 && mouseY < 340) {
      gameState = "cutscene3";
    } else if (mouseX > 350 && mouseX < 450 && mouseY > 300 && mouseY < 340) {
      gameState = "cutscene3";
    }
  } else if (gameState === "cutscene3") {
    gameState = "quiz";
  } else if (gameState === "quiz") {
    // Path A is wrong, Path B is right
    if (mouseX > 150 && mouseX < 250 && mouseY > 300 && mouseY < 340) {
      player.set(100, 200);
      gameState = "start";
    } else if (mouseX > 350 && mouseX < 450 && mouseY > 300 && mouseY < 340) {
      gameState = "play";
    }
  }
}
