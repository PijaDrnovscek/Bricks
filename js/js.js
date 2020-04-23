var canvas=document.getElementById("Canvas");
var ctx=canvas.getContext("2d");

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);
 
document.addEventListener("mousemove", mouseMoveHandler, false);
 
var x=canvas.width/2;
var y=canvas.height-50;
var dx=3.5;
var dy=-3.5;

var rightPress=false;  //pritisk na desni
var leftPaddingPress=false;  //pritisk na levi

//paddle
var paddleHeight=20;
var paddleWidth=140;
var paddleX=(canvas.width-paddleWidth)/2;

 //ball
var ballRadius= 18;
var ballColor = "#d1c7d0"


 //bricks
var brickWidth=183;
var brickHeight=45;
var brickPadding=5;
var topPadding=15;
var leftPadding=20;
var Rows=5;
var Columns=5;

//točke
var score=0;

//timer
var sekunde;
var sekundeI;
var minuteI;
var intTimer;
var izpisTimer;

//življenja
var lives=3;

var start=true;

sekunde = 0;
izpisTimer = "00:00";
intTimer = setInterval(timer, 1000);
 
var bricks=[];
for(c=0;c<Columns;++c){
  bricks[c]=[];
  for(r=0;r<Rows;++r){
    bricks[c][r]={x:0,y:0,status:1};
  }
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
	
    drawBall();
    drawPaddle();
	drawBricks();
	
	collisionDetection();
	
	x += dx;
	y += dy;
				
	if(x + dx  > canvas.width-ballRadius || x + dx < ballRadius) { //odboj po x osi || od kje se žoga odbije glede na radius(levo)
		dx = -dx;
	}
	

		
    if( y >= canvas.height-ballRadius*2-15 && x > paddleX && x < paddleX+paddleWidth){
		dy=-dy;
		start=true;
    }else if(y + dy > canvas.height-ballRadius){
		clearInterval(intTimer);
		lives--;
		if(lives==0)
			document.location.reload();
		drawLives();
	    	sekunde = 0;
		izpisTimer = "00:00";
		intTimer = setInterval(timer, 1000);
	}
	
	
	if(y + dy > canvas.height-ballRadius || y + dy< ballRadius) {
	//odboj po y osi || od kje se žoga odbije glede na radius(gor)
		dy = -dy;
	}
   
    if(rightPress && paddleX<canvas.width-paddleWidth)
		paddleX+=7;
    else if(leftPaddingPress && paddleX>0)
		paddleX-=7;

		
}
 
function drawBall(){
	ctx.beginPath();
	ctx.arc(x,y,ballRadius,0,Math.PI*2);
	ctx.fillStyle=ballColor;
	ctx.fill();
	ctx.closePath();
}
 
function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX,canvas.height-paddleHeight-15,paddleWidth,paddleHeight);
	ctx.fillStyle="#0a080a";
	ctx.fill();
	ctx.closePath();
}


function keyDownHandler(e){
	if(e.keyCode==39)
		rightPress=true;
	else if(e.keyCode==37)
		leftPaddingPress=true;
}
 
function keyUpHandler(e){
	if(e.keyCode==39)
		rightPress=false;
	if(e.keyCode==37)
		leftPaddingPress=false;
}

function mouseMoveHandler(e){
	var relativeX=e.clientX-canvas.offsetLeft;
 
	if(relativeX>0 && relativeX<canvas.width){
		if((relativeX-paddleWidth/2>=0) && (relativeX-paddleWidth/2<=(canvas.width-paddleWidth)))
        paddleX=relativeX-paddleWidth/2;
  }
}


function drawBricks(){
 
	for(c=0;c<Columns;++c){
		for(r=0;r<Rows;++r){
			if(bricks[c][r].status==1){
	 
				var brickX = (c*(brickWidth+brickPadding))+leftPadding;
				var brickY = (r*(brickHeight+brickPadding))+topPadding;
				bricks[c][r].x=brickX;
				bricks[c][r].y=brickY;
				
				ctx.beginPath();
				ctx.rect(brickX,brickY,brickWidth,brickHeight);
			   
				if(r==0){
					if(c%2==0)
						ctx.fillStyle="#d1c7d0";
					else
						ctx.fillStyle="#0a080a";
				}
				else if(r%2==0)
					ctx.fillStyle="#b66fc4";
				else
					ctx.fillStyle="#552fa9";
				
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function collisionDetection(){
	for(c=0;c<Columns;++c){
		for(r=0;r<Rows;++r){
			var b=bricks[c][r];
			if(b.status==1){
				if(x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight+ballRadius){
					dy=-dy;
					b.status=0;
					if(r==0){
						score=score+2;
					}
					else{
						score++;
					}
					drawScore();
          }
      }
    }
  }
}

function drawScore(){
	document.getElementById("score").innerHTML = score;
}

function timer(){
	if(start==true){
		sekunde++;

		sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0"+sekundeI;
		minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0"+minuteI;
		izpisTimer = minuteI + ":" + sekundeI;
	
		document.getElementById("timer").innerHTML = izpisTimer;
	}else{
		sekunde=0;
		izpisTimer = "00:00";
		document.getElementById("timer").innerHTML = izpisTimer;
	}
	
}
 
function drawLives(){
	document.getElementById("lives").innerHTML =  "<img src='img/" + lives +  ".png'>";
}


setInterval(draw,11);//hitrost
