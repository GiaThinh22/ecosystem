let envi = [], stars = [], clouds = [];// land-liquid-air array, stars array, clouds array
let cattails = [];// cattails array
let frogs, flies = [], fish = [];//frog and flies and fish array
let kingfisher;
let day = 0,dc = 2,time,timeString;// day and dayCount and time converted from day
let G; // gravity
let analyseMode = false,stopPressed = true,blackCoverAlpha = 0;//analyse mode components
let analyseArrow,analyseDatas = [];
let eatCount=0,pointsEarned = 0; // flies eaten counter and points earned
let seedReady = false;
let seed = "",seedComponents = [];
let  noiseOffsetCloudX = 0.0,noiseOffsetCloudY = 100.0;
let noiseOffsetMass = 75.0;
let  noiseOffsetFishX = 0.0,noiseOffsetFishY = 100.0,noiseOffsetColor = 50.0;
let invalidTimer = 0;
let worldReady = false;//status of the world generation
let messageTimer = 0;//timer for th message
let speacialWorld = false; //check if this is an easter egg world (intentional typo)

//3,6,29,4,20,151,14,46,11,4
//0x-1X-2aa-3y-4YY-5zzz-6ZZ-7NoiseSeed-8AA-9B
/*clouds 	x-type of clouds		X-amount		aa-size
  flies 		y-size				YY-amount
  cattails 	zzz-height			ZZ-amount
  fish      AA-amount       B-mass*/
let seedInputed = []; 
let input, button;

function generateSeed(){
  seedComponents[0] = round(random(1,3));//cloud type
  seedComponents[1] = round(random(5,9));//cloud amount
  seedComponents[2] = round(random(20,30));//cloud size
  seedComponents[3] = round(random(3,5));//fly size
  seedComponents[4] = round(random(15,25));//fly amount
  seedComponents[5] = round(random(150,170));//cattail height
  seedComponents[6] = round(random(10,15));//cattail amount
  seedComponents[7] = round(random(10,99));//noise seed
  seedComponents[8] = round(random(10,15));//fish amount
  seedComponents[9] = round(random(40,50));//fish size
  noiseSeed(seedComponents[7]);
  seed = str(seedComponents);
}

function generateEasterEgg(){//it's the easter egg seed
  speacialWorld = true;
  seedComponents[0] = 3;//cloud type
  seedComponents[1] = 50;//cloud amount
  seedComponents[2] = 30;//cloud size
  seedComponents[3] = 7;//fly size
  seedComponents[4] = 50;//fly amount
  seedComponents[5] = 200;//cattail height
  seedComponents[6] = 45;//cattail amount
  seedComponents[7] = 69;//noise seed
  seedComponents[8] = 30;//fish amount
  seedComponents[9] = 100;//fish size
  noiseSeed(seedComponents[7]);
  seed = str(seedComponents);
}

function resetEverything(){//setting every necessary variables back to original
  envi = [], stars = [], clouds = [];// land/liquid/air array, stars array, clouds array
  cattails = [];// cattails array
  kingfisher, frogs, flies = [], fish = [];//frog and flies array
  day = 0,dc = 2,time,timeString;// day and dayCount and time converted from day
  G; // gravity
  analyseMode = false,stopPressed = true,blackCoverAlpha = 0;//analyse mode components
  analyseArrow,analyseDatas = [];
  eatCount=0,pointsEarned = 0; // flies eaten counter and points earned
  seedReady = false;
  seed = "",seedComponents = [];
  noiseOffsetCloudX = 0.0,noiseOffsetCloudY = 100.0;
  noiseOffsetMass = 75.0;
  noiseOffsetFishX = 0.0, noiseOffsetFishY = 100.0, noiseOffsetColor = 50.0;
  invalidTimer = 0;
  worldReady = false;
  speacialWorld = false;
}

function setup() {
  createCanvas(600, 350);

  //inputting seed system
  input = createInput('random');
  button = createButton("submit");
  button.mouseClicked(submitted);
}

function submitted(){//button function
  //get the seed from the input 
  let inputList = input.value();
  seedInputed = inputList.split(',').map(item => item.trim());
  //randomize seed
  if(seedInputed[0] === "random"){
    resetEverything();
    generateSeed();
    input.value(seedComponents);
    seedReady = true;
    return;
  }
  if(seedInputed[0] === "easter_egg_pretty_please"){
    resetEverything();
    generateEasterEgg();
    input.value("nice crtl+f skill");
    seedReady = true;
    return;
  }
  //checking valid input
  if (seedInputed.length === 10) {
    let validSeed =
      checkInRange(1,3,seedInputed[0]) &&
      checkInRange(5,9,seedInputed[1]) &&
      checkInRange(20,30,seedInputed[2]) &&
      checkInRange(3,5,seedInputed[3]) &&
      checkInRange(15,25,seedInputed[4]) &&
      checkInRange(150,170,seedInputed[5]) &&
      checkInRange(10,15,seedInputed[6]) &&
      checkInRange(10,99,seedInputed[7]) &&
      checkInRange(10,15,seedComponents[8]) &&
      checkInRange(40,50,seedComponents[9]);

    if(validSeed){
      resetEverything();
      copyArray(10);
      input.value(seedComponents);
      seedReady = true;
    } else {
      seedReady = false;
      seedInputed = [];
      input.value("");
      invalidTimer =100;

    }
  } 
  else {
    seedReady = false;
    seedInputed = [];
    input.value("");
    invalidTimer = 100;
  }

}
function instructionMessage(){
  //just the instructions
  if(invalidTimer<=1){
    push();
    textSize(20);
    fill(255);
    textAlign(CENTER);
    text("You control a frog in a swamp",width/2,30);
    text("Jumping to flies allows you to convert them to points",width/2,60);

    text("T to switch ANALYSE MODE on/off",width/2,120);
    text("Q to swap between AUTO MODE and CONTROL MODE",width/2,150);
    text("A and D to look left and right, W to jump in CONTROL MODE",width/2,180);
    text("S to switch to STINKY MODE and attract flies",width/2,210);
    text("However, you are unable to move and points are rapidly consumed",width/2,240);
    text("The kingfisher will try to steal your points",width/2,270);
    text("If you ran out of points, you'll die",width/2,300);
    fill(0,frameCount%150 + 150,0);
    text("Input a seed to begin the process",width/2,330);
    pop();
  }
}
function showInvalidMessage() {
  push();
  textSize(20);
  fill(255);
  textAlign(CENTER);
  if(invalidTimer>0){
    if(!speacialWorld){
      text("Invalid seed", width/2, height/3);
      text("Type random to generate random seed", width/2, height/2);
    }
    else{
      text("What an experience.",width/2,height/2);
    }
  }

  pop();
}
function copyArray(length) {
  //function made to copy an array to another array duh
  for (let i = 0; i < length; i++) {
    seedComponents[i] = seedInputed[i];
  }
  seed = str(seedComponents);
}
function checkInRange(min, max, value) {
  //function made to check if a value is in a certain range
  let num = parseInt(value);
  return !isNaN(num) && num >= min && num <= max;
}

function generateWorld(){
  //it is time to generate the swamp
  G =  0.5;
  generateCloud();
  generateStar();
  generatePlants();
  generateAnimals();
  generateEnvironment();
  generateFish();
}
function generateEnvironment(){
  envi[0] = new env(0,250,350,height,true,false,false);//ground
  envi[1] = new env(350,250,width,height,false,true,false);//water
  envi[2] = new env(0,0,width,height,false,false,true);//air
  envi[3] = new env(340,350,width,height,true,false,false);//ground under water
  envi[4] = new env(350,340,50,10,false,false,false); //jumping pad
}
function generateAnimals(){
  frogs = new frog(200,100,1.5,3);
  kingfisher = new bird(width-20,50);
  analyseArrow = new vectorArrows(frogs);
  for(let f = 0; f<seedComponents[4];f++){
    flies[f] = new fly(random(10,80),random(100,200),seedComponents[3],0.05);
  }
}
function generatePlants(){
    for(let s = 0; s<seedComponents[6]; s++){
    cattails[s] = new cattail(10+7*s,300,random(-5,5),-1*seedComponents[5]);
  }
}
function generateStar(){
  for(let s = 0; s<30; s++){
    stars[s] = new STAR(random(0,600),random(0,240),random(0.5,5));
  }
}
function generateCloud(){
  //random x y with noise
  for(let c = 0; c<seedComponents[1]; c++){
    let x = noise(noiseOffsetCloudX) * width;
    noiseOffsetCloudX += 5;

    let y = noise(noiseOffsetCloudY) * 110 + 10;
    noiseOffsetCloudY += 5; 

    clouds[c] = new cloud(x,y,seedComponents[2],seedComponents[0]);
  }
}
function generateFish(){
  //random x y with noise
  for(let f = 0; f<seedComponents[8]; f++){
    let x = noise(noiseOffsetFishX) * (width-350) + 350;
    noiseOffsetFishX+=5;

    let y = noise(noiseOffsetFishY) * (height-220) + 250; 
    noiseOffsetFishY+=5;

    let m = noise(noiseOffsetMass) * seedComponents[9];
    noiseOffsetMass+=5;

    let color = noise(noiseOffsetColor)*100 + 150;
    noiseOffsetColor+=0.1;

    fish[f] = new fishs(x,y,m,f,color);
  }
}
function draw() {

  if(!seedReady){//inputting screen
    background(0);
    instructionMessage();
      showInvalidMessage();
  invalidTimer--;
  }

  if(seedReady == true){
      showInvalidMessage();
    invalidTimer--;
    if(!worldReady){//generate the world when seed is ready
        generateWorld();
        worldReady = true;
    }

      background(20, 20, 60);
    //run the world

    environment();

    //draw the branch
    push();
    fill(79,46,40);
    rect(width-70,150,70,10);
    pop();
    //

    UI();
    checkAnalyse();
    animals();
    mainObjects();  

    //death message appearing if it is
    messageTimer-=1;
    deathMessage();
  }
}
function mainObjects(){//analyse mode objects

  if(analyseMode){
    analyseArrow.show();
  }
  analyseDatas[0] = new data(width-50,50,timeString,20);
  for(let aD of analyseDatas){
    aD.show();
  }
}
function animals(){//the living animals
  kingfisher.update();
  kingfisher.show();
  frogs.update();
  frogs.show();
  for(let ff of fish){
    ff.update();
    ff.show();
  }

  for(let f of flies){
    f.checkEaten();
    f.update();
    f.show();
  }
}
function UI(){//ui text shown near the screen's edges
  push();
  if(day>100){
    fill(0);
  }
  else{
    fill(255);
  }
  textSize(20);
  if(frogs.pecked){
    if(pointsEarned<0.9){// 1
      submitted();
      messageTimer = 120;
    }
    fill("red");
    pointsEarned-=0.1;
    pointsEarned = max(pointsEarned,0); //set to 0
  }
  if(!speacialWorld){
    text("Score: "+floor(pointsEarned)+"    Seed:" + seed, 20,30);
  }
  else{
    text("Score: "+floor(pointsEarned)+"    SPECIAL WORLD", 20,30);
  }

if(frogs.mode==1){
    text("AUTO mode",20,50);
  }
  else if(frogs.mode == 2){
    text("CONTROL mode",20,50);
  }
  else if(frogs.mode == 3){
    text("STINKY mode",20,50);
  }

  pop();
}
function environment(){//the land air water, stars, day/night cycle
  //air
  envi[2].show();
  //clouds
  for(let cs of clouds){
    cs.show();
  }
  //catttails
  for(let c of cattails){
    c.update();
  }
  //ground

  envi[1].show();
  envi[3].show();
  envi[0].show();

  
  //stars
  for(let s of stars){
    s.show();
  }
  //time
  day+=dc;
  if(day >= 400 && dc > 0){
    dc*=-1;
  }
  if(day <= -200 && dc < 0){
    dc*=-1;
  }
  time = (day+200)/50;
  if(dc<0){
    time = 12-time;
    if(350<=day&&day<=400){
      time=time+12;
    }
  }
  if(day==-200){
    time = 0;
  }
  if(day%10==0){
    if(dc>0){
      timeString = int(time)/* + ":" + round((time-int(time))*60)*/+"am";
    }
    if(dc<0){
      timeString = int(time)/* + ":" + round((time-int(time))*60)*/+"pm";
    }
  }
}

function checkAnalyse(){//checking analyse mode toggled or not
  if(keyIsPressed&&key == "t"&&!analyseMode&&stopPressed&&blackCoverAlpha<=10){
    analyseMode = true;
    stopPressed = false;
  }
  if(keyIsPressed&&key=="t"&&analyseMode&&stopPressed&&blackCoverAlpha>=130){
    stopPressed = false;
    analyseMode = false;
  }
  if(!keyIsPressed){
    stopPressed = true;
  }
  if(analyseMode && blackCoverAlpha<=140){blackCoverAlpha+=5;}
  else if(!analyseMode&&blackCoverAlpha>=0){blackCoverAlpha-=5;}
  push();
  fill(0,0,0,blackCoverAlpha);
  rect(0,0,width,height);
  if(analyseMode){
    fill("red");
    textStyle(BOLDITALIC);
    textSize(18);
    textAlign(RIGHT)
    if(frameCount%60<=29){ //flash "analyse mode" every 0.5s
      text("ANALYSE MODE",width-10,20);
    }
  }
  pop();
}

function deathMessage(){//check if the frog died
  if(messageTimer>0){
      push();
      fill(0,0,0,messageTimer*10)
      textAlign(CENTER);
      textSize(30);
      text("WORLD RESET", width/2,height/2-40);
      text("YOU DIED",width/2,height/2+40);
      pop();
  }
  messageTimer = max(messageTimer,0); //set 0
}
