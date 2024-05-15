
let currentPlayer = 'X';
let gridSize = 3;
let gameBoard = [];


document.getElementById("submit").addEventListener("click",createGrid);

function createGrid() {
    gridSize = Number(document.getElementById('gridSize').value);
    gameBoard = [];
    for (let i = 0; i < gridSize; i++) {
        gameBoard[i] = new Array(gridSize);
        for(let j = 0;j < gridSize;j++){
            gameBoard[i][j] = "";
        }
    }
    generateBoard();
}

function generateBoard(){
    const board_html = document.getElementById('board_html');
    board_html.innerHTML = "";
    let table = document.createElement("table");
    let row;
    let col;
    for(let i = 0;i < gridSize;i++){
        row = document.createElement("tr");
        for(let j = 0;j < gridSize;j++){
            col = document.createElement("td");
            col.textContent = gameBoard[i][j];
            row.appendChild(col);
            col.addEventListener("clicl",function(){this.innerHTML = "0"});
        }
        table.appendChild(row);
    }
    board_html.appendChild(table);
}


createGrid();