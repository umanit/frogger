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
var score = 0;
var div = document.getElementById('score-board');
var audio = new Audio;
var level = 1;

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
            player.y  > (fig1.y + (fig1.height - fig1.yoffset)))   //player is below fig1
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
    if((element.y + element.height/2) > 425){
        row = 5;
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
 * Helper function returns an int, the number of points each gem is worth.
 * It takes a string which is the path for that gem's image and maps images to scores on a
 * gemScores object.
 */
Helper.getGemScore = function(gemImageString){
    var gemScores = {
        "images/Gem-Green.png": 20,
        "images/Gem-Blue.png": 30,
        "images/Gem-Orange.png": 50
        }
    return gemScores[gemImageString];
}

/*
 * Helper function displays a scoreboard with the player;s highest score so far.
 */
Helper.showHighScore = function(){
    var w = window.innerWidth;
    var h = window.innerHeight;
    var div = document.getElementById('high-score');
    div.style.right = (((w - 500)/2) - 200 )/2 + "px";
    div.style.top = (h - 200)/2 + "px";
    div.style.display = "block";
    var URL = encodeURIComponent("http://www.katielouw.com/sites/Frogger");
    var text = encodeURIComponent("I scored " + highestScore + " on Frogger!")
    div.innerHTML = "High Score: " + highestScore + '<a class="twitter-share-button" id="tweet-score" target="_blank" href="https://twitter.com/share?url='+ URL +'&text='+ text +'">Tweet Your Score</a>';
}

/*
 * Function updates score. Takes in a string of which event has
 * occured as a parameter. In the case of gems, the event is that path for that
 * gem's image. The gemScores object (above) maps images to scores.
 */
Helper.updateScore = function(event){
    if(possibleGems.indexOf(event) > -1){ // if the event string is found in the array of possible gems
        score += Helper.getGemScore(event);
        div.innerHTML = "Gem! Score: " + score;
        audio.src = 'sounds/smw_power-up.wav';
        audio.play();
    }
    if(event == "died") {
        if(newHighScore){
            Helper.showHighScore();
        }
        newHighScore = false;
        score = 0;
        div.innerHTML = "You Died! Score: " + score;

        div.style.backgroundColor = "#E1077F";
        div.style.color = "#ADFF17";
    }
    if(event == "top"){
        level += 1;
        score += 10;
        div.innerHTML = "Yay! Score: " + score;
    }
    if (score > highestScore){
        highestScore = score;
        newHighScore = true;
    }
}

/*
 *  Enemies our player must avoid
 *  Enemies have random y-values and speeds from an array of possible values.
 *  As the player scores higher, the enemies move faster and more
 * enemies appear at once. They also cover more of the screen.
 */
var Enemy = function() {
    this.sprite = 'images/train.png';
    this.x = -300;
    this.y = Helper.returnRandomValue([50, 135, 300, 390]);
    this.width = 300;
    this.height = 100;
    this.speed = Helper.returnRandomValue([200, 250, 280, 300, 320, 350, 400]);//

    this.yoffset = 10;
    this.xoffset = 10;

}

/*
 *  Update the enemy's position
 *  Parameter: dt, a time delta between ticks. Ensures the
 *  game runs at the same speed for all computers.
 */
Enemy.prototype.update = function(dt) {
    this.x += (this.speed) * dt;
    /*
    * Checks for collision between enemy and player.
    * If any enemy touches with the player, the player is
    * returned to the bottom of the screen.
    */
    allEnemies.forEach(function(enemy, index) {
        if(Helper.overlap(enemy, player)){
            Helper.updateScore("died");
            player.y = 380;
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
    var delay;
    if(score >= 200){
        delay = Helper.returnRandomValue([0, 200, 500, 750]);
     } else {
        delay = Helper.returnRandomValue([0, 500, 750, 1000]);
     }
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
    this.playerIcon = 'images/char-cat-girl.png';
    this.x = Helper.returnRandomValue([0, 100, 200, 300, 400]);
    this.y = 430;
    this.width = 171;
    this.height = 101;
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
                this.y = 430;
            } else {
                this.y += 85;
            }

    }
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
