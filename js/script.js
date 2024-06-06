let currentPlayer = 'X';
let gridSize = 3;
let gameBoard = [];
let level = "easy";
let count_free;
let footer = document.getElementsByClassName("end")[0];
let timer;
let gameover = false;
let dom_el_score = document.getElementById("score");
let max_different_score = 0;
let first_hard_coor;
let second_hard_coor;
let flag_hard_possible = false;


//Класс количества очков
class Scoring{
    _points;
    constructor(player,points){
        this.player = player;
        this._points = points;
    }

    get points(){
        return this._points;
    }

    set points(value){
        if (value >= 0){
            this._points = this._points;
        }
    }
    increase_points(){
        this._points++;
    }

    static get_score_on_table(first_sc,second_sc,dom_el){
        dom_el.textContent = `Счёт ${first_sc.points} : ${second_sc.points}`;
    }
    toString(){
        return `${this.player}`;
    }
    insert_local(other){
        if (window.localStorage){
            if (this._points - other._points > localStorage.getItem("record_max_diff")){
                localStorage.setItem("record",`${this._points} : ${other._points}`);
                document.getElementById("record_value").textContent = localStorage["record"];
                max_different_score = this._points - other._points;
                document.getElementById("record").style.display = "block";
                localStorage.setItem("record_max_diff", max_different_score);
            }
        }
    }
}

let User_scoring = new Scoring("user",0);
let Computer_scoring = new Scoring("computer",0);

document.getElementById("submit").addEventListener("click",() => {createGrid(true)});
Scoring.get_score_on_table(User_scoring,Computer_scoring,dom_el_score);


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
            if (is_started){
                col.addEventListener("click", set_user);
            }
        }
        table.appendChild(row);
    }
    board_html.appendChild(table);
}



function set_user(){
    if (this.textContent)
        return;
    count_free-= 1;
    let x,y;
    x = Number(this.id[0]);
    y = Number(this.id[2]);
    gameBoard[x][y] = "X";
    this.textContent = "X";
    if (evaluate(gameBoard,"X")){
        gameover = true;
        setTimeout(function(){alert_message("Вы выиграли!","images/funny.jpg","Здорово!","#00ff55")},300);
        User_scoring.increase_points();
        Scoring.get_score_on_table(User_scoring,Computer_scoring,dom_el_score);
        User_scoring.insert_local(Computer_scoring);
        return;
    }
    else if (checkDraw()){
        setTimeout(function(){alert_message("Ничья!","images/net.jpg","Я лишь поддался!","grey")},300);
    }
    let dangerous;
    if (level == "hard"){
        if (flag_hard_possible){
            dangerous = [first_hard_coor,second_hard_coor];
            setTimeout(function(){set_computer(dangerous)},300);
            return;
        }
        let try_X_res = dangerous_possible(x,y,'X');
        dangerous =  try_X_res[0];
        if (dangerous.length > 0 && dangerous.every(el =>el >= 0)){
            dangerous = try_X_res[0];
        }
        if (flag_hard_possible){
            dangerous = [first_hard_coor,second_hard_coor];
        }
        //else{
            //let try_0_res = dangerous_possible(x,y,"0");
            //dangerous = try_0_res[0];
            //};
        }
        setTimeout(function(){set_computer(dangerous)},300);
    }



function set_computer(dangerous){
    if (count_free <= 0)
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
                if(evaluate(gameBoard,"0")){
                    Computer_scoring.increase_points();
                    setTimeout(function(){alert_message("Выйграл компьютер!","images/sad.jpg","Реванш!","red")},300);
                    Scoring.get_score_on_table(User_scoring,Computer_scoring, dom_el_score);
                    return;
                }
                else if (checkDraw()){
                    setTimeout(function(){alert_message("Ничья!","images/net.jpg","Я лишь поддался!","grey")},300);
                }
            }
        }
    }
    else if (level == "hard"){
        difficult(dangerous);
        if(evaluate(gameBoard,"0")){
            Computer_scoring.increase_points();
            Scoring.get_score_on_table(User_scoring,Computer_scoring,dom_el_score);
            setTimeout(function(){alert_message("Выйграл компьютер!","images/sad.jpg","Реванш!","red")},300);
            return;
        }
        else if (checkDraw()){
            setTimeout(function(){alert_message("Ничья!","images/net.jpg","Я лишь поддался!","grey")},300);
        }
    }
}



function check_line(line, player){
    //return line.every(el => el == 'X') || line.every(el => el == "0");
    return count_elements(line,player);
}


function checkDraw() {
    return count_free <= 0;
}



function reset(){
    createGrid();
    //return 0;
}

createGrid(false);

function t(){

}

function wining(massiv){
    massiv.forEach(element => {
        document.getElementById(element).style.backgroundColor = "gold";
        document.getElementById(element).style.fontWeight = "bold";
    });
    main_start = false;
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
    timer = setTimeout(reset,1000 * 600);
}




function evaluate(gameBoard,player){
    let massiv = [];
    // Проверка строк
    for (let i = 0; i < gridSize; i++){
        if (check_line(gameBoard[i],player) == gridSize){
            for(let j = 0;j < gridSize;j++){
                massiv.push(`${i} ${j}`);
            }
            wining(massiv);
            return gameBoard[i][0]; // Крестик или нолик выиграл
        }
    }
    let main_diagonal = [];
    let side_diagonal = [];
    let special = [];
    for(let i = 0;i < gridSize;i++){
        main_diagonal.push(gameBoard[i][i]);
        let columns = [];
        for(let j = 0;j < gridSize;j++){
            columns.push(gameBoard[j][i]);
            massiv[j] = `${j} ${i}`;
            if (i + j + 1 == gridSize){
                side_diagonal.push(gameBoard[i][j]);
                special.push(`${i} ${j}`);
            }
        }
        if (check_line(columns,player) == gridSize){// Проверка столбцов
            wining(massiv);
            return columns[0];
        }
    }

    if (check_line(main_diagonal,player) == gridSize){// Проверка диагоналей
        for(let i  = 0;i < gridSize;i++){
            massiv[i] = `${i} ${i}`;
        }
        wining(massiv);
        return main_diagonal[0];
    }

    if (check_line(side_diagonal,player) == gridSize){// Проверка диагоналей
        wining(special);
        return side_diagonal[0];
    }
    
    // Проверка диагоналей

    // Ничья
    if (!gameBoard.some((row) => row.includes(0))){
        return 0;
    }
  
    // Игра продолжается
    return null;
}

function get_main_diagonal(){
    let main_diagonal = [];
    for(let i = 0;i < gridSize;i++){
        main_diagonal.push(gameBoard[i][i]);
    }
    return main_diagonal;
}


function get_side_diagonal(){
    let side_diagonal = []
    for(let i = 0;i < gridSize;i++){
        side_diagonal.push(gameBoard[i][gridSize - i - 1]);
    }
    return side_diagonal;
}

function get_all_columns(){
    let column_list = [];
    for(let i = 0;i < gridSize;i++){
        let column = new Array(gridSize);
        for(let j = 0;j < gridSize;j++){
            column[j] = gameBoard[j][i];
        }
        column_list.push(column);
    }
    return column_list;
}


function count_elements(massiv,element){
    let total = 0;
    let null_cnt = 0;
    massiv.forEach(el => {
        if (el === element)
            total++;
        if (el === "")
            null_cnt++;
    })
    if (null_cnt == gridSize)
        return null;
    return total;
}





function difficult(dangerous){
    //let main_diagonal = get_main_diagonal();
    //let side_diagonal = get_side_diagonal();
    if (flag_hard_possible && gameBoard[first_hard_coor][second_hard_coor] == ''){
        flag_hard_possible = false;
        gameBoard[first_hard_coor][second_hard_coor] = "0";
        console.log(first_hard_coor,second_hard_coor)
        document.getElementById(`${first_hard_coor} ${second_hard_coor}`).textContent = "0";
        return;
    }
    function set_possible(){
        let possible = dangerous_possible(first_hard_coor,second_hard_coor,'0')[0];
        if (possible.length > 0 && possible.every(el =>el >= 0)){
            first_hard_coor = possible[0];
            second_hard_coor = possible[1];
            flag_hard_possible = true;
        }
    }
    if(dangerous.length > 0 && dangerous.every(el =>el >= 0)){
        let first = dangerous[0];
        let second = dangerous[1];
        let cell = gameBoard[first][second];
        if (cell == ""){
            gameBoard[first][second] = "0";
            document.getElementById(`${first} ${second}`).textContent = "0";
            set_possible();
            return;
        }
    }
    let is_succes = false;
    while(!is_succes){
        first_hard_coor = parseInt(Math.random() * gridSize);
        second_hard_coor = parseInt(Math.random() * gridSize);
        let random_cell = gameBoard[first_hard_coor][second_hard_coor];
        if (random_cell == ""){
            is_succes = true;
            gameBoard[first_hard_coor][second_hard_coor] = "0";
            document.getElementById(`${first_hard_coor} ${second_hard_coor}`).textContent = "0";
            set_possible();
        }
    }
}



function dangerous_possible(row,col,player){
    let massiv = [];
    let dangerous = [];
    let possible = [];
    let ind = -1;
    row_check = check_line(gameBoard[row],player);
    if (row_check == gridSize - 1 ){
        ind = gameBoard[row].indexOf("");
        dangerous = [row, ind];
        //else possible = [row,ind];
    }
    let columns = [];
    let main_diagonal = [];
    let side_diagonal = [];
    for(let i = 0;i < gridSize;i++){
        columns.push(gameBoard[i][col]);
        main_diagonal.push(gameBoard[i][i]);
        for(let j = 0;j < gridSize;j++){
            if (i + j + 1 == gridSize){
                side_diagonal.push(gameBoard[i][j]);
            }
        }
    }
    let col_check = check_line(columns,player);
    if (col_check == gridSize - 1){
        ind = columns.indexOf("");
        dangerous = [ind,col];
        //else possible = [ind,col];
    }
    let main_diagonal_check = check_line(main_diagonal,player);

    if (main_diagonal_check == gridSize - 1){
        ind = main_diagonal.indexOf(""); 
        dangerous = [ind,ind];
        //else possible = [ind,ind];
    }

    side_diagonal_check = check_line(side_diagonal,player);
    if ( side_diagonal_check == gridSize - 1){
        ind = side_diagonal.indexOf("");
        dangerous = [ind, gridSize - ind - 1];
        //else possible = [ind,gridSize - ind - 1 ];
    }
    //return [dangerous,possible];
    return [dangerous];
}


