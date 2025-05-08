let envi = [], stars = [], clouds = [];// land/liquid/air array, stars array, clouds array
let cattails = [];// cattails array
let frogs, flies = [];//frog and flies array
let day = 0,dc = 2,time,timeString;// day and dayCount and time converted from day
let G; // gravity
let analyseMode = false,stopPressed = true,blackCoverAlpha = 0;//analyse mode components
let analyseArrow,analyseDatas = [];
let eatCount=0,pointsEarned = 0; // flies eaten counter and points earned

let seed = "",seedComponents = [];
let noiseOffsetX = 0.0,noiseOffsetY = 100.0;
//0x-1X-2aa-3y-4YY-5zzz-6ZZ-7NoiseSeed
/*clouds 	x-type of clouds		X-amount		aa-size
  flies 		y-size				YY-amount
  cattails 	zzz-height			ZZ-amount*/


function generateSeed(){
  seedComponents[0] = round(random(1,3));//cloud type
  seedComponents[1] = round(random(5,9));//cloud amount
  seedComponents[2] = round(random(20,30));//cloud size
  seedComponents[3] = round(random(2,4));//fly size
  seedComponents[4] = round(random(15,25));//fly amount
  seedComponents[5] = round(random(150,170));//cattail height
  seedComponents[6] = round(random(10,15));//cattail amount
  seedComponents[7] = round(random(10,99));//noise seed
  noiseSeed(seedComponents[7]);
  seed = str(seedComponents);
}
function setup() {
  createCanvas(600, 350);

  generateSeed();

  G =  0.5;
  frogs = new frog(200,100,1.5,3);
  analyseArrow = new vectorArrows(frogs);
  generateCloud();
  for(let s = 0; s<30; s++){
    stars[s] = new STAR(random(0,600),random(0,240),random(0.5,5));
  }
  generateCloud();
  for(let s = 0; s<10; s++){
    cattails[s] = new cattail(10+7*s,300,random(-5,5),random(-180,-150));
  }
  for(let f = 0; f<20;f++){
    flies[f] = new fly(random(10,80),random(100,200),random(4,6),0.05);
  }
  envi[0] = new env(0,250,350,height,true,false,false);
  envi[1] = new env(350,250,width,height,false,true,false);
  envi[2] = new env(0,0,width,height,false,false,true);
  envi[3] = new env(340,350,width,height,true,false,false);
  envi[4] = new env(350,340,50,10,false,false,false); //jumping pad
}
function generateCloud(seed){
  for(let c = 0; c<seedComponents[1]; c++){
    let x = noise(noiseOffsetX) * width;
    noiseOffsetX += 5;

    let y = noise(noiseOffsetY) * 110 + 10;
    noiseOffsetY += 5; 

    clouds[c] = new cloud(x,y,seedComponents[2],seedComponents[0]);
  }
}
function draw() {
  background(20, 20, 60);
  environment();
  UI();
  checkAnalyse();
  animals();
  mainObjects();

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
  for(let f of flies){
    f.checkEaten();
    f.update();
    f.show();
  }
  frogs.update();
  frogs.show();
}
function UI(){
  push();
  textSize(20);
  text("Score: "+floor(pointsEarned)+"   Seed:" + seed, 20,30);
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
