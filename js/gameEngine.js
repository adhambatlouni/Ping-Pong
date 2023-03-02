window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)} 

	
	let keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);
	
	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

class Game{
	
	constructor(){
		this.canvas = document.getElementById("myCanvas");
		this.ctx = this.canvas.getContext("2d");
		this.sprites = [];

	}
	update(){
		let lSpritesLength = this.sprites.length;
		let canvas = this.canvas;
		for (let i = 0;i < lSpritesLength; i++)
			this.sprites[i].update(canvas);
			
	}
	addSprites(pSprites){
		this.sprites.push(pSprites);
	}
	draw(){
	this.ctx.fillStyle = "#2a9df4"; 
        
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		let lSpritesLength = this.sprites.length;
		for (let i = 0;i < lSpritesLength; i++)
			this.sprites[i].draw(this.ctx);

		this.drawScore(player.score, 200, 100);
        

		this.drawScore(computer.score, 600, 100);
	}
	drawScore(text,x,y){
        this.ctx.fillStyle = "#FFF";
		this.ctx.font = "60px fantasy";
        this.ctx.fillText(text, x, y);
    }
}

class Sprite{
	constructor(){
	}
	update(){
	}
	draw(pCtx){
	}
}

class Ball extends Sprite{
	constructor(canvas, player, computer){
		super();
		this.cX = canvas.width / 2;
		this.cY = canvas.height / 2;
		this.radius = 7;
		this.color = '#fff';
		this.dx = 1;
		this.dy = 1;
		this.player = player;
		this.computer = computer;
		this.canvas = canvas;
		
	}
	update(canvas){
		
		if((this.cX < player.x + player.width) && (this.cX > player.x) && (this.cY < player.y + player.height)
		&& (this.cY + this.radius > player.y)) {
			this.dx = 1;			
		}

		if((this.cX < computer.x + computer.width) && (this.cX > computer.x) && (this.cY < computer.y + computer.height)
		&& (this.cY + this.radius > computer.y)) {
			this.dx = -1;			
		}
		
		if (this.cY + this.radius >= 600){
			this.dy = -1;
		}
		if (this.cY - this.radius < 0){
			this.dy = 1;
		}
		if (this.cX + this.radius >= canvas.width) {
            player.score += 1;
			this.reset(canvas);
        }

        if (this.cX - this.radius <= 0) {
            computer.score += 1;
            this.reset(canvas);
        }			
		this.cX += this.dx;
		this.cY += this.dy;		
	}

	draw(ctx){
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.cX, this.cY, this.radius, 2*Math.PI, false);
		ctx.closePath();
        ctx.fill();     
	}

	reset(canvas) {
        this.cX = canvas.width / 2;
        this.cY = canvas.height / 2;
		
		this.dx = -this.dx;
		this.dy = -this.dy;
      }
}

class Net extends Object{

    constructor(canvas){
        super();
        this.netWidth = 4; 
        this.netHeight = 10;
        this.x = (canvas.width - 2)/2; 
        this.y = 0; 
        this.color = "#FFF"; 
    }

    update(){

    }

    drawRectNet(x, y, w, h, ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, w, h);
    }

    draw(ctx){
        
        for(let i = 0; i <= 600; i+=15) 
            this.drawRectNet(this.x, this.y + i, this.netWidth, this.netHeight, ctx);
    }
}
   

class Player extends Sprite{

    constructor(canvas,ball){
        super();
        this.width = 10; 
        this.height = 80; 
        this.x = 10; 
        this.y = canvas.height / 2 - this.height / 2; 
        this.color = "#000000"; 
		this.score = 0;
		this.dy = 1;
		this.ball = ball;
    }

    update(){
		if(87 in keysDown) { 
			this.y--;
		}
		if(83 in keysDown) { 
			this.y++;
		}
		if(this.y < 0) {
			this.y = 600;
		}
		if(this.y > 600) {
			this.y = 0;
		} 
    }

	draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Computer extends Sprite{

    constructor(canvas, ball){
        super();
        this.width = 10; 
        this.height = 80; 
        this.x = canvas.width - 20; 
        this.y = 0; 
        this.color = "#000000"; 
		this.score = 0;
		this.speed = 200;
		this.dy = 0.95;
		this.ball = ball;
		this.canvas = canvas;
    }

	update(){
		
		if(this.y > ball.cY){
			this.y -= this.dy;
			this.dy = 0.95;
		} 
		if(this.y < ball.cY){
		   this.y += this.dy;
		   this.dy = 0.95;
	    }  
	   
	   
	}

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
let myGame = new Game();
let net = new Net(myGame.canvas);
let ball = new Ball(myGame.canvas);
let player = new Player(myGame.canvas);
let computer = new Computer(myGame.canvas);

myGame.addSprites(ball);
myGame.addSprites(net);
myGame.addSprites(player);
myGame.addSprites(computer);

function animate(){
	let now = Date.now();
    let delta = now - then;

	myGame.update(delta/1000);
	myGame.draw();
	requestAnimationFrame(animate);

    then = now;
}
let then = Date.now();
animate();

