/*
 * Globals
 */

var allEnemies = []; // stores all enemy objects
var player;
var gem;
var allGems = []; // stores all gem objects
var possibleGems = ['images/Gem-Green.png', 'images/Gem-Blue.png', 'images/Gem-Orange.png'];
var highestScore = 0;
var newHighScore; // true when a new high score is reached.
var div = document.getElementById('score-board');
var audio = new Audio;
var level = 1;
var score = 0;
var enemyCollection = [
    [
        {
            sprite: 'images/bicycle-irma.png',
            x: -100,
            y: [325],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'right'
        },
        {
            sprite: 'images/car-right-blue.png',
            x: -100,
            y: [415],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'right'
        },
        {
            sprite: 'images/car-right-pink.png',
            x: -100,
            y: [415],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'right'
        },
        {
            sprite: 'images/car-right-green.png',
            x: -100,
            y: [415],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'right'
        },
        {
            sprite: 'images/car-right-orange.png',
            x: -100,
            y: [415],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'right'
        },
        {
            sprite: 'images/car-left-blue.png',
            x: 500,
            y: [90],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'left'
        },
        {
            sprite: 'images/car-left-orange.png',
            x: 500,
            y: [90],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'left'
        },
        {
            sprite: 'images/car-left-pink.png',
            x: 500,
            y: [90],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'left'
        },
        {
            sprite: 'images/car-left-green.png',
            x: 500,
            y: [90],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'left'
        }
    ],
    [
        {
            sprite: 'images/car-right-blue.png',
            x: -100,
            y: [415, 330],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'right'
        },
        {
            sprite: 'images/car-right-pink.png',
            x: -100,
            y: [415, 330],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'right'
        },
        {
            sprite: 'images/car-right-green.png',
            x: -100,
            y: [415, 330],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'right'
        },
        {
            sprite: 'images/car-right-orange.png',
            x: -100,
            y: [415, 330],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'right'
        },
        {
            sprite: 'images/car-left-blue.png',
            x: 500,
            y: [90, 175],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'left'
        },
        {
            sprite: 'images/car-left-orange.png',
            x: 500,
            y: [90, 175],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'left'
        },
        {
            sprite: 'images/car-left-pink.png',
            x: 500,
            y: [90, 175],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'left'
        },
        {
            sprite: 'images/car-left-green.png',
            x: 500,
            y: [90, 175],
            width: 100,
            height: 70,
            xoffset: 0,
            yoffset: 50,
            orientation: 'left'
        }
    ],
    [
        {
            sprite: 'images/train-left.png',
            x: 500,
            y: [135, 305],
            width: 300,
            height: 70,
            xoffset: 0,
            yoffset: 31,
            orientation: 'left'
        },
        {
            sprite: 'images/train-right.png',
            x: -300,
            y: [50, 390],
            width: 300,
            height: 70,
            xoffset: 0,
            yoffset: 31,
            orientation: 'right'
        }
    ]
];

/*
 * Opens the instructions modal on page load. Modal itself uses only css3/html5
 */
window.onload = function() {
    //window.location.href = "#openModal";
}

/*
 * Helper methods
 */

/*
 * The Helper class. Contains methods used for general actions throughout the game
 * that are not specific to any one object.
 */
var Helper = function(){}

/*
 * Function returns a random value. It takes an array of possible values as a parameter.
 */
Helper.returnRandomValue = function(possibleValues){
    var randomStartingPosition = Math.floor(Math.random() * possibleValues.length);
    return possibleValues[randomStartingPosition];
}
/*
 * Function checks whether two elements on the canvas overlap or touch.
 * Takes in two figures as parameters and returns a boolean. The word player
 * is used for clarity only; any figures can be parameters.
 */
Helper.overlap = function(fig1, player){
    return !( player.x + fig1.xoffset > (fig1.x + fig1.width)  ||  // player is to the right of figure 1
            (player.x + player.width - fig1.xoffset) < fig1.x    ||  // player is to the left of fig 1
            player.y + (player.height - fig1.yoffset) < (fig1.y) ||  //player is above fig1
            player.y  > (fig1.y + fig1.height - fig1.yoffset))   //player is below fig1
}

/*
 * Function takes two game elements and returns
 * true if they are in the same block. Used for gem collisions,
 * since an exact overlap is not required. The player
 * just needs to be on the same block as the gem.
 */
Helper.sameBlock = function(fig1, player){
    var fig1Row = Helper.getRow(fig1);
    var fig1Col = Helper.getCol(fig1);
    var playerRow = Helper.getRow(player);
    var playerCol = Helper.getCol(player);
    if(fig1Row == playerRow && fig1Col == playerCol){
        return true;
    }
}

/*
* Function calculates row number of element. Takes in
* element (object) as parameter and returns an int, row number.
*/
Helper.getRow = function(element){
    var row;
    if((element.y + element.height/2) <= 85){
        row = 0;
    }
    if((element.y + element.height/2) > 85 && (element.y + element.height/2) <= 170){
        row = 1;
    }
    if((element.y + element.height/2) > 170 && (element.y + element.height/2) <= 255){
        row = 2;
    }
    if((element.y + element.height/2) > 255 && (element.y + element.height/2) <= 340){
        row = 3;
    }
    if((element.y + element.height/2) > 340 && (element.y + element.height/2) <= 425){
        row = 4;
    }
    if((element.y + element.height/2) > 425 && (element.y + element.height/2) <= 515){
        row = 5;
    } else {
        row = 6;
    }
    return row;
}

/*
 * Function calculates column number of element. Takes in
 * element (object) as parameter and returns int, col number.
 */
Helper.getCol = function(element) {
    var col;
    if(element.x < 100){
        col = 0;
    }
    if(element.x >= 100 && element.x < 200){
        col = 1;
    }
    if(element.x >= 200 && element.x < 300){
        col = 2;
    }
    if(element.x >= 300 && element.x < 400){
        col = 3;
    }
    if(element.x >= 400){
        col = 4;
    }
    return col;
}

/*
 * Function updates score. Takes in a string of which event has
 * occured as a parameter. In the case of gems, the event is that path for that
 * gem's image. The gemScores object (above) maps images to scores.
 */
Helper.updateScore = function(event){
    if(event == "died") {
        score += 10;
    }
    if(event == "top"){
        level += 1;
        allEnemies = [];
    }
    if (score > highestScore){
        highestScore = score;
        newHighScore = true;
    }

    div.innerHTML = score;
}

/*
 *  Enemies our player must avoid
 *  Enemies have random y-values and speeds from an array of possible values.
 *  As the player scores higher, the enemies move faster and more
 * enemies appear at once. They also cover more of the screen.
 */
var Enemy = function() {
    var enemy = Helper.returnRandomValue(enemyCollection[level-1]);

    this.sprite = enemy.sprite;
    this.x = enemy.x;
    this.y = Helper.returnRandomValue(enemy.y);
    this.width = enemy.width;
    this.height = enemy.height;
    this.speed = Helper.returnRandomValue([200, 250, 280, 300, 320, 350, 400]);
    this.orientation = enemy.orientation;
    this.yoffset = enemy.yoffset;
    this.xoffset = enemy.xoffset;
}

/*
 *  Update the enemy's position
 *  Parameter: dt, a time delta between ticks. Ensures the
 *  game runs at the same speed for all computers.
 */
Enemy.prototype.update = function(dt) {
    if (this.orientation == 'right') {
        this.x += (this.speed) * dt;
    } else {
        this.x -= (this.speed) * dt;
    }

    /*
    * Checks for collision between enemy and player.
    * If any enemy touches with the player, the player is
    * returned to the bottom of the screen.
    */
    allEnemies.forEach(function(enemy, index) {
        if(Helper.overlap(enemy, player)){
            console.log(enemy, player);
            console.log(player.y);
            console.log((enemy.y + enemy.height - enemy.yoffset))
            Helper.updateScore("died");
            player.y = 480;
        }
    });

}

/*
 *  Draw the enemy on the screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

}

/*
 * Static method for instantiating enemy objects by adding random numbers
 * of enemy objects to the *allEnenies array and random times (from a range of values)
 */
Enemy.generateEnemies = function() {
    allEnemies.push(new Enemy());
    Enemy.removeOffScreenEnemies();
    var delay = Helper.returnRandomValue([0, 500, 750, 1000]);
    setTimeout(Enemy.generateEnemies, delay);
}


/*
 * Method loops through allEnemies array and deletes any enemy in the array
 * that has moved off the canavs. The canvas width is set at 505.
 */
Enemy.removeOffScreenEnemies = function() {
    allEnemies.forEach(function(enemy, index) {
        if(enemy.x > 500){
            allEnemies.splice(index, 1);
        }
    });
}


/*
 * Constructor for Player object
 */
var Player = function(){
    this.playerIcon = 'images/avatar/acwel.png';
    this.x = 0;
    this.y = 480;
    this.width = 100;
    this.height = 85;
}

/*
 * Draws Player on the screen
 */
Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.playerIcon), this.x, this.y);
}

/*
 * Moves the player around the screen in response to user pressing keyboard arrows
 */
Player.prototype.handleInput = function(keyCode) {
    score += 1;
    if(keyCode === 'left'){
        if(this.x - 100 < 0){
            this.x = 0;
        } else {
            this.x -= 100; // If it's on the grid, move left by 100
        }
    } else if(keyCode == 'up'){ // top ranges from y=0 to y=85
        if(this.y - 85 < 0){ //prevents pressing up key at top of game from incrementing score
            Helper.updateScore("top");
            this.y =  480;
        }
         else {
            this.y -= 85;
        }
    } else if(keyCode == 'right'){
         if(this.x + 100 > 400){  //Player's maximum rightward position
                this.x = 400;
            } else {
                this.x += 100;
            }
    } else if(keyCode == 'down') {
        if(this.y + 85 > 480) {  //Players maximum distance from the top of the canvas
            this.y = 480;
        } else {
            this.y += 85;
        }
    } else {
        score -= 1;
    }

    div.innerHTML = score;
}

// Instantiate Objects
Enemy.generateEnemies();
player = new Player();


/*
 * This listens for key presses and sends the keys to the Player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
