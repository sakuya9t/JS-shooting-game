function Enemy(pos, type, id, life){
    this.pos = pos;
    this.img = new Image();
    this.size = {W: 0, H: 0};
    this.speed = 10;
    this.bulletList = [];
    this.life = life;
    this.type = type;
    this.duration = 0;
    this.movestep = {X: 0, Y: 0};
    this.id = id;
    this.destroyed = false;
    this.scoreAdded = false;

    this.init = function(){
        //small
        if(this.type === 0){
            this.img.src = "img/enemy_small.png";
            this.img.width = "54";
            this.img.height = "40";
            this.size.W = 54;
            this.size.H = 40;
        }
        //big
        else{
            this.img.src = "img/enemy_big.png";
            this.img.width = "130";
            this.img.height = "100";
            this.size.W = 130;
            this.size.H = 100;
        }
    };

    this.setAttackType = function(attacktype, speed, intv, arg1, arg2, arg3){
        if(this.timer) clearInterval(this.timer);
        switch(attacktype){
            case 0://self-shooting
                this.timer = setInterval(function(){
                    this.selfShoot(speed, arg1);
                }.bind(this), intv);
            break;
            case 1://spray
                this.timer = setInterval(function(){
                    this.spray(speed, arg1, arg2);
                }.bind(this), intv);
            break;
            case 2://rotating spray
                var angle = 0;
                this.timer = setInterval(function(){
                    this.spray(speed, arg1, arg2 + angle);
                    angle += arg3;
                }.bind(this), intv);
            break;
            case 3://attack in an angle range
                var startangle = arg2;
                var endangle = arg3;
                var dtheta = (arg3 - arg2) / arg1;
                this.timer = setInterval(function(){
                    for(var i = startangle; i <= endangle; i += dtheta){
                        this.fire(speed, i);
                    }
                }.bind(this), intv);
            break;
            case 4://don't attack
            break;
        }
    };

    this.move = function (targetPos, duration){
        if(this.pos.X > 612 || this.pos.X < 0) this.setAttackType(4);
        if(this.life <= 0) return false;
        if(this.duration > 0) {
            this.pos.X = targetPos.X - this.duration * this.movestep.X;
            this.pos.Y = targetPos.Y - this.duration * this.movestep.Y;
            this.duration -= 1;
            return true;
        }
        if(Math.abs(targetPos.X - this.pos.X) < 1 && Math.abs(targetPos.Y - this.pos.Y) < 1) {
            this.pos.X = targetPos.X;
            this.pos.Y = targetPos.Y;
            return false;
        }
        this.duration = duration;
        this.movestep.X = (targetPos.X - this.pos.X) / this.duration;
        this.movestep.Y = (targetPos.Y - this.pos.Y) / this.duration;
        return true;
    };

    this.isHit = function(bullet, jet){
        if(this.pos.Y <= 0 - this.size.H) return false;
        if(this.life <= 0) return false;
        if(!bullet) return false;
        var pos = bullet.pos;
        if(bullet.prop === 1) return false;
        if(pos.X > this.pos.X - this.size.W / 2 && pos.X < this.pos.X + this.size.W / 2
            && pos.Y < (this.pos.Y + this.size.H * 3 / 4)){
            if(jet.pos.Y < this.pos.Y) return false;
            this.life -= 50;
            return true;
        }
        return false;
    };

    this.fire = function(speed, angle){
        var bullet = new Bullet();
        bullet.init({X: this.pos.X, Y: this.pos.Y + this.size.H}, calcSpeed(speed, angle), 1, 1);
        this.bulletList.push(bullet);
    };

    this.draw = function(context){
        context.drawImage(this.img, this.pos.X - this.size.W / 2, this.pos.Y, this.size.W, this.size.H);
        for(var i = 0; i < this.bulletList.length; i++){
            this.bulletList[i].draw(context);
        }
    };

    this.moveBullet = function(jet){
        for(var i = 0; i < this.bulletList.length; i++){
            if(this.bulletList[i].pos.Y > 768 || this.bulletList[i].pos.X < 0 || this.bulletList[i].pos.X > 512){
                this.bulletList.splice(i, 1);
                i--;
                continue;
            }
            this.bulletList[i].move();
            if(jet.isHit(this.bulletList[i])){
                jet.destroy();
                this.bulletList.splice(i, 1);
                i--;
                break;
            }
        }
    };

    this.destroy = function() {
        this.life = -1;
        var inv = 2000;
        this.setAttackType(4);
        if(this.type === 0) { //small
            this.img.src = "img/boom_small.png";
            this.img.width = "40";
            this.img.height = "40";
            this.size.W = 40;
            this.size.H = 40;
            if(!this.scoreAdded && !jet.destroyed) score += 1000;
        }
        else{
            this.img.src = "img/boom_big.png";
            this.img.width = "100";
            this.img.height = "100";
            this.size.W = 100;
            this.size.H = 100;
            inv = 3500;
            if(!this.scoreAdded && !jet.destroyed) score += 5000;
        }
        this.scoreAdded = true;
        clearInterval(this.timer);
        setTimeout(function(){
            this.size.W = 0;
            this.size.H = 0;
            this.pos.X = -500;
            this.pos.Y = -500;
            this.destroyed = true;
        }.bind(this),inv);
    };

    function calcSpeed(speed, angle){
        return {X: speed * Math.sin(angle * Math.PI / 180), Y : speed * Math.cos(angle * Math.PI / 180)};
    }

    this.selfShoot = function(speed, jet){
        var dy = this.pos.Y - jet.pos.Y;
        var dx = this.pos.X - jet.pos.X;
        var angle = Math.atan(dx / dy);
        if(jet.pos.Y < this.pos.Y) angle += Math.PI;
        this.fire(speed, angle * 180 / Math.PI);
    };

    this.spray = function(speed, cnt, startangle){
        var angle = startangle;
        while(angle < startangle + 360){
            this.fire(speed, angle);
            angle += 360 / cnt;
        }
    };

    this.init();
}