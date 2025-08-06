let playerImg, goalImg, cutscene1Img, cutscene2Img, cutscene3Img;
let cutscene4Mike, cutscene4Yeshi, insideImg;
let player;
let goal;
let obstacles = [];
let gameState = "start";

// quiz2: three-question quiz after cutscene7
let quiz2Questions = [];
let quiz2Index = 0;
let quiz2Score = 0;

// mini-game (educational) - single randomized question shown after quiz2 finishes
let miniGamePool = [];
let miniGameQuestion = "";
let miniGameOptions = [];
let miniGameCorrectIndex = 0;

// Leveling / XP system
let playerLevel = 1;
let playerXP = 0;
let xpToLevel = 5; // starting threshold
let lastLevelUpTime = 0; // for simple level-up flash timing
let showLevelUpFlash = false;
let lastXPTime = 0; // track when XP was last awarded

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

  // Initialize the three-question quiz (quiz2)
  quiz2Questions = [
    {
      q: "What does Yeshi teach Mike first?",
      options: ["How to cook", "How to code", "How to sleep"],
      correct: 1
    },
    {
      q: "Which key moves a character left?",
      options: ["LEFT_ARROW", "UP_ARROW", "SPACE"],
      correct: 0
    },
    {
      q: "If someone helps you, a good response is:",
      options: ["Run away", "Be rude", "Be grateful and learn"],
      correct: 2
    }
  ];
  quiz2Index = 0;
  quiz2Score = 0;

  // Educational mini-game pool (multiple possible questions, one is chosen randomly)
  miniGamePool = [
    {
      q: "What does HTML stand for?",
      options: [
        "HyperText Markup Language",
        "HighText Machine Learning",
        "Hyperlink and Text Management Language"
      ],
      correct: 0
    },
    {
      q: "Which language is used to style web pages?",
      options: ["Python", "CSS", "C++"],
      correct: 1
    },
    {
      q: "Which symbol is used to end a statement in JavaScript?",
      options: [";", ":", ","],
      correct: 0
    }
  ];
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
  } else if (gameState === "quiz2") {
    drawQuiz2();
  } else if (gameState === "minigame") {
    drawMiniGame();
  }

  // draw level UI on every frame if appropriate (drawLevelUI handles visibility)
  drawLevelUI();

  // level up flash timer (show flash for 1 second)
  if (showLevelUpFlash && millis() - lastLevelUpTime > 1000) {
    showLevelUpFlash = false;
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
  text("Decline Yeshi's offer", 200, 325);
  text("Accept Yeshi's offer", 400, 325);
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

  // hint to click to continue to the 3-question quiz
  textSize(12);
  text("Click to begin a short 3-question quiz", width / 2, 70);
}

// ===== quiz2 (three questions) =====
function drawQuiz2() {
  background(30, 120, 80);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(18);

  let qObj = quiz2Questions[quiz2Index];
  text("Question " + (quiz2Index + 1) + " of " + quiz2Questions.length, width / 2, 30);
  textSize(20);
  text(qObj.q, width / 2, 120);

  // draw option boxes
  let ox1 = 100;
  let oy = 220;
  let ow = 180;
  let oh = 50;

  // Option 0 (left)
  fill(255);
  rect(ox1, oy, ow, oh);
  // Option 1 (right)
  rect(ox1 + ow + 40, oy, ow, oh);
  // Option 2 (center below)
  if (qObj.options.length === 3) {
    rect(width / 2 - ow / 2, oy + 80, ow, oh);
  }

  // option text
  fill(0);
  textSize(14);
  text(qObj.options[0], ox1 + ow / 2, oy + oh / 2 + 5);
  text(qObj.options[1], ox1 + ow + 40 + ow / 2, oy + oh / 2 + 5);
  if (qObj.options.length === 3) {
    text(qObj.options[2], width / 2, oy + 80 + oh / 2 + 5);
  }

  // score display
  textSize(14);
  text("Score: " + quiz2Score, width - 70, 30);
}

// ===== mini-game (educational) =====
function drawMiniGame() {
  background(180, 220, 180);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(18);
  text("Mini Lesson", width / 2, 30);

  textSize(20);
  text(miniGameQuestion, width / 2, 120);

  // Draw options vertically
  let ox = 100;
  let oy = 180;
  let ow = 400;
  let oh = 50;
  for (let i = 0; i < miniGameOptions.length; i++) {
    fill(255);
    rect(ox, oy + i * 80, ow, oh);
    fill(0);
    textSize(16);
    text(miniGameOptions[i], ox + ow / 2, oy + i * 80 + oh / 2 + 6);
  }

  textSize(14);
  text("Choose the correct definition to continue.", width / 2, height - 30);
}

// draw level / xp UI (only visible after gaining XP or during level-up flash)
function drawLevelUI() {
  // Show UI only for 3 seconds after XP gain or while level-up flash is active
  if (millis() - lastXPTime > 3000 && !showLevelUpFlash) {
    return; // don't draw anything if no recent XP and not flashing
  }

  // background box
  fill(255, 240);
  rect(width - 170, 10, 160, 70, 6);

  // level text
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("Level: " + playerLevel, width - 150, 30);

  // XP bar
  let barX = width - 150;
  let barY = 40;
  let barW = 120;
  let barH = 14;
  stroke(0);
  noFill();
  rect(barX, barY, barW, barH);
  noStroke();
  // fill based on percentage
  let pct = constrain(playerXP / xpToLevel, 0, 1);
  fill(100, 200, 100);
  rect(barX, barY, barW * pct, barH);

  fill(0);
  textSize(12);
  textAlign(LEFT);
  text(playerXP + " / " + xpToLevel + " XP", barX, barY + barH + 12);

  // level-up flash
  if (showLevelUpFlash) {
    fill(255, 220, 0, 180);
    rect(0, 0, width, height);
    fill(0);
    textAlign(CENTER);
    textSize(32);
    text("Level Up!", width / 2, height / 2);
  }

  textAlign(CENTER); // reset
}

// handle leveling up: call after awarding XP
function awardXP(amount) {
  if (amount <= 0) return;
  playerXP += amount;
  lastXPTime = millis(); // show level UI for a short time

  // possibly multiple levels at once
  while (playerXP >= xpToLevel) {
    playerXP -= xpToLevel;
    playerLevel++;
    // increase threshold for next level (simple formula)
    xpToLevel = floor(xpToLevel * 1.4) + 2;
    // show flash
    showLevelUpFlash = true;
    lastLevelUpTime = millis();
    console.log("Level Up! new level:", playerLevel, "next xpToLevel:", xpToLevel);
  }
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
      console.log("quiz correct -> cutscene4 (old). In this flow we'll go to cutscene4 only after the mini-game runs.");
      // Keep original behavior for acceptance to proceed into cutscenes directly
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
    // Start the 3-question quiz after cutscene7
    console.log("cutscene7 -> quiz2 (3-question quiz)");
    quiz2Index = 0;
    quiz2Score = 0;
    gameState = "quiz2";

  } else if (gameState === "quiz2") {
    // handle option selection for quiz2
    let qObj = quiz2Questions[quiz2Index];
    let ox1 = 100;
    let oy = 220;
    let ow = 180;
    let oh = 50;

    let selected = -1;
    // Option 0 bounds
    if (mouseX > ox1 && mouseX < ox1 + ow && mouseY > oy && mouseY < oy + oh) {
      selected = 0;
    }
    // Option 1 bounds
    else if (mouseX > ox1 + ow + 40 && mouseX < ox1 + ow + 40 + ow && mouseY > oy && mouseY < oy + oh) {
      selected = 1;
    }
    // Option 2 bounds (if exists)
    else if (qObj.options.length === 3 && mouseX > width / 2 - ow / 2 && mouseX < width / 2 + ow / 2 && mouseY > oy + 80 && mouseY < oy + 80 + oh) {
      selected = 2;
    }

    if (selected !== -1) {
      console.log("quiz2 selected option:", selected);
      if (selected === qObj.correct) {
        quiz2Score++;
        console.log("quiz2 correct! score:", quiz2Score);
      } else {
        console.log("quiz2 incorrect. correct was:", qObj.correct);
      }

      // move to next question or finish
      quiz2Index++;
      if (quiz2Index >= quiz2Questions.length) {
        console.log("quiz2 finished. final score:", quiz2Score);
        // Award XP slowly for quiz2: each correct = 1 XP
        awardXP(quiz2Score);
        // After completing quiz2, go to the educational mini-game
        // select a random mini-game question from the pool
        let idx = floor(random(miniGamePool.length));
        miniGameQuestion = miniGamePool[idx].q;
        miniGameOptions = miniGamePool[idx].options.slice(); // copy
        miniGameCorrectIndex = miniGamePool[idx].correct;
        console.log("starting mini-game question:", miniGameQuestion);
        gameState = "minigame";
      } else {
        // continue to next question (draw will update)
      }
    }

  } else if (gameState === "minigame") {
    // handle mini-game option clicks
    let ox = 100;
    let oy = 180;
    let ow = 400;
    let oh = 50;
    let selected = -1;
    for (let i = 0; i < miniGameOptions.length; i++) {
      if (mouseX > ox && mouseX < ox + ow && mouseY > oy + i * 80 && mouseY < oy + i * 80 + oh) {
        selected = i;
        break;
      }
    }

    if (selected !== -1) {
      console.log("mini-game selected:", selected);
      if (selected === miniGameCorrectIndex) {
        console.log("mini-game correct -> award xp and cutscene4");
        // award small XP for completing the mini-game
        awardXP(2); // mini-game gives 2 XP (faster leveling but still gradual)
        // proceed to cutscene4
        gameState = "cutscene4";
      } else {
        console.log("mini-game incorrect -> restart");
        // reset player and restart game
        player.set(100, 200);
        gameState = "start";
      }
    }

  }
}
