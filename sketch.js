let envi = [], stars = [], clouds = [];// land/liquid/air array, stars array, clouds array
let cattails = [];// cattails array
let frogs, flies = [], fish = [];//frog and flies and fish array
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
let worldReady = false;
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

function resetEverything(){
  envi = [], stars = [], clouds = [];// land/liquid/air array, stars array, clouds array
  cattails = [];// cattails array
  frogs, flies = [], fish = [];//frog and flies array
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
}

function setup() {
  createCanvas(600, 350);

  //generateSeed();
  input = createInput('random');
  button = createButton("submit");
  button.mouseClicked(submitted);
}

function submitted(){
  
  let inputList = input.value();
  seedInputed = inputList.split(',').map(item => item.trim());

  if(seedInputed[0] === "random"){
    resetEverything();
    generateSeed();
    input.value(seedComponents);
    seedReady = true;
    return;
  }

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
    text("Invalid seed", width/2, height/3);
    text("Type random to generate random seed", width/2, height/2);
  }

  pop();
}
function copyArray(length) {
  for (let i = 0; i < length; i++) {
    seedComponents[i] = seedInputed[i];
  }
  seed = str(seedComponents);
}
function checkInRange(min, max, value) {
  let num = parseInt(value);
  return !isNaN(num) && num >= min && num <= max;
}

function generateWorld(){
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
  for(let c = 0; c<seedComponents[1]; c++){
    let x = noise(noiseOffsetCloudX) * width;
    noiseOffsetCloudX += 5;

    let y = noise(noiseOffsetCloudY) * 110 + 10;
    noiseOffsetCloudY += 5; 

    clouds[c] = new cloud(x,y,seedComponents[2],seedComponents[0]);
  }
}
function generateFish(){
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

  if(!seedReady){
    background(0);
    instructionMessage();
      showInvalidMessage();
  invalidTimer--;
  }

  if(seedReady == true){
      showInvalidMessage();
    invalidTimer--;
    if(!worldReady){
        generateWorld();
        worldReady = true;
    }

      background(20, 20, 60);
  
    environment();
    UI();
    checkAnalyse();
    animals();
    mainObjects();
  }
}
function mainObjects(){

  if(analyseMode){
    analyseArrow.show();
  }
  analyseDatas[0] = new data(width-50,50,timeString,20);
  for(let aD of analyseDatas){
    aD.show();
  }
}
function animals(){
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
function UI(){
  push();
  if(day>100){
    fill(0);
  }
  else{
    fill(255);
  }
  textSize(20);
  text("Score: "+floor(pointsEarned)+"    Seed:" + seed, 20,30);
  text(frogs.mode,20,50);
  pop();
}
function environment(){
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

function checkAnalyse(){
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
