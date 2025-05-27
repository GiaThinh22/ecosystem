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
    friction(){
        let friction = this.vel.copy();
        friction.normalize();
        friction.mult(-1);
        friction.y = 0;
        friction.setMag(0.1);
        this.acc.add(friction);
    }
    update(){
        if(this.mode==3){
            pointsEarned-=0.075;
            if(pointsEarned<=0){
                pointsEarned = 0;
                this.mode = 2;
            }
        }
        if(keyIsPressed){
            if(key == "q"&&this.noPress){
                this.noPress = false;
                this.mode = (this.mode)%2+1;
            }
            if(key == "s"&&(pointsEarned>=5||this.mode==3)&&this.noPress){
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
        if(eatCount)
        this.touchGround = false;
        for(let e of envi){
            if(!e.solid&&!e.liquid&&!e.air){
                if(e.pos.x<=this.pos.x&&this.pos.x<=e.pos.x+e.len.x){
                    if(this.pos.y>=230 && this.direction==-1){
                        let f = createVector(-0.1,-1);
                        this.acc.add(f);
                    }
                }
            }
            if(e.solid){
                if(e.pos.x<=this.pos.x && this.pos.x<=e.pos.x+e.len.x){
                    this.ybottom = this.pos.y+10*this.n;
                    if(e.pos.y <= this.ybottom+5){
                        this.friction();
                        this.resis(2);
                        this.touchGround = true;
                        this.timeTouchGround++;
                        if(this.mode==2){
                            if(keyIsPressed&&key=="a"){
                                this.direction=-1;
                            }
                            if(keyIsPressed&&key=="d"){
                                this.direction=1;
                            }
                        }
                        if(((frameCount%60 == 0 && this.mode==1)||(this.mode==2 && keyIsPressed && key == "w"))&&this.timeTouchGround>=30){
                            this.touchGround = false;
                            this.pos.y-=5;
                            let f;
                            if(!this.inWater){ f = createVector(this.jumpStrength*this.direction*1.5, -3*this.jumpStrength);
                            }
                            if(this.inWater){ f = createVector(this.jumpStrength*this.direction*3.5, -2*this.jumpStrength);
                            }
                            
                            this.acc.add(f);
                        }
                        else{
                            this.vel.y = 0;
                            this.pos.y = e.pos.y - 10*this.n;
                        }
                        
                    }
                }
            }
            if(e.liquid){
                this.inWater = false;
                if(e.pos.x<=this.pos.x && this.pos.x<=e.pos.x+e.len.x){
                    if(e.pos.y<=this.pos.y+10*this.n){
                        G = 0.05;
                        this.inWater = true;
                    }
                }
            }
            if(e.air){
                if(!this.inWater){
                    G =  0.5;
                }
                if(!this.touchGround && !this.inWater){
                    this.resis(0);
                }
            }
        }
        if(this.touchGround == false){
            this.acc.add(0,G);
            this.timeTouchGround=0;
        }
        let drag = this.vel.copy(); 
        drag.normalize();
        drag.mult(-1);
  
        let ballSpeed = this.vel.mag();
        drag.mult(this.dragCoefficient * ballSpeed * ballSpeed);
        this.vel.add(drag);

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc = createVector(0,0);
        if(this.pos.x<=100 && this.direction == -1){
            this.direction*=-1;
        }
        if(this.pos.x>=width-50 && this.direction == 1){
            this.direction*=-1;
        }
    }
    resis(type){
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
    show(){
        push();
        noStroke();
        if(analyseMode && this.circleAlpha<100){
            this.circleAlpha+=5;
        }
        if(!analyseMode && this.circleAlpha>0){
            this.circleAlpha-=5;
        }
        fill(255,0,0,this.circleAlpha);
        ellipse(this.pos.x,this.pos.y,100,75);
        pop();

        if(this.touchGround){
        push();
        translate(this.pos.x,this.pos.y);
        scale(this.direction,1);
        fill("#6C8B64");
        if(this.pecked){fill("red");}
        if(this.mode == 3){
            fill(110, 38, 14);
        }
        strokeWeight(2);
        ellipse(-2*this.n,+8*this.n,12*this.n,7*this.n);
        ellipse(10*this.n,8*this.n,4*this.n,8*this.n);
        ellipse(0,0,30*this.n,20*this.n);
        ellipse(-10*this.n,+8*this.n,12*this.n,7*this.n);
        ellipse(8*this.n,8*this.n,4*this.n,8*this.n);
        fill(0);
        strokeWeight(1);
        circle(10*this.n,-3*this.n,2)
        circle(5*this.n,-3*this.n,2)
        strokeWeight(2);
        line(7*this.n,0,15*this.n,0);
        pop();
        }
        else{
            push();
        translate(this.pos.x,this.pos.y);
        scale(this.direction,1);
        fill("#6C8B64");
        if(this.pecked){fill("red");}
        if(this.mode == 3){
            fill(110, 38, 14);
        }
        strokeWeight(2);
        ellipse(-2*this.n,+8*this.n,7*this.n,12*this.n);
        ellipse(14*this.n,8*this.n,8*this.n,4*this.n);
        ellipse(0,0,30*this.n,20*this.n);
        ellipse(-10*this.n,+8*this.n,7*this.n,12*this.n);
        ellipse(12*this.n,8*this.n,8*this.n,4*this.n);
        fill(0);
        strokeWeight(1);
        circle(10*this.n,-3*this.n,2)
        circle(5*this.n,-3*this.n,2)
        strokeWeight(2);
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
    addForce(f){
        this.acc.add(f);
    }
    attract(){
        let G = 20;
        let attrationForce = p5.Vector.sub(frogs.pos, this.pos);
        let distSq = constrain(attrationForce.magSq(), 100, 2500);
        let strength = G * (frogs.n * this.size) / distSq;
        attrationForce.setMag(strength);
        this.addForce(attrationForce);
    }
    checkEaten(){
        if(abs(frogs.pos.x-this.pos.x)<=10 && abs(this.pos.y-frogs.pos.y)<=10){
            eatCount++;
            pointsEarned++;
            this.eaten = true;
            this.pos = createVector(random(10,80),random(100,200));
        }
    }
    update() {
        if(frogs.mode==3){
            this.attract();
        }
        let angle = random(TWO_PI);
        let force = p5.Vector.fromAngle(angle);
        force.mult(this.strength);
        this.acc.add(force);
        if(day>100 && this.eaten){
            this.eaten = false;
        }

            if(!this.eaten){
                this.vel.add(this.acc);
                this.vel.limit(1);
                this.pos.add(this.vel);
            }
            else{
                this.vel = createVector(0,0);
            }
            this.acc.mult(0);
        
        this.vel.add(this.acc);
        this.vel.limit(2);
        this.pos.add(this.vel);
        this.acc.mult(0);
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
    show(){
        push();
        fill(this.color);
        if(analyseMode&&this.color<=220){
            this.color+=20;
        }
        if(!analyseMode&&this.color>=20){
            this.color-=20;
        }
        noStroke();
        if(!this.eaten){
            circle(this.pos.x,this.pos.y,this.size);
        }

        pop();
    }
}

class fishs{
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

    addForce(ff) {
        let f = p5.Vector.div(ff, this.mass);
        this.acc.add(f);
    }
    repel(){ //frog
        if(abs(frogs.pos.x-this.pos.x) <= 100 && abs(frogs.pos.y-this.pos.y) <= 75){
            let force = p5.Vector.sub(frogs.pos, this.pos);
            let distance = force.mag();
            distance = constrain(distance, 5, 2500);
            force.normalize();
            let strength = (-300 * this.mass * frogs.mass) / (distance * distance * distance);
            force.mult(strength);
            this.addForce(force);
        }
    }
    checkEdges(){
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
    randomMovement(){
        let x = noise(this.noiseOffsetX)*round(random(-1,1))*5;
        this.noiseOffsetX+=5;

        let y = noise(this.noiseOffsetY)*round(random(-1,1))*5;
        this.noiseOffsetY+=5;

        let movement = createVector(x,y);
        this.addForce(movement);
    }
    update(){
        for(let i = 0; i<fish.length; i++){
            if(i!=this.id){
                let force = p5.Vector.sub(this.pos, fish[i].pos);
                let distance = force.mag();
                distance = constrain(distance, 5, 2500);
                force.normalize();
                let strength = (G * this.mass * fish[i].mass) / (distance * distance * distance);
                force.mult(strength);
                fish[i].addForce(force);
            }
        }
        this.repel();
        this.checkEdges();

        this.randomMovement();

        this.vel.add(this.acc);
        this.vel.limit(1.5);
        this.pos.add(this.vel);
        this.acc.mult(0);
        if(this.vel.x>0){
            this.direction = 1;
        }
        else if (this.vel.x<0){
            this.direction= -1;
        }
    }
    show(){
        push();
        fill(79,169,188,this.color);
        strokeWeight(1);
        stroke(0);
        if(analyseMode){
            stroke("cyan");
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
  checkValidFrogLocation(){
    if(frogs.pos.x>=0 && frogs.pos.x<=300 && !this.returning && frogs.mode!=3){
        this.move(this.direction);
    }
    //else if(frogs.pos.x){}
    else{
        this.move(0);
    }
  }
  move(dir){
    this.flyCooldown++;
    if(dir == -1 && !this.returning){ // left
        if(this.pos.x>=frogs.pos.x-30*dir){
            this.flyMode = true;
            let f = createVector(dir,0);
            if(round(this.flyCooldown/10)%5==0){
                f.y = -0.6
                if(this.touchGround){
                    
                }
            }
            this.acc.add(f);
        }
        else{
            this.flyMode = false;
        }

        let drag = this.vel.copy(); 
        drag.y = 0;
        drag.normalize();
        drag.mult(-1);
  
        let speed = this.vel.mag();
        drag.mult(this.dragCoefficient * speed * speed);
        this.vel.add(drag);
    }
    if(dir == 1 && !this.returning){ // right
        if(this.pos.x>=frogs.pos.x-30*dir){
            this.flyMode = true;
            let f = createVector(dir,0);
            if(round(this.flyCooldown/10)%5==0){
                f.y = -0.6
            }
            this.acc.add(f);
        }
        else{
            this.flyMode = false;
        }

        let drag = this.vel.copy(); 
        drag.y = 0;
        drag.normalize();
        drag.mult(-1);
  
        let speed = this.vel.mag();
        drag.mult(this.dragCoefficient * speed * speed);
        this.vel.add(drag);
    }
    if(dir == 0){ //return to branch
        if(this.pos.x<=width-50 || this.pos.y>=145){
            this.flyMode = true;
            this.returning = true
            let f = createVector(0,0);
            if(this.pos.x<=width-50){
                f.x = 1;
                this.direction = 1;
            }
            if(round(this.flyCooldown/10)%5==0 && this.pos.y>=145 && this.returning){
                f.y = -0.6;
            }
            this.acc.add(f);
        }
        else{
            this.flyMode = false;
            this.returning = false;
        }

        let drag = this.vel.copy(); 
        drag.y = 0;
        drag.normalize();
        drag.mult(-1);
  
        let speed = this.vel.mag();
        drag.mult(this.dragCoefficient * speed * speed);
        this.vel.add(drag);
    }
  }
  grav() {
    let f = createVector(0, this.G);
    this.acc.add(f);
  }
  update() {
    this.checkValidFrogLocation();
    if (this.pos.y>=170&&this.touchGround && (frameCount%60==0||frameCount%60==1||frameCount%60==2||frameCount%60==3||frameCount%60==4)) {
      this.pecking = true;
    }
    else{
        this.pecking = false;
        frogs.pecked = false;
    }
    /*
    if (this.flyMode && round(frameCount/10)%5==0) {
      let f = createVector(0, -0.6);
      this.acc.add(f);
    }*/
    this.touchGround = false;
    if ((this.pos.y >= 145 &&this.pos.y <=155 && width-70<=this.pos.x && this.pos.x<=width)) {
      this.vel.y = 0;
      this.pos.y = 150;
      this.touchGround = true;
      this.flyCooldown=-1;
      this.returning = false;
    } 
    else if((0<=this.pos.x && this.pos.x<=350 && this.pos.y >= 245)&&!this.flyMode){
        this.vel.y = 0;
        this.pos.y = 250;
        this.touchGround = true;
        this.flyCooldown=-1;
    }
    else {
      this.grav();
    }

    if (!this.touchGround) {
      this.mode = 0;
    } else if (!this.pecking) {
      this.mode = 1;
    } else {
      this.mode = 2;
    }

    //look at the frog

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
  show() {
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

