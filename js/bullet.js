function Bullet(){
    this.pos = {X: 0, Y: 0};
    this.range = 0;
    this.speed = {X: 0, Y : 0};
    this.prop = 0; // 0:self, 1:enemy
    this.type = 0; // 0: rectangle; 1: circle; 2: self_bullet
    this.img = new Image();
    this.img.src = "img/fire.png";
    this.img.width = "50";
    this.img.height = "50";

    this.init = function(pos, spd, prop, type){
        this.pos.X = pos.X;
        this.pos.Y = pos.Y;
        this.speed.X = spd.X;
        this.speed.Y = spd.Y;
        this.prop = prop;
        this.type = type;
        if(type === 1) this.range = 5;
    };

    this.move = function(){
        this.pos.X += this.speed.X;
        this.pos.Y += this.speed.Y;
    };

    this.draw = function(context){
        switch(this.type){
            case 0:

            break;
            case 1:
                context.beginPath();
                context.fillStyle = "#ff0";
                context.arc(this.pos.X, this.pos.Y, 5, 0, Math.PI * 2, true);
                context.fill();
                context.closePath();
            break;
            case 2:
                context.drawImage(this.img, this.pos.X - 10, this.pos.Y, 20, 20);
            break;
        }
    };
}