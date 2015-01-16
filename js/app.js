/*
 * Globals 
 */

// Scoreboard: Each successful water mission gets 10 points. If you collide with an enemy you lose all your points 
 // Heart: get another life. Can handle one collision without going back or losing points 
 // Key: 

 // green gem: get 10 points 
 // blue gem: get 20 points 
 // orange gem: get 50 points 
 // star: 100 points (rare)

 // Key: Key of life. You are now immortal! 
 // Rock: you trip and fall. You can't move for a delay of 1000


// All enemy objects are stored in an array, allEnemies
var allEnemies = [];
var div = document.getElementById('score-board');
var player;
var gem;
var assets = []; // keeps track of the player's attributes (heart, rock, key)
var allGems = [];
var score = 0;
var audio = new Audio;

/*
 * Helper methods 
 */

var Helper = function(){}
// Function returns a random value. It takes an array of possible values as a parameter.
Helper.returnRandomValue = function(possibleValues){
    var randomStartingPosition = Math.floor(Math.random() * possibleValues.length);
    return possibleValues[randomStartingPosition];
}
// Function checks whether two figures on the canvas overlap. Takes in two figures as parameters and returns a boolean.
Helper.overlap = function(fig1, player){
    return !( player.x + fig1.xoffset > (fig1.x + fig1.width)  ||  // player is to the right of figure 1
            (player.x + player.width - fig1.xoffset) < fig1.x    ||  // player is to the left of fig 1
            player.y + (player.height - fig1.yoffset) < (fig1.y) ||  //player is above fig1
            player.y  > (fig1.y + (fig1.height - fig1.yoffset)))   //player is below fig1
}
// Updates score. Takes in a string of which event has occured as a parameter.
Helper.updateScore = function(event){
    if(event == "died") {
        score = 0;
        div.innerHTML = "You Died! Score: " + score;
        div.style.backgroundColor = "#E1077F";
        div.style.color = "#ADFF17";
        audio.src = 'Meh.m4a';
        audio.play();
    }
    if(event == "water" ||  event == "green-gem"){
        score += 10;
        div.innerHTML = "Yay! Score: " + score;
        audio.src = 'smw_swimming.wav';
        audio.play();
    }
    if(event == "blue-gem"){
        score += 20;
        div.innerHTML = "Gem! Score: " + score;
        
    }
    if(event == "orange-gem"){
        score += 50;
        div.innerHTML = "Gem! Score: " + score;
        
    }
    if(event == "star"){
        score += 100;
        div.innerHTML = "Star Gem! Score: " + score;
    }
    if(score >= 100){
        div.innerHTML = "Wow! Score: " + score;
        div.style.backgroundColor = "#FDB93A";
        div.style.color = "#E1077F";

    }
    if(score == 100 || score == 200){
        div.innerHTML = "*New Level!!!* " + score
        ;
        audio.src = 'smw_1-up.wav';
        audio.play();
    }
    if(score >= 200){
        div.innerHTML = "OMG! Score: " + score;
        div.style.backgroundColor = "#E8FB2D";
        div.style.color = "#0AAEFF";
    } 
    //div.innerHTML = "Yay! Score: " + score;
    
}

// Constructor creates a gem object. Takes in a string of the gem type, e.g. "green-gem"
var Gem = function() {
    this.gemImage = Helper.returnRandomValue(['images/Gem-Green.png', 'images/Gem-Blue.png', 'images/Gem-Orange.png', 'images/Star.png',  "images/Key.png","images/Rock.png" ]);
    this.x = Helper.returnRandomValue([126, 227, 328]);
    this.y = Helper.returnRandomValue([115, 200, 275]);
    this.width = 50;
    this.height = 85;
    this.yoffset = 65;
    this.xoffset = 0;
    console.log("gem y is: " + (this.y + this.yoffset));
    
}

// gem: 115 
// player: 131  

// // Draw the Gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.gemImage), this.x, this.y);
}

Gem.prototype.update = function() {
    allGems.forEach(function(gem, index) {
        if(Helper.overlap(gem, player)){
            Helper.updateScore("blue-gem");
            Gem.expireGem(gem);
            audio.src = 'smw_power-up.wav';
            audio.play();
        }
    });
}

// A static methos to generate gems.
Gem.generateGem = function() {
    newGem = new Gem();
    allGems.push(newGem);
    audio.src = 'smw_power-up_appears.wav';
    audio.play();
    var delay = Helper.returnRandomValue([10000]); //10000, 30000, 60000, 100000
    setTimeout(function() { Gem.expireGem(newGem); }, 10000);
    setTimeout(Gem.generateGem, delay);
}

Gem.expireGem = function(expriringGem){
    console.log("expriring");
    allGems.forEach(function(gem, index) {
        if(expriringGem == gem ){
            allGems.splice(index, 1);
        }
    });
}

// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    if(score >= 100){
        this.y = Helper.returnRandomValue([60, 145, 230, 315]); // the y-axis coordinates of the paved tracks enemies can run on 
    } else {
        this.y = Helper.returnRandomValue([60, 145, 230]);
    }
    this.width = 171;
    this.height = 101;
    if(score >= 200){
        this.speed = Helper.returnRandomValue([10]); //250, 300, 350, 400, 500
    } else {
        this.speed = Helper.returnRandomValue([10]);//200, 250, 280, 300, 320, 350, 400
    }
    this.yoffset = 50;
    this.xoffset = 100;
    
}

// Update the enemy's position
// Parameter: dt, a time delta between ticks. Ensures the game runs at the same speed for all computers.
Enemy.prototype.update = function(dt) {
    this.x += (this.speed) * dt;
    
    // Checks for collision between enemy and player. If any enemy touches with the player, the player is returned to the bottom of the screen.
    allEnemies.forEach(function(enemy, index) {
        if(Helper.overlap(enemy, player)){
            Helper.updateScore("died");
            player.y = 380;
        }
    });

}

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
}

// Static methods for instantiating enemy objects
Enemy.generateEnemies = function() {
    allEnemies.push(new Enemy());
    Enemy.removeOffScreenEnemies();
    var delay;
    if(score >= 200){
        delay = Helper.returnRandomValue([75000000]); //0, 200, 500, 750
     } else {
        delay = Helper.returnRandomValue([10000000]); //0, 500, 750, 1000
     }
    setTimeout(Enemy.generateEnemies, delay);
}

// Method loops through allEnemies array and deletes any enemy in the array that has moved off the canavs. The canvas width is set at 505.
Enemy.removeOffScreenEnemies = function() {
    allEnemies.forEach(function(enemy, index) {
        if(enemy.x > 505){
            allEnemies.splice(index, 1);
        }
    });
}


// Player Class
var Player = function(){
    // TODO: allow user to select image 
    this.playerIcon = 'images/char-cat-girl.png';
    this.x = Helper.returnRandomValue([0, 100, 200, 300, 400]);
    this.y = 380;
    this.width = 171;
    this.height = 101;
}

Player.prototype.update = function(dt) {

}

Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.playerIcon), this.x, this.y);
}



Player.prototype.handleInput = function(keyCode) {
    if(keyCode === 'left'){
        if(this.x - 101 < 0){ 
            this.x = 0;
            
        } else {
            this.x -= 101; // If it's on the grid, move left by 100
        }  
    } else if(keyCode == 'up'){ // water ranges from y=0 to y=81

        if(this.y - 83 < 0){ //prevents pressing up key at top of game from incrementing score
            
            Helper.updateScore("water");  
            this.y =  380;   
        }
         else {
            this.y -= 83; 
        } 
        console.log("Player y is: " + this.y); 
    } else if(keyCode == 'right'){ 
         if(this.x + 101 > 400){  //Player's maximum rightward position
                this.x = 400; 
            } else {
                this.x += 101; 
            }
        } else if(keyCode == 'down') { 
            if(this.y + 83 > 380) {  //Players maximum distance from the top of the canvas
                this.y = 380; 
            } else {
                this.y += 83; 
            } 
        
    }
}

// Instantiate Objects
//Enemy.generateEnemies();
player = new Player();


// Randomly generate a gem
Gem.generateGem();

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };


    player.handleInput(allowedKeys[e.keyCode]);
});



