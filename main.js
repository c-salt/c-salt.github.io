var turn = 'X';
var previousTurn = {
    X: null,
    O: null
};
var board = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];


$(function() {
    place();
});



function place() {
    $("#board").on("click", ".cell", function() {
        if ($(this).text() !== '') {
            $(".alert").text("Invalid move!")
            return;
        } 
        update($(this));
       $(".turntext").text(`Turn: ${turn}`);
    });
}

function checkGameOver() {
    xLoss = false;
    oLoss = false;
    for (player of ['X', 'O']) {
        console.log(`Checking game over for: ${player}`)
        if (previousTurn[player]) {
            row = parseInt(previousTurn[player].attr('data-row'));
            column = parseInt(previousTurn[player].attr('data-column'));
            
            walls = 0
            
            for (i of [-1, 0, 1]) {
                for (j of [-1, 0, 1]) {
                    if ((row + i > 4) || (row + i < 0) || (column + j > 4) || (column + j < 0)) {
                        walls++;
                    } else {
                        walls += board[row + i][column + j];
                    }
                }
            }
            console.log(`Player: ${player} has ${walls} walls`)
            if (walls === 9 && player === 'X') {
                xLoss = true;
            } else if (walls === 9 && player === 'O') {
                oLoss = true;
            };
        }       
    }
    return [xLoss, oLoss];
}

function checkValidMove(oldRow, oldColumn, newRow, newColumn) {
    // Check first move
    if (oldRow === null && oldColumn === null) {
        return true;
    }
    // Check horizontal move
    if (oldRow === newRow) {
        if (oldColumn > newColumn) {
            return checkHorizontalMove(oldRow, oldColumn, newColumn);
        } else {
            return checkHorizontalMove(oldRow, newColumn, oldColumn);
        }
    }
    if (oldColumn === newColumn) {
        if (oldRow > newRow) {
            return checkVerticleMove(oldColumn, oldRow, newRow);
        } else {
            return checkVerticleMove(oldColumn, newRow, oldRow);
        }
    }
    if (Math.abs(oldRow - newRow) === Math.abs(oldColumn - newColumn)) {
        // Top left to bottom right
        if (oldRow > newRow && oldColumn > newColumn) {
            console.log('TopLeft -> BottomRight')
            return checkDiagnalMove(oldRow, newRow, oldColumn, newColumn, 1)
        } 
        // Bottom right to top left
        else if (oldRow < newRow && oldColumn < newColumn) {
            console.log('BottomRight -> TopLeft')
            return checkDiagnalMove(newRow, oldRow, newColumn, oldColumn, 1)
        }
        // Bottom left to top right
        else if (oldRow > newRow && oldColumn < newColumn) {
            console.log('BottomLeft -> TopRight')
            return checkDiagnalMove(newRow, oldRow, newColumn, oldColumn, -1)
        }
        // Top right to bottom left
        else if (oldRow < newRow && oldColumn > newColumn) {
            console.log('TopRight -> BottomLeft')
            return checkDiagnalMove(oldRow, newRow, oldColumn, newColumn, -1)
        }
    }    
    // Not valid move
    return false;
}

function checkHorizontalMove(row, toColumn, fromColumn) {
    tempColumn = fromColumn + 1;
    while (tempColumn !== toColumn) {
        if (board[row][tempColumn] !== 1) {
            tempColumn++;
        } else {
            return false;
        }
    }
    return true;
}

function checkVerticleMove(column, toRow, fromRow) {
    tempRow = fromRow + 1;
    while (tempRow !== toRow) {
        if (board[tempRow][column] !== 1) {
            tempRow++;
        } else {
            return false;
        }
    }
    return true;
}

function checkDiagnalMove(toRow, fromRow, toColumn, fromColumn, slope) {
    console.log('CheckDiagnalMove');
    console.log(`Going from row: ${fromRow} to row: ${toRow}`);
    console.log(`Going from column: ${fromColumn} to column: ${toColumn}`);
    console.log(`Slope: ${slope}`);
    
    
    
    tempRow = fromRow + slope;
    tempColumn = fromColumn + 1;
    while (tempRow !== toRow && tempColumn !== toColumn) {
        if (board[tempRow][tempColumn] !== 1) {
            tempRow += slope;
            tempColumn++;
        } else {
            return false;
        }
    }
    return true;
}

function update(cell) {   
    $(".alert").text("")
    newRow = parseInt(cell.attr('data-row'));
    newColumn = parseInt(cell.attr('data-column'));
    if (previousTurn[turn]) {
        oldRow = parseInt(previousTurn[turn].attr('data-row'));
        oldColumn = parseInt(previousTurn[turn].attr('data-column'));
    } else {
        oldRow = null;
        oldColumn = null;
    }

    if (checkValidMove(oldRow, oldColumn, newRow, newColumn)) {
        // Place text on board
        cell.text(turn);
        
        // Update previous player cell to wall
        if (previousTurn[turn]) {
            previousTurn[turn].css({
                "background": "cadetblue",
                "color": "cadetblue",
                "pointer-events": "none"
            });
            previousTurn[turn].text('');
        }
        
        // Store new previous
        previousTurn[turn] = cell;    
        
        // Change turns
        
        // Update board
        board[newRow][newColumn] = 1;
        
        gameOver = checkGameOver();
        console.log('gameOver', gameOver)
        if (gameOver.includes(true)) {
            $("body").css({
                "overflow": "hidden"
            });
            if (gameOver[0] === true && gameOver[1] === true) {
                $("#winnertext").text(`Player ${turn} Won!`);;
            } else {
                $("#winnertext").text(`Player ${gameOver[0] ? 'O' : 'X'} Won!`);
            }
            $(".modal").css({
                "display": "block"
            });
        }        

        turn = turn == 'X' ? 'O' : 'X';

    } else {
        $(".alert").text("Invalid move!")
    }
}