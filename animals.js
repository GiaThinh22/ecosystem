class frog{
    constructor(x,y,size,jumpStrength){
        this.pos = createVector(x,y);
        this.n = size;
        this.mass = size*1.5;
        this.jumpStrength = jumpStrength;
        this.vel = createVector(0,0);
        this.acc = createVector(0,0);
        this.direction = 1; //1--> -1<--
        this.ybottom;
        this.touchGround = false;
        this.inWater = false;
        this.dragCoefficient;
        this.random = random(120,180);
        this.mode = 2; //1 auto     2 control       3 poop
        this.jumpCooldown = 100 ; //1s
        this.prev=0;
        this.timeTouchGround = 0;
        this.noPress = true;
        this.circleAlpha = 0;
        this.pecked = false;
    }   
    friction(){ //calculate frictional force
        let friction = this.vel.copy();
        friction.normalize();
        friction.mult(-1);
        friction.y = 0;
        friction.setMag(0.1);
        this.acc.add(friction);
    }
    update(){
        if(this.mode==3){ //check in poop mode
            pointsEarned-=0.075;
            if(pointsEarned<=0){
                pointsEarned = 0;
                this.mode = 2;
            }
        }
        if(keyIsPressed){
            if(key == "q"&&this.noPress){ //switch mode
                this.noPress = false;
                this.mode = (this.mode)%2+1;
            }
            if(key == "s"&&(pointsEarned>=5||this.mode==3)&&this.noPress){ //poop mode
                if(this.mode!=3){
                    this.mode = 3;
                    this.noPress = false;
                }
                else{
                    this.mode = 2;
                    this.noPress = false;
                }
            }
        }
        else{
            this.noPress = true;
        }
        
        this.touchGround = false;
        for(let e of envi){
            if(!e.solid&&!e.liquid&&!e.air){
                if(e.pos.x<=this.pos.x&&this.pos.x<=e.pos.x+e.len.x){//jump pad
                    if(this.pos.y>=230 && this.direction==-1){ //add pushing force to rise back to ground
                        let f = createVector(-0.1,-1);
                        this.acc.add(f);
                    }
                }
            }
            if(e.solid){//ground
                if(e.pos.x<=this.pos.x && this.pos.x<=e.pos.x+e.len.x){
                    this.ybottom = this.pos.y+10*this.n;
                    if(e.pos.y <= this.ybottom+5){//add friction if touching ground
                        this.friction();
                        this.resis(2);
                        this.touchGround = true;
                        this.timeTouchGround++;
                        if(this.mode==2){
                            if(keyIsPressed&&key=="a"){//turn left
                                this.direction=-1;
                            }
                            if(keyIsPressed&&key=="d"){//turn right
                                this.direction=1;
                            }
                        }
                        if(((frameCount%60 == 0 && this.mode==1)||(this.mode==2 && keyIsPressed && key == "w"))&&this.timeTouchGround>=30){//auto jump
                            this.touchGround = false;
                            this.pos.y-=5;
                            let f;
                            if(!this.inWater){ f = createVector(this.jumpStrength*this.direction*1.5, -3*this.jumpStrength);
                            }//higher jump force on land
                            if(this.inWater){ f = createVector(this.jumpStrength*this.direction*3.5, -2*this.jumpStrength);
                            }//lower jump force in water
                            
                            this.acc.add(f);
                        }
                        else{
                            this.vel.y = 0;
                            this.pos.y = e.pos.y - 10*this.n;//grounded
                        }
                        
                    }
                }
            }
            if(e.liquid){//water
                this.inWater = false;
                if(e.pos.x<=this.pos.x && this.pos.x<=e.pos.x+e.len.x){
                    if(e.pos.y<=this.pos.y+10*this.n){//checking if in water
                        G = 0.05;
                        this.inWater = true;
                    }
                }
            }
            if(e.air){//air
                if(!this.inWater){
                    G =  0.5;//set G to normal
                }
                if(!this.touchGround && !this.inWater){
                    this.resis(0);//set drag coefficient
                }
            }
        }
        if(this.touchGround == false){
            this.acc.add(0,G);//gravity
            this.timeTouchGround=0;//reset time touching ground
        }
        //drag force
        let drag = this.vel.copy(); 
        drag.normalize();
        drag.mult(-1);
  
        let ballSpeed = this.vel.mag();
        drag.mult(this.dragCoefficient * ballSpeed * ballSpeed);
        this.vel.add(drag);
        //

        //normal update
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc = createVector(0,0);
        //

        //check near edges to turn around
        if(this.pos.x<=100 && this.direction == -1){
            this.direction*=-1;
        }
        if(this.pos.x>=width-50 && this.direction == 1){
            this.direction*=-1;
        }
    }

    resis(type){//setting drag coefficient
        if(type == 0){//air
            this.dragCoefficient = 0.01
        }
        if(type == 1){//liquid
            this.dragCoefficient = 0.5;
        }
        if(type == 2){//ground
            this.dragCoefficient = 0.05;
        }
    }

    show(){//showing a pic of a frog
        push();
        noStroke();
        if(analyseMode && this.circleAlpha<100){
            this.circleAlpha+=5;//slowly show the red repel ring (RRR)
        }
        if(!analyseMode && this.circleAlpha>0){
            this.circleAlpha-=5;//slowly hide the RRR
        }
        fill(255,0,0,this.circleAlpha);
        ellipse(this.pos.x,this.pos.y,100,75);//draw RRR
        pop();

        if(this.touchGround){//grounded pose
        push();
        translate(this.pos.x,this.pos.y);
        scale(this.direction,1);//turning to the direction left/right
        fill("#6C8B64");//frog green
        if(this.pecked){fill("red");}//frog hurt -> red
        if(this.mode == 3){//poop mode
            fill(110, 38, 14);//frog shits -> brown
        }
        strokeWeight(2);

        //drawing the frog
        ellipse(-2*this.n,+8*this.n,12*this.n,7*this.n);
        ellipse(10*this.n,8*this.n,4*this.n,8*this.n);
        ellipse(0,0,30*this.n,20*this.n);
        ellipse(-10*this.n,+8*this.n,12*this.n,7*this.n);
        ellipse(8*this.n,8*this.n,4*this.n,8*this.n);
        //
        fill(0);
        strokeWeight(1);
        //eyes
        circle(10*this.n,-3*this.n,2)
        circle(5*this.n,-3*this.n,2)
        //
        strokeWeight(2);
        line(7*this.n,0,15*this.n,0);//mouth
        pop();
        }
        else{//on air
            push();
        translate(this.pos.x,this.pos.y);
        scale(this.direction,1);//turning left/right
        fill("#6C8B64");//frog green
        if(this.pecked){fill("red");}//frog hurt red
        if(this.mode == 3){
            fill(110, 38, 14);//frog shitting brown
        }
        strokeWeight(2);
        //frog body
        ellipse(-2*this.n,+8*this.n,7*this.n,12*this.n);
        ellipse(14*this.n,8*this.n,8*this.n,4*this.n);
        ellipse(0,0,30*this.n,20*this.n);
        ellipse(-10*this.n,+8*this.n,7*this.n,12*this.n);
        ellipse(12*this.n,8*this.n,8*this.n,4*this.n);
        fill(0);
        strokeWeight(1);
        //frog eyes
        circle(10*this.n,-3*this.n,2)
        circle(5*this.n,-3*this.n,2)
        strokeWeight(2);
        //frog mouth
        line(7*this.n,0,15*this.n,0);
        pop();
        }
    }
}

class fly{
    constructor(x,y,size,strength){
        this.pos = createVector(x,y);
        this.vel = createVector(0,0);
        this.acc = createVector(0,0);
        this.size = size;
        this.strength = strength;
        this.dirX = 1; //1=right   -1=left
        this.dirY = -1; //-1=up   1=down
        this.eaten = false;
        this.color = 0;
    }    
    addForce(f){//no shit 
        this.acc.add(f);
    }
    attract(){//attraction
        let G = 20;
        let attrationForce = p5.Vector.sub(frogs.pos, this.pos);
        let distSq = constrain(attrationForce.magSq(), 100, 2500);
        let strength = G * (frogs.n * this.size) / distSq;
        attrationForce.setMag(strength);
        this.addForce(attrationForce);
    }
    checkEaten(){//idk maybe it's checking if it is eaten or not
        if(abs(frogs.pos.x-this.pos.x)<=10 && abs(this.pos.y-frogs.pos.y)<=10){//frog can eat this
            eatCount++;
            pointsEarned++;
            this.eaten = true;
            this.pos = createVector(random(10,80),random(100,200));//respawn at the cattails
        }
    }
    update() {
        if(frogs.mode==3){//frog shits attracts flies
            this.attract();
        }
        //random movement calculation (very sophisticated)
        let angle = random(TWO_PI);
        let force = p5.Vector.fromAngle(angle);
        force.mult(this.strength);
        this.acc.add(force);
        //done
        if(day>100 && this.eaten){//respawn time
            this.eaten = false;
        }

            if(!this.eaten){//normal update
                this.vel.add(this.acc);
                this.vel.limit(1);
                this.pos.add(this.vel);
            }
            else{//no moving when not respawn yet
                this.vel = createVector(0,0);
            }
            //reset acc
            this.acc.mult(0);
        /*
        this.vel.add(this.acc);
        this.vel.limit(2);
        this.pos.add(this.vel);
        this.acc.mult(0);*/ //old update (cant work cuz it also does it when the fly is dead)

        //check edges
        if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x *= -1;
        }
        if (this.pos.x > width) {
            this.pos.x = width;
            this.vel.x *= -1;
        }
        if (this.pos.y < 100) {
            this.pos.y = 100;
            this.vel.y *= -1;
        }
        if (this.pos.y > 220) {
            this.pos.y = 220;
            this.vel.y *= -1;
        }
    }
    show(){//draw the fly
        push();
        fill(this.color);
        if(analyseMode&&this.color<=220){
            this.color+=20;//slowly becomes white in analyseMode
        }
        if(!analyseMode&&this.color>=20){
            this.color-=20;//returning to black
        }
        noStroke();
        if(!this.eaten){
            circle(this.pos.x,this.pos.y,this.size);//fly dot drawn
        }

        pop();
    }
}

class fishs{//fish
    constructor(x,y,mass,id,color){
        this.pos = createVector(x,y);
        this.vel = createVector(0,0);
        this.acc = createVector(0,0);
        this.color = color;
        this.mass = mass;
        this.size = max(3.5,mass/6);
        this.id = id; //position in fish[] array
        this.noiseOffsetX = 0.0;
        this.noiseOffsetY = 100.0;
        this.direction = 1;
    }

    addForce(ff) {//add force
        let f = p5.Vector.div(ff, this.mass);
        this.acc.add(f);
    }
    repel(){ //repel from the frog
        if(abs(frogs.pos.x-this.pos.x) <= 100 && abs(frogs.pos.y-this.pos.y) <= 75){ //in range of the RRR
            let force = p5.Vector.sub(frogs.pos, this.pos);
            let distance = force.mag();
            distance = constrain(distance, 5, 2500);
            force.normalize();
            let strength = (-300 * this.mass * frogs.mass) / (distance * distance * distance);
            force.mult(strength);
            this.addForce(force);
        }
    }
    checkEdges(){//duh i wonder what this does
        if(350>this.pos.x-this.size){
            this.vel.x = this.vel.x*-1;
            this.pos.x = 350+this.size;
        }
        if(width<this.pos.x+this.size){
            this.vel.x = this.vel.x*-1;
            this.pos.x = width-this.size;
        }
        if(height<this.pos.y+this.size){
            this.vel.y = this.vel.y*-1;
            this.pos.y = height-this.size;
        }
        if(250>this.pos.y-this.size){
            this.vel.y = this.vel.y*-1;
            this.pos.y = 250+this.size;
        }
    }
    randomMovement(){//random movement using noise :O
        let x = noise(this.noiseOffsetX)*round(random(-1,1))*5;
        this.noiseOffsetX+=5;

        let y = noise(this.noiseOffsetY)*round(random(-1,1))*5;
        this.noiseOffsetY+=5;

        let movement = createVector(x,y);
        this.addForce(movement);
    }
    update(){//updating
        for(let i = 0; i<fish.length; i++){
            if(i!=this.id){//checking different fish to attract
                //calculating attraction forces wooo
                let force = p5.Vector.sub(this.pos, fish[i].pos);
                let distance = force.mag();
                distance = constrain(distance, 5, 2500);
                force.normalize();
                let strength = (G * this.mass * fish[i].mass) / (distance * distance * distance);
                force.mult(strength);
                fish[i].addForce(force);
            }
        }
        //this basic routine
        this.repel();
        this.checkEdges();

        this.randomMovement();

        //normal updating
        this.vel.add(this.acc);
        this.vel.limit(1.5);
        this.pos.add(this.vel);
        this.acc.mult(0);
        //changing directions
        if(this.vel.x>0){
            this.direction = 1;
        }
        else if (this.vel.x<0){
            this.direction= -1;
        }
    }
    show(){//draw the fish
        push();
        fill(79,169,188,this.color);
        strokeWeight(1);
        stroke(0);
        if(analyseMode){
            stroke("cyan");//highlighted in analyse mode
        }
        if(this.direction==1){//right
            ellipse(this.pos.x+0.3*this.size,this.pos.y,3*this.size,2*this.size);
            triangle(this.pos.x-2*this.size,this.pos.y-this.size,this.pos.x-2*this.size,this.pos.y+this.size,this.pos.x-1.2*this.size,this.pos.y);
        }
        if(this.direction==-1){ //left
            ellipse(this.pos.x-0.3*this.size,this.pos.y,3*this.size,2*this.size);
            triangle(this.pos.x+2*this.size,this.pos.y-this.size,this.pos.x+2*this.size,this.pos.y+this.size,this.pos.x+1.2*this.size,this.pos.y);
        }
        pop();
    }
}

class bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mode = 0; //0-flying   1-resting   2-pecking
    this.G = 0.1;
    this.touchGround = false;
    this.direction = -1; //-1 left       1 right
    this.flyMode = true;
    this.pecking = false;
    this.flyCooldown=0;
    this.returning = false;
    this.dragCoefficient;
  }
  checkValidFrogLocation(){//check if the kingfisher can fly to the frog to peck it
    if(frogs.pos.x>=0 && frogs.pos.x<=300 && !this.returning && frogs.mode!=3){
        this.move(this.direction);//move to it
    }
    else{
        this.move(0);//return to the branch
    }
  }
  move(dir){
    this.flyCooldown++;//update fly cooldown
    if(dir == -1 && !this.returning){ // left
        if(this.pos.x>=frogs.pos.x-30*dir){//it is not near the pecking location yet
            this.flyMode = true; 
            let f = createVector(dir,0);//fly horizontally to the frog
            if(round(this.flyCooldown/10)%5==0){
                f.y = -0.6; // fly up
            }
            this.acc.add(f);
        }
        else{
            this.flyMode = false;//dont fly
        }
        //drag force
        let drag = this.vel.copy(); 
        drag.y = 0;
        drag.normalize();
        drag.mult(-1);
        let speed = this.vel.mag();
        drag.mult(this.dragCoefficient * speed * speed);
        this.vel.add(drag);
    }
    if(dir == 1 && !this.returning){ // right
        if(this.pos.x>=frogs.pos.x-30*dir){//it is not near the pecking location yet
            this.flyMode = true;
            let f = createVector(dir,0);//fly to the frog
            if(round(this.flyCooldown/10)%5==0){
                f.y = -0.6; //fly up
            }
            this.acc.add(f);
        }
        else{
            this.flyMode = false;//dont fly
        }
        //drag force
        let drag = this.vel.copy(); 
        drag.y = 0;
        drag.normalize();
        drag.mult(-1);
        let speed = this.vel.mag();
        drag.mult(this.dragCoefficient * speed * speed);
        this.vel.add(drag);
    }
    if(dir == 0){ //return to branch
        if(this.pos.x<=width-50 || this.pos.y>=145){//not at the branch
            this.flyMode = true;
            this.returning = true;
            let f = createVector(0,0);
            if(this.pos.x<=width-50){//coord x is not near branch
                f.x = 1;//fly horizontally back
                this.direction = 1;
            }
            if(round(this.flyCooldown/10)%5==0 && this.pos.y>=145 && this.returning){
                f.y = -0.6;//coord y is not near branch --> fly up
            }
            this.acc.add(f);
        }
        else{
            this.flyMode = false;
            this.returning = false;
        }
        //drag force
        let drag = this.vel.copy(); 
        drag.y = 0;
        drag.normalize();
        drag.mult(-1);
        let speed = this.vel.mag();
        drag.mult(this.dragCoefficient * speed * speed);
        this.vel.add(drag);
    }
  }
  grav() {//gravity duh
    let f = createVector(0, this.G);
    this.acc.add(f);
  }
  update() {//updating
    this.checkValidFrogLocation();//checking the frog's location
    if (this.pos.y>=170&&this.touchGround && (frameCount%60==0||frameCount%60==1||frameCount%60==2||frameCount%60==3||frameCount%60==4)) {//on the ground --> peck for 5 frames each 60 frames
      this.pecking = true;
    }
    else{
        this.pecking = false;
        frogs.pecked = false;
    }

    this.touchGround = false;
    if ((this.pos.y >= 145 &&this.pos.y <=155 && width-70<=this.pos.x && this.pos.x<=width)) {//check on the branch
      this.vel.y = 0;
      this.pos.y = 150;
      this.touchGround = true;
      this.flyCooldown=-1;
      this.returning = false;
    } 
    else if((0<=this.pos.x && this.pos.x<=350 && this.pos.y >= 245)&&!this.flyMode){//check on the ground
        this.vel.y = 0;
        this.pos.y = 250;
        this.touchGround = true;
        this.flyCooldown=-1;
    }
    else {
      this.grav();
    }

    if (!this.touchGround) {
      this.mode = 0;//flying
    } else if (!this.pecking) {
      this.mode = 1;//idling
    } else {
      this.mode = 2;//pecking
    }

    //look at the frog's vecinity
    if(this.pos.x>frogs.pos.x){
        this.direction = -1;
    }
    else if(this.pos.x<frogs.pos.x){
        this.direction = 1;
    }
    if(this.returning){
        this.direction = 1;
    }

    //check edges
    if(0<=this.pos.x && this.pos.x<=350 && this.pos.y >= 245){
        this.pos.y = 248;
    }
    if (this.pos.x >= width - 10) {
      this.pos.x = width - 10;
      this.vel.x = 0;
    }
    if (this.pos.x <= 50) {
      this.pos.x = 10;
      this.vel.x = 0;
    }
    if (this.pos.y <= 50) {
      this.pos.y = 50;
      this.vel.y = 0;
    }
    if (this.pos.y >= height - 10) {
      this.pos.y = height - 10;
      this.vel.y = 0;
    }

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  show() { //draw the bird
    //ts is too hard to follow js trust me that it works and will draw the correct image.
    strokeWeight(2);
    if (this.mode == 0) {
      if (this.direction == -1) {
        push(); //body
        fill( 0, 126, 138);
        translate(this.pos.x, this.pos.y - 40);
        rotate(2 * PI - QUARTER_PI / 2);
        ellipse(0, 0, 20, 50);
        pop();

        push(); //wings
        fill( 0, 126, 138);
        translate(this.pos.x + 12, this.pos.y - 60);
        rotate(QUARTER_PI);
        ellipse(0, 0, 10, 30);
        rotate(QUARTER_PI / 2);
        ellipse(5, 0, 10, 30);
        rotate(QUARTER_PI / 2);
        ellipse(10, -1, 10, 30);
        pop();

        line(this.pos.x + 8, this.pos.y - 17, this.pos.x + 8, this.pos.y - 10); // legs
        line(this.pos.x, this.pos.y - 20, this.pos.x, this.pos.y - 10);
        fill( 0, 126, 138);
        circle(this.pos.x - 15, this.pos.y - 65, 20); // head
        circle(this.pos.x - 17, this.pos.y - 65, 1); //eyes
        circle(this.pos.x - 27, this.pos.y - 65, 1);
        fill(100);
        triangle(
          this.pos.x - 27,
          this.pos.y - 60,
          this.pos.x - 21,
          this.pos.y - 55,
          this.pos.x - 30,
          this.pos.y - 50
        ); // beak
      } else if (this.direction == 1) {
        push(); //body
        fill( 0, 126, 138);
        translate(this.pos.x, this.pos.y - 40);
        rotate(QUARTER_PI / 2);
        ellipse(0, 0, 20, 50);
        pop();

        push(); //wings
        fill( 0, 126, 138);
        translate(this.pos.x - 12, this.pos.y - 60);
        rotate(2 * PI - QUARTER_PI);
        ellipse(0, 0, 10, 30);
        rotate(2 * PI - QUARTER_PI / 2);
        ellipse(-5, 0, 10, 30);
        rotate(2 * PI - QUARTER_PI / 2);
        ellipse(-10, 0, 10, 30);
        pop();

        line(this.pos.x, this.pos.y - 20, this.pos.x, this.pos.y - 10); // legs
        line(this.pos.x - 8, this.pos.y - 17, this.pos.x - 8, this.pos.y - 10);
        fill( 0, 126, 138);
        circle(this.pos.x + 15, this.pos.y - 65, 20); // head
        circle(this.pos.x + 17, this.pos.y - 65, 1); //eyes
        circle(this.pos.x + 27, this.pos.y - 65, 1);
        fill(100);
        triangle(
          this.pos.x + 27,
          this.pos.y - 60,
          this.pos.x + 21,
          this.pos.y - 55,
          this.pos.x + 30,
          this.pos.y - 50
        ); // beak
      }
    } 
    else if (this.mode == 1) {
      if (this.direction == -1) {
        push(); //body
        fill( 0, 126, 138);
        translate(this.pos.x, this.pos.y - 40);
        rotate(2 * PI - QUARTER_PI / 2);
        ellipse(0, 0, 20, 50);
        pop();

        push(); //wings
        fill( 0, 126, 138);
        translate(this.pos.x, this.pos.y - 40);
        rotate(2 * PI - QUARTER_PI / 2);
        ellipse(5, -3, 10, 30);

        pop();

        line(this.pos.x + 8, this.pos.y - 17, this.pos.x + 8, this.pos.y); // legs
        line(this.pos.x, this.pos.y - 20, this.pos.x, this.pos.y);
        fill( 0, 126, 138);
        circle(this.pos.x - 15, this.pos.y - 65, 20); // head
        circle(this.pos.x - 17, this.pos.y - 65, 1); //eyes
        circle(this.pos.x - 27, this.pos.y - 65, 1);
        fill(100);
        triangle(
          this.pos.x - 27,
          this.pos.y - 60,
          this.pos.x - 21,
          this.pos.y - 55,
          this.pos.x - 30,
          this.pos.y - 50
        ); // beak
      } 
      else if (this.direction == 1) {
        push(); //body
        fill( 0, 126, 138);
        translate(this.pos.x, this.pos.y - 40);
        rotate(QUARTER_PI / 2);
        ellipse(0, 0, 20, 50);
        pop();

        push(); //wings
        fill( 0, 126, 138);
        translate(this.pos.x, this.pos.y - 40);
        rotate(QUARTER_PI / 2);
        ellipse(-5, -3, 10, 30);

        pop();

        line(this.pos.x - 8, this.pos.y - 17, this.pos.x - 8, this.pos.y); // legs
        line(this.pos.x, this.pos.y - 20, this.pos.x, this.pos.y);
        fill( 0, 126, 138);
        circle(this.pos.x + 15, this.pos.y - 65, 20); // head
        circle(this.pos.x + 17, this.pos.y - 65, 1); //eyes
        circle(this.pos.x + 27, this.pos.y - 65, 1);
        fill(100);
        triangle(
          this.pos.x + 27,
          this.pos.y - 60,
          this.pos.x + 21,
          this.pos.y - 55,
          this.pos.x + 30,
          this.pos.y - 50
        ); // beak
      }
    } 
    else if (this.mode == 2) {
      if (this.direction == -1) {
        push(); //body
        fill( 0, 126, 138);
        translate(this.pos.x - 10, this.pos.y - 32);
        rotate(2 * PI - PI / 3);
        ellipse(0, 0, 20, 50);
        pop();

        push(); //wings
        fill( 0, 126, 138);
        translate(this.pos.x - 5, this.pos.y - 34);
        rotate(2 * PI - PI / 3);
        ellipse(5, -3, 10, 30);

        pop();

        line(this.pos.x + 8, this.pos.y - 17, this.pos.x + 8, this.pos.y); // legs
        line(this.pos.x, this.pos.y - 17, this.pos.x, this.pos.y);
        fill( 0, 126, 138);
        circle(this.pos.x - 35, this.pos.y - 45, 20); // head
        circle(this.pos.x - 36, this.pos.y - 45, 1); //eyes
        circle(this.pos.x - 45, this.pos.y - 35, 1);
        fill(100);
        triangle(
          this.pos.x - 41,
          this.pos.y - 37,
          this.pos.x - 30,
          this.pos.y - 35,
          this.pos.x - 35,
          this.pos.y - 20
        ); // beak

        if(abs(frogs.pos.x-this.pos.x+35)<=20 && abs(frogs.pos.y-this.pos.y+10)<=10){
            frogs.pecked = true;
        }
        else{
            frogs.pecked = false;
        }
      } 
      else if (this.direction == 1) {
        push(); //body
        fill( 0, 126, 138);
        translate(this.pos.x + 10, this.pos.y - 32);
        rotate(PI / 3);
        ellipse(0, 0, 20, 50);
        pop();

        push(); //wings
        fill( 0, 126, 138);
        translate(this.pos.x + 5, this.pos.y - 34);
        rotate(PI / 3);
        ellipse(-5, -3, 10, 30);

        pop();

        line(this.pos.x - 8, this.pos.y - 17, this.pos.x - 8, this.pos.y); // legs
        line(this.pos.x, this.pos.y - 17, this.pos.x, this.pos.y);

        circle(this.pos.x + 35, this.pos.y - 45, 20); // head
        fill( 0, 126, 138);
        circle(this.pos.x + 36, this.pos.y - 45, 1); //eyes
        circle(this.pos.x + 45, this.pos.y - 35, 1);
        fill(100);
        triangle(
          this.pos.x + 41,
          this.pos.y - 37,
          this.pos.x + 30,
          this.pos.y - 35,
          this.pos.x + 35,
          this.pos.y - 20
        ); // beak

        if(abs(frogs.pos.x-this.pos.x-35)<=20 && abs(frogs.pos.y-this.pos.y+10)<=10){
            frogs.pecked = true;
        }
        else{
            frogs.pecked = false;
        }
      }
    }
 
}

}

