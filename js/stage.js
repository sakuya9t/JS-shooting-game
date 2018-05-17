function Stage(){
    this.framecnt = 0;
    this.eventList = [];
    this.enemies = [];
    this.enemyid = 0;
    this.starttime = new Date().getTime();
    this.stagemap = new StageMap(this);

    this.init = function(){
        this.framecnt = 0;
        this.eventList = [];
        this.enemies = [];
        this.enemyid = 0;
        this.starttime = new Date().getTime();
    };

    this.read = function(i){
        this.init();
        this.stagemap.play(i);
    }.bind(this);

    this.addEvent = function(type, index, params, startframe, duration){
        var F = null;
        var b = false;
        switch(type){
            case "addEnemy":
                F = function(){this.addEnemy(params[0], params[1], params[2], params[3])}.bind(this);
                b = true;
            break;
            case "enemyMove":
                F = function () {this.moveEnemy(index, params, duration)}.bind(this);
                b = true;
            break;
            case "enemyAttack":
                F = function(){this.enemyAttack(index, params[0], params[1], params[2], params[3], params[4], params[5])}.bind(this);
                b = true;
            break;
            case "enemyRemove":
                F = function(){this.removeEnemy(index)}.bind(this);
                b = true;
            break;
            case "win":
                F = function(){this.winCondition(index)}.bind(this);
                b = true;
        }
        if(b) this.eventList.push({type: type, F: F, start: startframe, d: duration});
    };

    this.addEnemy = function(posX, posY, type, life){
        //type: 0-small; 1-big
        var enemy = new Enemy({X: posX, Y: posY}, type, this.enemyid, life);
        this.enemies.push(enemy);
        this.enemyid += 1;
    };

    this.enemyAttack = function(id, attackType, attackSpeed, intv, arg1, arg2, arg3){
        //attackType: 0-自机狙;1-360辐射固定;2-360辐射旋转;3-角度范围固定
        //attackSpeed: 弹速
        //intv: 射击间隔
        //arg1: 自机/单次子弹数量
        //arg2: 起始角度
        //arg3: 旋转速度/终止角度
        var e = this.enemyExists(id);
        if(e) e.setAttackType(attackType, attackSpeed, intv, arg1, arg2, arg3);
    };

    this.moveEnemy = function(id, params, duration){
        var e = this.enemyExists(id);
        if(e){
            e.move(params[0], duration);
        }
    };

    this.removeEnemy = function(id){
        var e = this.enemyExists(id);
        if(e){
            e.destroy();
        }
    };

    this.act = function(){
        this.framecnt += 1;
        for(var i = 0; i < this.eventList.length; i++){
            if(this.framecnt < this.eventList[i].start) continue;
            if(this.framecnt > (this.eventList[i].start + this.eventList[i].d)){
                this.eventList.splice(i, 1);
                i--;
                continue;
            }
            this.eventList[i].F(this.eventList[i]);
        }
    };

    this.move = function(enemy, fn){
        if(enemy)
            stage.enemies[0].move({X: 100, Y: 200}, 120);
    };

    this.enemyExists = function(id){
        for(var i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].id === id) return this.enemies[i];
        }
        return null;
    };

    this.winCondition = function(enemyid){
        var t = setInterval(function(){
            var e = this.enemyExists(enemyid);
            if(!e){
                if(stageid === 1){
                    win = true;
                }
                else{
                    stageid += 1;
                    resetGame(stageid);
                }
                clearInterval(t);
            }
        }.bind(this), 100);
    };


}