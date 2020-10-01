var boardDimension;
var numberOfCells;

var focusedDimensionButtonIndex;

var currentDirection = 1;
var interval = 300;
var score = 0;

var itemCoord;

var snake = [2,1,0];
var isGameRuning;

renderMenu();

if ("ontouchstart" in document.documentElement) {
        
document.addEventListener('swiped-left', function(e) {
  setDirection("ArrowLeft")
});

document.addEventListener('swiped-right', function(e) {
  setDirection("ArrowRight")
});

document.addEventListener('swiped-up', function(e) {
  setDirection("ArrowUp")
});

document.addEventListener('swiped-down', function(e) {
  setDirection("ArrowDown")
});
    }


function renderMenu(){
    let menu = document.createElement("section");
    menu.classList.add("menu");

    for(let i = 10; i <= 40; i+=10){
        let button = document.createElement("button");
        button.classList.add("dimension-button");
        button.innerHTML = i + "x" + i;
        button.onclick = () =>  setBoardDimension(i, i/10-1);

        menu.appendChild(button);
    }

    let startGameButton = document.createElement("button");
    startGameButton.innerHTML = "Start Game";
    startGameButton.onclick = () => startGame();
    menu.appendChild(startGameButton);

    document.body.appendChild(menu);
}

function hideMenu(){
    let menu = document.querySelector(".menu");
    document.body.removeChild(menu);
}

function showScore(){
    document.querySelector(".score").style.display = "block";
}

function hideScore(){
    document.querySelector(".score").style.display = "none";
}


function setBoardDimension(value, index){
    boardDimension = value;
    numberOfCells = boardDimension*boardDimension;
    focusedDimensionButtonIndex = index;
    fucuseDimensionButton();
    removeAlert();
}

function fucuseDimensionButton(){
    let buttons = document.getElementsByClassName("dimension-button");

    for(let i = 0; i < buttons.length; i++){
        if(i != focusedDimensionButtonIndex){
            buttons[i].classList.remove("selected-dimension")
        }
        else{
            buttons[i].classList.add("selected-dimension")
        }
    }
}

function appendAlert(){
    let alert = document.createElement("p");
    alert.id = "alert";
    alert.innerHTML = "Select board dimension";
    alert.classList.add("alert");
    document.body.appendChild(alert);
}

function removeAlert(){
    let alert = document.getElementById("alert");
    if(alert != null){
        document.body.removeChild(alert);
    }
}

document.addEventListener("keydown", function(event){
    setDirection(event.key);
})

function setDirection(button){
    switch(button){
        case "ArrowRight":
            if(currentDirection != -1){
                currentDirection = 1;
            }
            break;
        case "ArrowLeft":
            if(currentDirection != 1){
                currentDirection = -1;
            }
            break;
        case "ArrowUp":
            if(currentDirection != boardDimension){
                currentDirection = -boardDimension;
            }
            break;
        case "ArrowDown":
            if(currentDirection != -boardDimension){
                currentDirection = boardDimension;
            }
            break;
    }
}



function startGame(){
    if(typeof boardDimension == "undefined"){
        appendAlert();
    }
    else{
        hideMenu();
        showScore();

        renderBoard();
        renderSnake();
        renderItem();
        
        isGameRuning = true;
        setInterval();
    }
}

function renderBoard(){
    let board = document.createElement("section");
    board.classList.add("game-board")
    board.style.gridTemplateColumns = "repeat(" + boardDimension +", 1fr)"

    for(let i = 0; i < numberOfCells; i++){
        let cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
    }

    document.querySelector(".board-placeholder").appendChild(board);
}

function renderSnake(){
    let cells = document.getElementsByClassName("cell")
    snake.forEach(i => cells[i].classList.add("snake-cell"))
}

function renderItem(){

    let cells = document.getElementsByClassName("cell")

    if(itemCoord != null){
        cells[itemCoord].classList.remove("item-cell");
    }

    while(true){
        itemCoord = Math.floor(Math.random() * numberOfCells);

        if(typeof snake.find(x => x == itemCoord) == "undefined"){
            cells[itemCoord].classList.add("item-cell");
            break;
        }
    }
}

function setInterval(){
    moveSnake();
    if(isGameRuning){
        setTimeout(setInterval, interval); 
    }
}

function moveSnake(){

    if(snakeCrashedAgainstItself() || snakeCrashAgainstTheWall()){
        gameOver();
        return;
    }
    appendSingleCellToSnakeHead(snake[0]+currentDirection)
    
    const tail = removeSingleCellFromSnakeTail();
    
    if(itemCoord == snake[0]){
        extendSnake(tail);
        score++;
        increaseSpeed();
        renderItem();
        document.querySelector(".score").innerHTML = "Score: " + score;
    }
}

function snakeCrashedAgainstItself(){
    return typeof snake.slice(1,snake.length).find(x => x == snake[0]) != "undefined";
}

function snakeCrashAgainstTheWall(){
    return (currentDirection == 1 && (snake[0]+1) % boardDimension == 0) ||
        (currentDirection == -1 && snake[0] % boardDimension == 0) ||
        (currentDirection == -boardDimension && snake[0] - boardDimension < 0) ||
        (currentDirection == boardDimension && snake[0] + boardDimension > numberOfCells - 1);
}

function appendSingleCellToSnakeHead(coord){
    fillSingleSnakeCell(coord);
    snake.unshift(coord);
}

function fillSingleSnakeCell(number){
    document.getElementsByClassName("cell")[number].classList.add("snake-cell");
}

function gameOver(){

    let popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container")


    let popup = document.createElement("div");
    popup.classList.add("popup")

    let h2 = document.createElement("h2");
    h2.innerHTML = "Game Over";
    popup.appendChild(h2)


    let scoreSpan = document.createElement("span");
    scoreSpan.classList.add("score-popup")
    scoreSpan.innerHTML = "Your score: " + score;
    popup.appendChild(scoreSpan);

    let tryAgainButton = document.createElement("button");
    tryAgainButton.innerHTML = "Try again";
    tryAgainButton.onclick = () => tryAgain();
    popup.appendChild(tryAgainButton);

    popupContainer.appendChild(popup)

    document.body.appendChild(popupContainer);
    isGameRuning = false;
}

function tryAgain(){

    resetProps();
    
    let popupContainer = document.querySelector(".popup-container");
    document.body.removeChild(popupContainer);

    let gameBoard = document.querySelector(".game-board");
    document.querySelector(".board-placeholder").removeChild(gameBoard);

    renderMenu();

    let focusedButton = document.getElementsByClassName("dimension-button")[focusedDimensionButtonIndex];
    fucuseDimensionButton(focusedButton);

    hideScore();
    document.querySelector(".score").innerHTML = "Score: " + 0;
}

function resetProps(){
    score = 0;
    currentDirection = 1;
    snake = [2,1,0];
    itemCoord = null;
    interval = 300;
}

function extendSnake(tail){

    fillSingleSnakeCell(tail);
    snake.push(tail);
}

function increaseSpeed(){
    if(interval <= 15){
        return;
    }
    else if(interval > 150){
        interval -= 10;
    }
    else if(interval > 100){
        interval -= 5;
    }
    else if(interval > 50){
        interval -= 3
    }
}

function removeSingleCellFromSnakeTail(){
    unfillSingleSnakeCell(snake[snake.length - 1])
    return snake.pop();
}

function unfillSingleSnakeCell(number){
    document.getElementsByClassName("cell")[number].classList.remove("snake-cell");
}











