
var Helper = function(){}
// Function returns a random int. It takes an array of possible ints as a parameter.
Helper.returnRandomInt = function(possibleInts){
    var randomStartingPosition = Math.floor(Math.random() * possibleInts.length);
    return possibleInts[randomStartingPosition];
}

// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = Helper.returnRandomInt([60, 145, 230]);  // randomly assign either 60, 150 or 240
    this.speed = Helper.returnRandomInt([100, 150, 200, 250]);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // update enemy location - change this.x
    this.x += (this.speed) * dt;

    // handle collision with player 
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    console.log("enemy render");
    
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
}

// Static methods for instantiating and removing enemy objects
Enemy.generateEnemies = function() {
    allEnemies.push(new Enemy());
    Enemy.removeOffScreenEnemies();
    var delay = Helper.returnRandomInt([500, 1000, 1500]);
    setTimeout(Enemy.generateEnemies, delay);
    console.log(allEnemies.length);

}

// Method loops through allEnemies array and deletes any enemy in the array that has moved off the canavs. The canvas width is set at 505.
Enemy.removeOffScreenEnemies = function() {
    allEnemies.forEach(function(enemy, index) {
        if(enemy.x > 505){
            allEnemies.splice(index, 1);
        }
    });
}


// Now write your own player class
var Player = function(){
    //image for player
    // ultimtately this will be selected by the user 
    this.playerIcon = 'images/char-cat-girl.png';
    this.x = Helper.returnRandomInt([0, 100, 200, 300, 400]);
    this.y = 380;
}


Player.prototype.update = function() {

}

Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.playerIcon), this.x, this.y);
}

Player.prototype.handleInput = function() {

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies

var allEnemies = [];
Enemy.generateEnemies();

// Place the player object in a variable called player
var player = new Player();

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



