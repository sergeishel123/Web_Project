let currentPlayer = 'X';
let gridSize = 3;
let gameBoard = [];
let level = "easy";
let count_free;
let main_start = false;
let count_user_wins = 0;
let count_computer_wins = 0;
let footer = document.getElementsByClassName("end")[0];
let timer;

document.getElementById("submit").addEventListener("click",createGrid,true);
document.getElementById("meta_container").children[2].textContent += `${count_user_wins} : ${count_computer_wins}`;


function createGrid(is_started) {
    footer.style.display = "none";
    clearTimeout(timer);
    gridSize = Number(document.getElementById('gridSize').value);
    gameBoard = [];
    for (let i = 0; i < gridSize; i++) {
        gameBoard[i] = new Array(gridSize);
        for(let j = 0;j < gridSize;j++){
            gameBoard[i][j] = "";
        }
    }
    main_start = true;
    count_free = gridSize * gridSize;
    generateBoard(is_started);
}

function generateBoard(is_started){
    const board_html = document.getElementById('board_html');
    board_html.innerHTML = "";
    let table = document.createElement("table");
    level = document.querySelector('input[name="difficulty"]:checked').value;
    let row;
    let col;
    for(let i = 0;i < gridSize;i++){
        row = document.createElement("tr");
        for(let j = 0;j < gridSize;j++){
            col = document.createElement("td");
            col.textContent = gameBoard[i][j];
            col.id = `${i} ${j}`;
            row.appendChild(col);
            if (main_start){
                col.addEventListener("click", set_user);
            }
        }
        table.appendChild(row);
    }
    board_html.appendChild(table);
}



function set_user(){
    if (this.textContent || !main_start)
        return;
    count_free-= 1;
    this.textContent = "X";
    let x,y;
    x = Number(this.id[0]);
    y = Number(this.id[2]);
    gameBoard[x][y] = "X";
    if (check_Win(x,y)){
        count_user_wins += 1;
        setTimeout(function(){alert_message("Вы выиграли!","images/funny.jpg","Здорово!","#00ff55")},300);
        return;
    }
    else if (checkDraw()){
        setTimeout(function(){alert_message("Ничья!","images/net.jpg","Я лишь поддался!","grey")},300);
    }
    setTimeout(set_computer,300);
}


function set_computer(){
    if (count_free <= 0 || !main_start)
        return;
    count_free -= 1;
    //let free_cells = gameBoard.filter(el => el == "");
    if (level == "easy"){
        let is_succes = false;
        let first;
        let second;
        while(!is_succes){
            first = parseInt(Math.random() * gridSize);
            second = parseInt(Math.random() * gridSize);
            let random_cell = gameBoard[first][second];
            if (random_cell == ""){
                is_succes = true;
                gameBoard[first][second] = "0";
                document.getElementById(`${first} ${second}`).textContent = "0";
                console.log(count_free);
                if(check_Win(first,second)){
                    count_computer_wins += 1;
                    setTimeout(function(){alert_message("Выйграл компьютер!","images/sad.jpg","Реванш!","red")},300);
                    return;
                }
                else if (checkDraw()){
                    setTimeout(function(){alert_message("Ничья!","images/net.jpg","Я лишь поддался!","grey")},300);
                }
            }
        }
    }
}



function check_Win(row,col){
    let massiv = [];
    if (check_line(gameBoard[row])){
        for(let i = 0;i < gridSize;i++){
            massiv.push(`${row} ${i}`)
        }
        wining(massiv);
        return true;
    }
    let columns = [];
    let main_diagonal = [];
    let side_diagonal = [];
    let special = []
    for(let i = 0;i < gridSize;i++){
        columns.push(gameBoard[i][col]);
        main_diagonal.push(gameBoard[i][i]);
        for(let j = 0;j < gridSize;j++){
            if (i + j + 1 == gridSize){
                side_diagonal.push(gameBoard[i][j]);
                special.push(`${i} ${j}`);
            }
        }
    }
    if (check_line(columns)){
        for(let i = 0;i < gridSize;i++){
            massiv.push(`${i} ${col}`);
        }
        wining(massiv);
        return true;
    }

    if (check_line(main_diagonal)){
        for(let i  = 0;i < gridSize;i++){
            massiv.push(`${i} ${i}`);
        }
        wining(massiv);
        return true;
    }

    if (check_line(side_diagonal)){
        wining(special);
        return true;
    }

    return false;
}

function check_line(line){
    return line.every(el => el == 'X') || line.every(el => el == "0");
}


function checkDraw() {
    return count_free <= 0;
}


function reset(){
    createGrid();
}

createGrid(false);


function wining(massiv){
    massiv.forEach(element => {
        document.getElementById(element).style.backgroundColor = "gold";
        document.getElementById(element).style.fontWeight = "bold";
    });
    main_start = false;
    document.getElementById("meta_container").children[2].textContent = `Счёт  ${count_user_wins} : ${count_computer_wins}`;
}

function alert_message(title,imageUrl,prompt,color_button){
    swal({
        title: title,
        imageUrl: imageUrl,
        imageWidth: 400,
        imageHeight: "80%",
        background: "powderblue",
        confirmButtonText: prompt,
        confirmButtonColor: color_button
      },"With some body text!");
    footer.style.display = "block";
    main_start = false;
    timer = setTimeout(reset,1000 * 60);
}


