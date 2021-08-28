// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
// const musicSound = new Audio('music/music.mp3');
const musicSound = new Audio('music/backgroundMusic.mp3');

//mobile section starts
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

var gamePaused = false

function getTouches(evt) {
    return evt.touches ||          // browser API
        evt.originalEvent.touches; // jQuery
}

function togglePausePlay() {
    gamePaused = !gamePaused

    if (gamePaused) {
        musicSound.pause();
        paused.innerHTML = 'Game is Paused! Touch or Press P button to play';
    } else {
        musicSound.play();
        paused.innerHTML = '';
    }
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];

    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    console.log('xDown || !yDown??', xDown, yDown)

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            /* right swipe */
            console.log("SwapRight");
            inputDir.x = -1;
            inputDir.y = 0;
        } else {
            /* left swipe */
            console.log("SwapLeft");
            inputDir.x = 1;
            inputDir.y = 0;
        }
    } else {
        if (yDiff > 0) {
            /* down swipe */
            console.log("SwapDown");
            inputDir.x = 0;
            inputDir.y = -1;
        } else {
            /* up swipe */
            console.log("SwapUp");
            inputDir.x = 0;
            inputDir.y = 1;
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

let speed = 7;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];

food = { x: 6, y: 7 };

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime)
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    //if paused
    if (gamePaused === true) {
        return
    }

    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };

        paused.innerHTML = 'Game Over. Press any key to play again!';

        snakeArr = [{ x: 13, y: 15 }];
        // musicSound.play();
        score = 0;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);
}


// Main logic starts here
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    // inputDir = { x: 0, y: 1 } // Start the game  //commenting as it reset the position every pause play time
    if (!gamePaused) {
        paused.innerHTML = '';
        musicSound.play();
    }

    console.log('e.key??', e.key)
    switch (e.key) {
        case "ArrowUp":
            if (gamePaused) return

            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            if (gamePaused) return

            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            if (gamePaused) return

            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            if (gamePaused) return

            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;

        case "p":
            console.log("pause and play request.");
            togglePausePlay()
            break;

        case "P":
            console.log("pause and play request.");
            togglePausePlay()
            break;

        default:
            break;
    }

});