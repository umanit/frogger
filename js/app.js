/*
 * Globals 
 */

// All enemy objects are stored in an array, allEnemies
var allEnemies = [];

var player;

/*
 * Helper methods 
 */

var Helper = function(){}
// Function returns a random int. It takes an array of possible ints as a parameter.
Helper.returnRandomInt = function(possibleInts){
    var randomStartingPosition = Math.floor(Math.random() * possibleInts.length);
    return possibleInts[randomStartingPosition];
}
// Function checks whether two figures on the canvas overlap. Takes in two figures as parameters and returns a boolean.
Helper.overlap = function(fig1, fig2){
    var yoffset = 40;
    var xoffset = 100;
    return !( fig2.x + xoffset > (fig1.x + fig1.width)  ||  // fig2 is to the right of figure 1
            (fig2.x + fig2.width - xoffset) < fig1.x    ||  // fig2 is to the left of fig 1
            fig2.y + (fig2.height - yoffset) < (fig1.y) ||  //fig2 is above fig1
            fig2.y  > (fig1.y + (fig1.height - yoffset)))   //fig2 is below fig1
}

// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = Helper.returnRandomInt([60, 145, 230]);  // randomly assign either 60, 150 or 240
    this.width = 171;
    this.height = 101;
    this.speed = Helper.returnRandomInt([200, 250, 300, 350, 400]);
}

// Update the enemy's position
// Parameter: dt, a time delta between ticks. Ensures the game runs at the same speed for all computers.
Enemy.prototype.update = function(dt) {
    this.x += (this.speed) * dt;
    
    // Checks for collision between enemy and player. If any enemy touches with the player, the player is returned to the bottom of the screen.
    allEnemies.forEach(function(enemy, index) {
        if(Helper.overlap(enemy, player)){
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
    var delay = Helper.returnRandomInt([0, 500, 1000]);
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
    // Ultimtately this image will be selected by the user 
    this.playerIcon = 'images/char-cat-girl.png';
    this.x = Helper.returnRandomInt([0, 100, 200, 300, 400]);
    this.y = 380;
    this.width = 171;
    this.height = 101;
}


Player.prototype.update = function() {

}

Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.playerIcon), this.x, this.y);
}

Player.prototype.handleInput = function(keyCode) {
    if(keyCode === 'left'){
        if(this.x - 101 < 0){ // Check new position is on grid
            this.x = 0; // If it's off the grid, move to x = 0
        } else {
            this.x -= 101; // If it's on the grid, move left by 100
        }  
    } else if(keyCode == 'up'){
         if(this.y - 83 < 0){ 
            this.y = 0; 
        } else {
            this.y -= 83; 
        }  
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
Enemy.generateEnemies();
player = new Player();


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



