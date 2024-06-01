function minimax(board, depth, maximizingPlayer){
    // Оценка текущей позиции'
    const score = evaluate(board);
    if (score !== null){
      return score;
    }
  
    // Получение всех возможных ходов
    const moves = getMoves(board);

    // Инициализация лучшего хода и лучшего счета
    let bestMove = null;
    let bestScore = maximizingPlayer ? -Infinity : Infinity;
  
    // Перебор всех возможных ходов
    for (const move of moves) {
      // Делаем ход на доске
      board[move[0]][move[1]] = maximizingPlayer ? 1 : 2;
  
      // Рекурсивный вызов minimax для следующего игрока
      const score = minimax(board, depth + 1, !maximizingPlayer);
  
      // Отмена хода
      board[move[0]][move[1]] = 0;
  
      // Обновление лучшего хода и лучшего счета
      if (maximizingPlayer) {
            if (score > bestScore) {
                bestScore = score;
                bestMove = move; //Для игрока ищем максимум
            }
        }  
      else {
            if (score < bestScore) {
                bestScore = score; //Для компьютера 
                bestMove = move;
            }
        }
    }
  
    // Возврат лучшего хода или лучшего счета, если глубина равна 0
    return depth === 0 ? bestScore : bestMove;
}


function getMoves(board) {
    let moves = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (gameBoard[i][j] == '') {
                moves.push([i, j]);
            }
        }
    }
    return moves;
}



function computerMove(board) {
    const bestMove = minimax(board, 0, false);
    if (bestMove !== null && bestMove != 0){
        console.log(bestMove);
      board[bestMove[0]][bestMove[1]] = 0;
      document.getElementById(`${bestMove[0]} ${bestMove[1]}`).textContent = "0";
    }
  }
  
  // Функция для хода игрока
  function playerMove(x, y){
    if (board[x][y] === 0) {
      board[x][y] = 1;
    }
  }