let playerImg, goalImg, cutscene1Img, cutscene2Img, cutscene3Img;
let cutscene4Mike, cutscene4Yeshi, insideImg;
let player;
let goal;
let obstacles = [];
let gameState = "start";

// Quiz questions and tracking
let quiz2Questions = [];
let quiz2Index = 0;
let quiz2Score = 0;

let quiz3Questions = [];
let quiz3Index = 0;
let quiz3Score = 0;

let quiz4Questions = [];
let quiz4Index = 0;
let quiz4Score = 0;

// Mini-game
let codePieces = ["let", "x", "=", "10;"];
let collectedPieces = [];
let foundAllPieces = false;
let piecePositions = [];

// Leveling system
let playerLevel = 1;
let playerXP = 0;
let xpToLevel = 5;
let lastLevelUpTime = 0;
let showLevelUpFlash = false;

// Completion flags
let completedQuiz2 = false;
let completedQuiz3 = false;
let completedQuiz4 = false;
let completedMinigame = false;

function preload() {
  playerImg = loadImage('Mike.png');
  goalImg = loadImage('Yeshihouse.jpeg');
  cutscene1Img = loadImage('Yeshi.jpg');
  cutscene2Img = loadImage('Mike.png');
  cutscene3Img = loadImage('Yeshi.jpg');
  insideImg = loadImage('Inside.jpeg');
  cutscene4Mike = loadImage('Mike.png');
  cutscene4Yeshi = loadImage('Yeshi.jpg');
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

  quiz2Questions = [
    { q: "What does Yeshi teach Mike first?", options: ["How to cook", "How to code", "How to sleep"], correct: 1 },
    { q: "Which key moves a character left?", options: ["LEFT_ARROW", "UP_ARROW", "SPACE"], correct: 0 },
    { q: "If someone helps you, a good response is:", options: ["Run away", "Be rude", "Be grateful and learn"], correct: 2 }
  ];
  quiz3Questions = [
    { q: "What is Mike's ultimate goal in the game?", options: ["To eat food", "To find a home", "To learn coding"], correct: 2 },
    { q: "An array in JavaScript begins with index:", options: ["0", "1", "random number"], correct: 0 },
    { q: "In JavaScript, which method can remove the last item of an array?", options: ["remove()", "pop()", "delete()"], correct: 1 }
  ];
  quiz4Questions = [
    { q: "How do you declare a constant in JavaScript?", options: ["let", "const", "var"], correct: 1 },
    { q: "Which method turns a string into an array?", options: ["split()", "divide()", "separate()"], correct: 0 },
    { q: "What does JSON stand for?", options: ["JavaScript Object Notation", "Java Serializable Object Notation", "Java Standard Object Notation"], correct: 0 }
  ];

  resetMiniGamePieces();
  textFont('Arial');
  textAlign(CENTER, CENTER);
}

function resetMiniGamePieces() {
  piecePositions = [];
  collectedPieces = [];
  foundAllPieces = false;
  for (let i = 0; i < codePieces.length; i++) {
    piecePositions.push(createVector(random(50, 550), random(50, 350)));
  }
}

function draw() {
  background(220);

  switch (gameState) {
    case "start":
      drawStartScreen();
      break;
    case "play":
      drawPlayScreen();
      break;
    case "cutscene1":
      drawCutscene1();
      break;
    case "cutscene2":
      drawCutscene2();
      break;
    case "cutscene3":
      drawCutscene3();
      break;
    case "quiz":
      drawQuiz();
      break;
    case "cutscene4":
      drawCutscene4();
      break;
    case "cutscene5":
      drawCutscene5();
      break;
    case "cutscene6":
      drawCutscene6();
      break;
    case "cutscene7":
      drawCutscene7();
      break;
    case "quiz2":
      drawQuiz2();
      break;
    case "quiz3":
      drawQuiz3();
      break;
    case "congratulations":
      drawCongratulationsScreen();
      break;
    case "minigame":
      drawCodeMiniGame();
      break;
    case "quiz4":
      drawQuiz4();
      break;
    case "finale":
      drawFinaleScreen();
      break;
  }

  drawLevelUI();

  if (showLevelUpFlash && millis() - lastLevelUpTime > 1000) {
    showLevelUpFlash = false;
  }
}

///////////////
// Helper functions for consistent styling
///////////////

function drawCutsceneText(textStr) {
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text(textStr, width / 2, height / 2);
}

function drawQuestionPrompt(textStr) {
  fill(255, 215, 0);
  textAlign(CENTER, TOP);
  textSize(24);
  text(textStr, width / 2, 30);
}

function drawAnswerBox(x, y, w, h, textStr) {
  fill(255);
  rect(x, y, w, h, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(textStr, x + w / 2, y + h / 2);
}

///////////////
// Drawing screens
///////////////

function drawStartScreen() {
  background(50, 100, 200);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Welcome to the Game!", width / 2, height / 2 - 20);
  textSize(20);
  text("Click to Start", width / 2, height / 2 + 30);
}

function drawPlayScreen() {
  background(200);

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

  if (keyIsDown(LEFT_ARROW)) player.x -= 3;
  if (keyIsDown(RIGHT_ARROW)) player.x += 3;
  if (keyIsDown(UP_ARROW)) player.y -= 3;
  if (keyIsDown(DOWN_ARROW)) player.y += 3;

  player.x = constrain(player.x, 0, width - 40);
  player.y = constrain(player.y, 50, height - 40);

  let goalCenterX = goal.x + 30;
  let goalCenterY = goal.y + 30;
  if (dist(player.x, player.y, goalCenterX, goalCenterY) < 40) {
    console.log("REACHED GOAL -> cutscene1");
    gameState = "cutscene1";
  }
}

function drawCutscene1() {
  if (cutscene1Img) image(cutscene1Img, width / 2 - 100, 100, 200, 200);
  drawCutsceneText("Yeshi: What are you doing in the rain?");
}

function drawCutscene2() {
  if (cutscene2Img) image(cutscene2Img, width / 2 - 100, 100, 200, 200);
  drawCutsceneText("Choose wisely!");

  let btnWidth = 220;
  let btnHeight = 50;
  let spacing = 40;
  let startX = (width - (btnWidth * 2 + spacing)) / 2;
  let btnY = 300;

  drawAnswerBox(startX, btnY, btnWidth, btnHeight, "None of your business");
  drawAnswerBox(startX + btnWidth + spacing, btnY, btnWidth, btnHeight, "I Don't have a place to live.");
}

function drawCutscene3() {
  if (cutscene3Img) image(cutscene3Img, width / 2 - 100, 100, 200, 200);
  drawCutsceneText("Yeshi: Do you want to go to my house for shelter?");
}

function drawQuiz() {
  drawQuestionPrompt("Do you accept Yeshi's offer?");
  let btnWidth = 220;
  let btnHeight = 50;
  let spacing = 40;
  let startX = (width - (btnWidth * 2 + spacing)) / 2;
  let btnY = 300;

  drawAnswerBox(startX, btnY, btnWidth, btnHeight, "Decline Yeshi's offer");
  drawAnswerBox(startX + btnWidth + spacing, btnY, btnWidth, btnHeight, "Accept Yeshi's offer");
}

function drawCutscene4() {
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

  drawCutsceneText("You: What are you doing?");
}

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

  drawCutsceneText("Yeshi: I'm coding. Do you know how to code?");
}

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

  drawCutsceneText("You: No, I don't.");
}

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

  drawCutsceneText("Yeshi: Here let me teach you. Click to start a quiz.");
}

function drawQuiz2() {
  background(30, 120, 80);
  let qObj = quiz2Questions[quiz2Index];

  drawQuestionPrompt("Question " + (quiz2Index + 1) + " of " + quiz2Questions.length);
  fill(255);
  textSize(24);
  text(qObj.q, width / 2, 120);

  let btnWidth = 180;
  let btnHeight = 40;
  let spacing = 30;
  let startX = (width - (btnWidth * qObj.options.length + spacing * (qObj.options.length - 1))) / 2;
  let btnY = 220;

  for (let i = 0; i < qObj.options.length; i++) {
    drawAnswerBox(startX + i * (btnWidth + spacing), btnY, btnWidth, btnHeight, qObj.options[i]);
  }

  fill(255);
  textSize(18);
  textAlign(RIGHT, TOP);
  text("Score: " + quiz2Score, width - 20, 10);
}

function drawQuiz3() {
  background(30, 150, 100);
  let qObj = quiz3Questions[quiz3Index];

  drawQuestionPrompt("Question " + (quiz3Index + 1) + " of " + quiz3Questions.length);
  fill(255);
  textSize(24);
  text(qObj.q, width / 2, 120);

  let btnWidth = 180;
  let btnHeight = 40;
  let spacing = 30;
  let startX = (width - (btnWidth * qObj.options.length + spacing * (qObj.options.length - 1))) / 2;
  let btnY = 220;

  for (let i = 0; i < qObj.options.length; i++) {
    drawAnswerBox(startX + i * (btnWidth + spacing), btnY, btnWidth, btnHeight, qObj.options[i]);
  }

  fill(255);
  textSize(18);
  textAlign(RIGHT, TOP);
  text("Score: " + quiz3Score, width - 20, 10);
}

function drawQuiz4() {
  background(60, 160, 100);
  let qObj = quiz4Questions[quiz4Index];

  drawQuestionPrompt("Final Quiz: Question " + (quiz4Index + 1) + " of " + quiz4Questions.length);
  fill(255);
  textSize(24);
  text(qObj.q, width / 2, 120);

  let btnWidth = 180;
  let btnHeight = 40;
  let spacing = 30;
  let startX = (width - (btnWidth * qObj.options.length + spacing * (qObj.options.length - 1))) / 2;
  let btnY = 220;

  for (let i = 0; i < qObj.options.length; i++) {
    drawAnswerBox(startX + i * (btnWidth + spacing), btnY, btnWidth, btnHeight, qObj.options[i]);
  }

  fill(255);
  textSize(18);
  textAlign(RIGHT, TOP);
  text("Score: " + quiz4Score, width - 20, 10);
}

function drawCongratulationsScreen() {
  background(100, 200, 150);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Congratulations!", width / 2, height / 2 - 40);
  textSize(20);
  text("You completed Yeshi’s lessons and quizzes.", width / 2, height / 2);
  text("Click to begin your first coding mini-game.", width / 2, height / 2 + 40);
}

function drawCodeMiniGame() {
  background(180, 220, 180);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);

  let isCorrect = false;

  if (!foundAllPieces) {
    text("Find all pieces of code!", width / 2, 30);

    for (let i = 0; i < codePieces.length; i++) {
      if (!collectedPieces.includes(codePieces[i])) {
        let pos = piecePositions[i];
        fill(200);
        rect(pos.x, pos.y, 60, 30, 5);
        fill(0);
        textSize(14);
        text(codePieces[i], pos.x + 30, pos.y + 15);
      }
    }
  } else {
    const arrangement = collectedPieces.join(" ");
    text("Arrange the pieces: " + arrangement, width / 2, 30);
    if (arrangement === "let x = 10;") {
      isCorrect = true;
      text("Correct Code!", width / 2, height - 30);
    } else {
      text("Not quite—try reordering.", width / 2, height - 30);
      resetMiniGamePieces();  // Resets all pieces if the order is wrong
    }
  }

  const btnX = width / 2 - 60, btnY = height - 64, btnW = 120, btnH = 44;
  if (isCorrect) {
    fill(70, 180, 90);
  } else {
    fill(180);
  }
  rect(btnX, btnY, btnW, btnH, 10);
  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Finish", width / 2, btnY + btnH / 2);
}

function drawLevelUI() {
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Level: ${playerLevel}  XP: ${playerXP} / ${xpToLevel}`, 10, 10);

  if (showLevelUpFlash) {
    push();
    textAlign(CENTER, CENTER);
    stroke(0, 180);
    strokeWeight(6);
    fill(255, 215, 0, 230);
    textSize(48);
    text("LEVEL UP!", width / 2, height / 2);
    pop();
  }
}

function drawFinaleScreen() {
  background(30, 45, 60);

  noStroke();
  fill(255, 255, 255, 16);
  rect(0, 0, width, height);
  fill(255);
  rect(width / 2 - 260, 70, 520, 220, 12);

  fill(0);
  textAlign(CENTER, TOP);
  textSize(24);
  text("Yeshi’s Compassion • Mike’s Success", width / 2, 90);

  textSize(15);
  text(
    "Guided by Yeshi’s kindness and patient mentorship, Mike learned to code,\n" +
    "passed the quizzes, and completed his first program.\n\n" +
    "What began as shelter in the rain became a new life—\n" +
    "proof that compassion and skill can lift someone from destitution\n" +
    "to dignity and purpose.",
    width / 2, 130
  );

  textSize(13);
  text(`Quizzes: ${quiz2Score}/${quiz2Questions.length} & ${quiz3Score}/${quiz3Questions.length} & ${quiz4Score}/${quiz4Questions.length}   •   Level ${playerLevel}`, width / 2, 230);

  textSize(16);
  text("Click anywhere to play again", width / 2, 268);
}

function mousePressed() {
  switch (gameState) {
    case "start":
      gameState = "play";
      break;
    case "cutscene1":
      gameState = "cutscene2";
      break;
    case "cutscene2":
    case "quiz":
      let btnWidth = 220;
      let btnHeight = 50;
      let spacing = 40;
      let startX = (width - (btnWidth * 2 + spacing)) / 2;
      let btnY = 300;

      if (mouseX > startX && mouseX < startX + btnWidth && mouseY > btnY && mouseY < btnY + btnHeight) {
        player.set(100, 200);
        gameState = "start";
      } else if (mouseX > startX + btnWidth + spacing && mouseX < startX + btnWidth * 2 + spacing && mouseY > btnY && mouseY < btnY + btnHeight) {
        gameState = gameState === "quiz" ? "cutscene4" : "cutscene3";
      }
      break;
    case "cutscene3":
      gameState = "quiz";
      break;
    case "cutscene4":
      gameState = "cutscene5";
      break;
    case "cutscene5":
      gameState = "cutscene6";
      break;
    case "cutscene6":
      gameState = "cutscene7";
      break;
    case "cutscene7":
      quiz2Index = quiz2Score = 0;
      gameState = "quiz2";
      break;
    case "quiz2":
      handleQuizInput(quiz2Questions, quiz2Index, "quiz3");
      break;
    case "quiz3":
      handleQuizInput(quiz3Questions, quiz3Index, "congratulations");
      break;
    case "congratulations":
      gameState = "minigame";
      break;
    case "minigame":
      handleMiniGameMouse();
      break;
    case "quiz4":
      handleQuizInput(quiz4Questions, quiz4Index, "finale");
      break;
    case "finale":
      resetGame();
      break;
  }
}

function handleQuizInput(questions, index, nextState) {
  const btnWidth = 180;
  const btnHeight = 40;
  const spacing = 30;
  const qObj = questions[index];
  const startX = (width - (btnWidth * qObj.options.length + spacing * (qObj.options.length - 1))) / 2;
  const btnY = 220;

  for (let i = 0; i < qObj.options.length; i++) {
    const x = startX + i * (btnWidth + spacing);
    if (mouseX > x && mouseX < x + btnWidth && mouseY > btnY && mouseY < btnY + btnHeight) {
      if (i !== qObj.correct) {
        player.set(100, 200);
        gameState = "start";
      } else {
        playerXP++;
        if (playerXP >= xpToLevel) {
          playerLevel++;
          playerXP = 0;
          showLevelUpFlash = true;
          lastLevelUpTime = millis();
        }

        switch (gameState) {
          case "quiz2":
            quiz2Score++;
            quiz2Index++;
            if (quiz2Index >= questions.length) {
              completedQuiz2 = true;
              gameState = nextState;
            }
            break;
          case "quiz3":
            quiz3Score++;
            quiz3Index++;
            if (quiz3Index >= questions.length) {
              completedQuiz3 = true;
              gameState = nextState;
            }
            break;
          case "quiz4":
            quiz4Score++;
            quiz4Index++;
            if (quiz4Index >= questions.length) {
              completedQuiz4 = true;
              gameState = nextState;
            }
            break;
        }
      }
      break;
    }
  }
}

function handleMiniGameMouse() {
  if (!foundAllPieces) {
    for (let i = 0; i < codePieces.length; i++) {
      let pos = piecePositions[i];
      if (mouseX > pos.x && mouseX < pos.x + 60 && mouseY > pos.y && mouseY < pos.y + 30) {
        if (!collectedPieces.includes(codePieces[i])) {
          collectedPieces.push(codePieces[i]);
          if (collectedPieces.length >= codePieces.length) {
            foundAllPieces = true;
          }
        }
      }
    }
  }

  const btnX = width / 2 - 60, btnY = height - 64, btnW = 120, btnH = 44;
  const clickedFinish = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;

  if (clickedFinish && foundAllPieces && collectedPieces.join(" ") === "let x = 10;") {
    completedMinigame = true;
    if (completedQuiz2 && completedQuiz3 && completedMinigame) {
      gameState = "quiz4";
    }
  }
}

function resetGame() {
  player.set(100, 200);

  quiz2Index = quiz3Index = quiz4Index = 0;
  quiz2Score = quiz3Score = quiz4Score = 0;

  resetMiniGamePieces();

  completedQuiz2 = completedQuiz3 = completedMinigame = completedQuiz4 = false;

  gameState = "start";
}
