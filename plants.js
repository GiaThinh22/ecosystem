class cattail{
    constructor(x,y,a,h){
        this.pos = createVector(x,y+5);
        this.angle = a;
        this.sway;
        this.height = h + map(noise(x), 0, 1, -10,10);
    }
    update(){
        push();
        strokeWeight(1);
        //random swaying movement
        translate(this.pos.x, this.pos.y);
        this.sway = sin(this.angle)*5; 
        rotate(radians(this.sway));
        //drawing the cattail
        fill(60, 120, 60);
        rect(-2, this.height, 4, 150);
        fill(139, 69, 19);
        rect(-5, this.height-20, 10, 30, 5);

        //update angle of swaying
        this.angle+=random(0.01,0.04);
        pop();
    }
}