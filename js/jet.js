function Jet(){
    this.pos = {X: 0, Y: 0};
    this.img = new Image();
    this.size = {W: 50, H: 50};
    this.speed = 1;
    this.bulletList = [];
    this.firepower = 2;
    this.img.src = "img/plane_0.png";
    this.img.width = "50";
    this.img.height = "50";
    this.destroyed = false;
    this.life = 3;

    this.init = function(){
        this.pos.X = 256;
        this.pos.Y = 700;
    };

    this.move = function(direction){
        switch(direction){
            case "up":
                if(this.pos.Y > (this.speed)) this.pos.Y -= this.speed;
            break;
            case "left":
                if(this.pos.X > this.speed) this.pos.X -= this.speed;
                else this.pos.X = 0;
            break;
            case "right":
                if(this.pos.X < 512 - this.speed) this.pos.X += this.speed;
                else this.pos.X = 512;
            break;
            case "down":
                if(this.pos.Y < (768 - this.speed - this.size.H)) this.pos.Y += this.speed;
            break;
        }
    };

    this.isHit = function(bullet){
        var hitCenter = {X: this.pos.X - 1, Y: this.pos.Y + 26};
        if(bullet.prop === 0) return false;
        var dist = Math.sqrt((hitCenter.X - bullet.pos.X) * (hitCenter.X - bullet.pos.X)
            + (hitCenter.Y - bullet.pos.Y) * (hitCenter.Y - bullet.pos.Y));
        return (dist < (5 + bullet.range));
    };

    this.fire = function(){
        if(this.destroyed) return false;
        var bullet = null;
        switch(this.firepower){
            case 1:
                bullet = new Bullet();
                bullet.init(this.pos, {X: 0, Y: -15}, 0, 2);
                this.bulletList.push(bullet);
            break;
            case 2:
                bullet = new Bullet();
                bullet.init({X: this.pos.X - 5, Y: this.pos.Y}, {X: 0, Y: -15}, 0, 2);
                this.bulletList.push(bullet);
                bullet = new Bullet();
                bullet.init({X: this.pos.X + 5, Y: this.pos.Y}, {X: 0, Y: -15}, 0, 2);
                this.bulletList.push(bullet);
            break;
            case 3:
                bullet = new Bullet();
                bullet.init({X: this.pos.X, Y: this.pos.Y}, {X: 0, Y: -15}, 0, 2);
                this.bulletList.push(bullet);
                bullet = new Bullet();
                bullet.init({X: this.pos.X - 5, Y: this.pos.Y}, {X: -1, Y: -15}, 0, 2);
                this.bulletList.push(bullet);
                bullet = new Bullet();
                bullet.init({X: this.pos.X + 5, Y: this.pos.Y}, {X: 1, Y: -15}, 0, 2);
                this.bulletList.push(bullet);
            break;
            case 4:
                bullet = new Bullet();
                bullet.init({X: this.pos.X - 5, Y: this.pos.Y}, {X: 0, Y: -15}, 0, 2);
                this.bulletList.push(bullet);
                bullet = new Bullet();
                bullet.init({X: this.pos.X + 5, Y: this.pos.Y}, {X: 0, Y: -15}, 0, 2);
                this.bulletList.push(bullet);
                bullet = new Bullet();
                bullet.init({X: this.pos.X - 5, Y: this.pos.Y}, {X: -2, Y: -15}, 0, 2);
                this.bulletList.push(bullet);
                bullet = new Bullet();
                bullet.init({X: this.pos.X + 5, Y: this.pos.Y}, {X: 2, Y: -15}, 0, 2);
                this.bulletList.push(bullet);
            break;
        }
    };

    this.draw = function(context){
        context.drawImage(this.img, this.pos.X - this.size.W / 2, this.pos.Y, this.size.W, this.size.H);
        for(var i = 0; i < this.bulletList.length; i++){
            this.bulletList[i].draw(context);
        }
        ctx.font = "12px Arial";
        ctx.fillText("能量盾", 470, 700);
        switch(this.life){
            case 3:
                ctx.fillStyle = "#0f0";
                ctx.fillRect(470, 710, 36, 60);
                break;
            case 2:
                ctx.fillStyle = "#ff0";
                ctx.fillRect(470, 730, 36, 40);
                break;
            case 1:
                ctx.fillStyle = "#f00";
                ctx.fillRect(470, 750, 36, 20);
                break;
        }
        if(this.destroyed){
            context.fillStyle = "#fff";
            context.font="40px Arial";
            context.fillText("Game Over", 150, 350);
            context.fillText("按'R'重开", 170, 400);
            context.font="20px Arial";
            context.fillText("Final Score:", 170, 450);
            context.fillText(score + "", 270, 480);
        }
    };

    this.moveBullet = function(enemies){
        for(var i = 0; i < this.bulletList.length; i++){
            if(this.bulletList[i].pos.Y < 0){
                this.bulletList.splice(i, 1);
                i--;
                continue;
            }
            this.bulletList[i].move();
            for(var j = 0; j < enemies.length; j++){
                var enemy = enemies[j];
                if(enemy.isHit(this.bulletList[i], this)){
                    this.bulletList.splice(j, 1);
                    j--;
                    break;
                }
            }
        }
    };

    this.destroy = function(){
        this.life -= 1;
        if(this.life <= 0){
            this.img.src = "img/boom_big.png";
            this.img.width = "50";
            this.img.height = "50";
            this.size.W = 50;
            this.size.H = 50;
            this.destroyed = true;
        }
    };

    this.init();

}