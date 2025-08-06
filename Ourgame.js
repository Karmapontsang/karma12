let playerImg, goalImg, cutscene1Img, cutscene2Img, cutscene3Img;
let cutscene4Mike, cutscene4Yeshi, insideImg;
let player;
let goal;
let obstacles = [];
let gameState = "start";

function preload() {
  // loadImage(path, successCallback, errorCallback)
  playerImg = loadImage('Mike.png',
    () => console.log('playerImg loaded'),
    () => console.error('playerImg failed to load: Mike.png')
  );
  goalImg = loadImage('Yeshihouse.jpeg',
    () => console.log('goalImg loaded'),
    () => console.error('goalImg failed to load: Yeshihouse.jpeg')
  );
  cutscene1Img = loadImage('Yeshi.jpg',
    () => console.log('cutscene1Img loaded'),
    () => console.error('cutscene1Img failed to load: Yeshi.jpg')
  );
  cutscene2Img = loadImage('Mike.png',
    () => console.log('cutscene2Img loaded'),
    () => console.error('cutscene2Img failed to load: Mike.png')
  );
  cutscene3Img = loadImage('Yeshi.jpg',
    () => console.log('cutscene3Img loaded'),
    () => console.error('cutscene3Img failed to load: Yeshi.jpg')
  );

  // Cutscene 4+ assets (reused for 5,6,7)
  insideImg = loadImage('Inside.jpeg',
    () => console.log('insideImg loaded'),
    () => console.error('insideImg failed to load: Inside.jpeg')
  );
  cutscene4Mike = loadImage('Mike.png',
    () => console.log('cutscene4Mike loaded'),
    () => console.error('cutscene4Mike failed to load: Mike.png')
  );
  cutscene4Yeshi = loadImage('Yeshi.jpg',
    () => console.log('cutscene4Yeshi loaded'),
    () => console.error('cutscene4Yeshi failed to load: Yeshi.jpg')
  );
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

  textFont('Arial');
  textAlign(CENTER);
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
  } else if (gameState === "cutscene4") {
    drawCutscene4();
  } else if (gameState === "cutscene5") {
    drawCutscene5();
  } else if (gameState === "cutscene6") {
    drawCutscene6();
  } else if (gameState === "cutscene7") {
    drawCutscene7();
  }
}

function drawStartScreen() {
  background(50, 100, 200);
  fill(255);
  textSize(32);
  text("Welcome to the Game!", width / 2, height / 2 - 20);
  textSize(20);
  text("Click to Start", width / 2, height / 2 + 30);
}

function drawPlayScreen() {
  background(200);

  // draw player and goal only if images loaded; otherwise draw placeholders
  if (playerImg) {
    image(playerImg, player.x, player.y, 40, 40);
  } else {
    fill(0);
    rect(player.x, player.y, 40, 40);
  }

  if (goalImg) {
    image(goalImg, goal.x, goal.y, 60, 60);
  } else {
    fill(0, 200, 0);
    rect(goal.x, goal.y, 60, 60);
  }

  fill(0);
  for (let obs of obstacles) {
    rect(obs.x, obs.y, 50, 20);
    if (
      player.x + 20 > obs.x &&
      player.x - 20 < obs.x + 50 &&
      player.y + 20 > obs.y &&
      player.y - 20 < obs.y + 20
    ) {
      console.log("HIT_OBS Reset player to start");
      player.set(100, 200);
    }
  }

  // Player movement (only while playing)
  if (keyIsDown(LEFT_ARROW)) player.x -= 3;
  if (keyIsDown(RIGHT_ARROW)) player.x += 3;
  if (keyIsDown(UP_ARROW)) player.y -= 3;
  if (keyIsDown(DOWN_ARROW)) player.y += 3;

  // keep player inside canvas
  player.x = constrain(player.x, 0, width - 40);
  player.y = constrain(player.y, 50, height - 40);

  // Check if player reached the goal (use goal center)
  let goalCenterX = goal.x + 30;
  let goalCenterY = goal.y + 30;
  if (dist(player.x, player.y, goalCenterX, goalCenterY) < 40) {
    console.log("REACHED GOAL -> cutscene1");
    gameState = "cutscene1";
  }
}

function drawCutscene1() {
  background(100);
  if (cutscene1Img) image(cutscene1Img, width / 2 - 100, 100, 200, 200);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(16);
  text("Yeshi: What are you doing in the rain?", width / 2, 30);
}

function drawCutscene2() {
  background(100);
  if (cutscene2Img) image(cutscene2Img, width / 2 - 100, 100, 200, 200);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(16);
  text("Choose wisely!", width / 2, 30);

  fill(255);
  rect(150, 300, 100, 40);
  rect(350, 300, 100, 40);

  fill(0);
  textSize(12);
  text("None of your business", 200, 325);
  text("I Don't have a place to live.", 400, 325);
}

function drawCutscene3() {
  background(100);
  if (cutscene3Img) image(cutscene3Img, width / 2 - 100, 100, 200, 200);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(16);
  text("Yeshi: Do you want to go to my house for shelter.", width / 2, 30);
}

function drawQuiz() {
  background(150);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(16);
  text("DO you accept Yeshi's offer?", width / 2, 30);

  fill(255);
  rect(150, 300, 100, 40); // Option 1
  rect(350, 300, 100, 40); // Option 2

  fill(0);
  textSize(16);
  text("Accept Yeshi's offer", 200, 325);
  text("Decline Yeshi's offer", 400, 325);
}

// Cutscene 4 (base for 5/6/7)
function drawCutscene4() {
  if (insideImg) {
    image(insideImg, 0, 0, width, height);
  } else {
    background(80); // fallback
  }

  // Optional semi-transparent overlay for readability
  fill(0, 0, 0, 50);
  rect(0, 0, width, height);

  // Draw Mike on the left
  if (cutscene4Mike) {
    let w = 200;
    let h = 200;
    image(cutscene4Mike, 50, height / 2 - h / 2, w, h);
  } else {
    fill(255);
    rect(50, height / 2 - 100, 200, 200);
  }

  // Draw Yeshi on the right
  if (cutscene4Yeshi) {
    let w = 200;
    let h = 200;
    image(cutscene4Yeshi, width - 250, height / 2 - h / 2, w, h);
  } else {
    fill(255);
    rect(width - 250, height / 2 - 100, 200, 200);
  }

  // Text bar at the top
  fill(255);
  rect(0, 0, width, 50);

  // Text inside text bar
  fill(0);
  textAlign(CENTER);
  textSize(16);
  text("You: What are you doing?", width / 2, 30);
}

// Cutscene 5 - same as cutscene 4
function drawCutscene5() {
  if (insideImg) {
    image(insideImg, 0, 0, width, height);
  } else {
    background(80);
  }

  fill(0, 0, 0, 50);
  rect(0, 0, width, height);

  if (cutscene4Mike) {
    image(cutscene4Mike, 50, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(50, height / 2 - 100, 200, 200);
  }

  if (cutscene4Yeshi) {
    image(cutscene4Yeshi, width - 250, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(width - 250, height / 2 - 100, 200, 200);
  }

  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(16);
  text("Yeshi: I'm coding. Do you know how to code?", width / 2, 30);
}

// Cutscene 6 - same as cutscene 4
function drawCutscene6() {
  if (insideImg) {
    image(insideImg, 0, 0, width, height);
  } else {
    background(80);
  }

  fill(0, 0, 0, 50);
  rect(0, 0, width, height);

  if (cutscene4Mike) {
    image(cutscene4Mike, 50, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(50, height / 2 - 100, 200, 200);
  }

  if (cutscene4Yeshi) {
    image(cutscene4Yeshi, width - 250, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(width - 250, height / 2 - 100, 200, 200);
  }

  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(16);
  text("You: No, I don't.", width / 2, 30);
}

// Cutscene 7 - same as cutscene 4
function drawCutscene7() {
  if (insideImg) {
    image(insideImg, 0, 0, width, height);
  } else {
    background(80);
  }

  fill(0, 0, 0, 50);
  rect(0, 0, width, height);

  if (cutscene4Mike) {
    image(cutscene4Mike, 50, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(50, height / 2 - 100, 200, 200);
  }

  if (cutscene4Yeshi) {
    image(cutscene4Yeshi, width - 250, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(width - 250, height / 2 - 100, 200, 200);
  }

  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(16);
  text("Yeshi: Here let me teach how to.", width / 2, 30);
}

function mousePressed() {
  if (gameState === "start") {
    console.log("Starting game -> play");
    gameState = "play";

  } else if (gameState === "cutscene1") {
    console.log("cutscene1 -> cutscene2");
    gameState = "cutscene2";

  } else if (gameState === "cutscene2") {
    if (mouseX > 150 && mouseX < 250 && mouseY > 300 && mouseY < 340) {
      console.log("cutscene2 option1 -> cutscene3");
      gameState = "cutscene3";
    } else if (mouseX > 350 && mouseX < 450 && mouseY > 300 && mouseY < 340) {
      console.log("cutscene2 option2 -> cutscene3");
      gameState = "cutscene3";
    }

  } else if (gameState === "cutscene3") {
    console.log("cutscene3 -> quiz");
    gameState = "quiz";

  } else if (gameState === "quiz") {
    if (mouseX > 150 && mouseX < 250 && mouseY > 300 && mouseY < 340) {
      console.log("quiz wrong -> restart");
      player.set(100, 200);
      gameState = "start";
    } else if (mouseX > 350 && mouseX < 450 && mouseY > 300 && mouseY < 340) {
      console.log("quiz correct -> cutscene4");
      gameState = "cutscene4";
    }

  } else if (gameState === "cutscene4") {
    console.log("cutscene4 -> cutscene5");
    gameState = "cutscene5";

  } else if (gameState === "cutscene5") {
    console.log("cutscene5 -> cutscene6");
    gameState = "cutscene6";

  } else if (gameState === "cutscene6") {
    console.log("cutscene6 -> cutscene7");
    gameState = "cutscene7";

  } else if (gameState === "cutscene7") {
    console.log("cutscene7 -> play");
    gameState = "play";
  }
}
