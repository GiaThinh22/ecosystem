class frog{
    constructor(x,y,size,jumpStrength){
        this.pos = createVector(x,y);
        this.n = size;
        this.mass = size*1.5;
        this.js = jumpStrength;
        this.vel = createVector(0,0);
        this.acc = createVector(0,0);
        this.dir = 1; //1--> -1<--
        this.ybottom;
        this.touchG = false;
        this.inW = false;
        this.c;
        this.random = random(120,180);
        this.mode = 2; //1 auto     2 control       3 poop
        this.jumpCooldown = 100 ; //1s
        this.prev=0;
        this.timeTouchGround = 0;
        this.noPress = true;
        this.circleAlpha = 0;
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
        this.touchG = false;
        for(let e of envi){
            if(!e.solid&&!e.liquid&&!e.air){
                if(e.pos.x<=this.pos.x&&this.pos.x<=e.pos.x+e.len.x){
                    if(this.pos.y>=230 && this.dir==-1){
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
                        this.touchG = true;
                        this.timeTouchGround++;
                        if(this.mode==2){
                            if(keyIsPressed&&key=="a"){
                                this.dir=-1;
                            }
                            if(keyIsPressed&&key=="d"){
                                this.dir=1;
                            }
                        }
                        if(((frameCount%60 == 0 && this.mode==1)||(this.mode==2 && keyIsPressed && key == "w"))&&this.timeTouchGround>=30){
                            this.touchG = false;
                            this.pos.y-=5;
                            let f;
                            if(!this.inW){ f = createVector(this.js*this.dir*1.5, -3*this.js);
                            }
                            if(this.inW){ f = createVector(this.js*this.dir*3.5, -2*this.js);
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
                this.inW = false;
                if(e.pos.x<=this.pos.x && this.pos.x<=e.pos.x+e.len.x){
                    if(e.pos.y<=this.pos.y+10*this.n){
                        G = 0.05;
                        this.inW = true;
                    }
                }
            }
            if(e.air){
                if(!this.inW){
                    G =  0.5;
                }
                if(!this.touchG && !this.inW){
                    this.resis(0);
                }
            }
        }
        if(this.touchG == false){
            this.acc.add(0,G);
            this.timeTouchGround=0;
        }
        let drag = this.vel.copy(); 
        drag.normalize();
        drag.mult(-1);
  
        let ballSpeed = this.vel.mag();
        drag.mult(this.c * ballSpeed * ballSpeed);
        this.vel.add(drag);

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc = createVector(0,0);
        if(this.pos.x<=100 && this.dir == -1){
            this.dir*=-1;
        }
        if(this.pos.x>=width-50 && this.dir == 1){
            this.dir*=-1;
        }
    }
    resis(type){
        if(type == 0){//air
            this.c = 0.01
        }
        if(type == 1){//liquid
            this.c = 0.5;
        }
        if(type == 2){//ground
            this.c = 0.05;
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

        if(this.touchG){
        push();
        translate(this.pos.x,this.pos.y);
        scale(this.dir,1);
        fill("#6C8B64");
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
        scale(this.dir,1);
        fill("#6C8B64");
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
        this.s = size;
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
        let dir = p5.Vector.sub(frogs.pos, this.pos);
        let distSq = constrain(dir.magSq(), 100, 2500);
        let strength = G * (frogs.n * this.s) / distSq;
        dir.setMag(strength);
        this.addForce(dir);
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
            circle(this.pos.x,this.pos.y,this.s);
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
        this.dir = 1;
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
            //this.dir = 1;
        }
        if(width<this.pos.x+this.size){
            this.vel.x = this.vel.x*-1;
            this.pos.x = width-this.size;
            //this.dir = -1;
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
            this.dir = 1;
        }
        else if (this.vel.x<0){
            this.dir= -1;
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
        if(this.dir==1){//right
            ellipse(this.pos.x+0.3*this.size,this.pos.y,3*this.size,2*this.size);
            triangle(this.pos.x-2*this.size,this.pos.y-this.size,this.pos.x-2*this.size,this.pos.y+this.size,this.pos.x-1.2*this.size,this.pos.y);
        }
        if(this.dir==-1){ //left
            ellipse(this.pos.x-0.3*this.size,this.pos.y,3*this.size,2*this.size);
            triangle(this.pos.x+2*this.size,this.pos.y-this.size,this.pos.x+2*this.size,this.pos.y+this.size,this.pos.x+1.2*this.size,this.pos.y);
        }
        pop();
    }
}