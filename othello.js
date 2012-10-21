const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

var turn = BLACK;

var dh = [ -1, -1, 0, 1, 1,  1,  0, -1];
var dw = [  0,  1, 1, 1, 0, -1, -1, -1];

function otherTurn(t)
{
    if (t == BLACK) { return WHITE; }
    if (t == WHITE) { return BLACK; }

    return t;
}

function makeBoard()
{
    var board = new Array(8);
    for (var i = 0; i < 8; ++i) {
        board[i] = new Array(8);
        for (var j = 0; j < 8; ++j) {
            board[i][j] = EMPTY;
        }
    }
    return board;
}

var board = makeBoard();
function showBoard()
{
    var field = document.getElementById('field');
    while (field.firstChild) {
        field.removeChild(field.firstChild);
    }

    var table = document.createElement('table');
    for (var i = 0; i < 8; ++i) {
        var tr = document.createElement('tr');

        for (var j = 0; j < 8; ++j) {
            var td = document.createElement('td');
            var img = document.createElement('img');
            switch (board[i][j]) {
            case EMPTY:
                img.src = "empty.jpg"; break;
            case BLACK:
                img.src = "black.jpg"; break;
            case WHITE:
                img.src = "white.jpg"; break;
            }
            var f = (function(i, j) {
                return function() { onClick(i, j); ai(); }
            })(i, j);

            img.addEventListener('click', f, false);
            td.appendChild(img);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    field.appendChild(table);
}

function put(i, j, turn, f)
{
    if (board[i][j] != EMPTY) { return false; }

    var ok = false;
    for (var d = 0; d < 8; ++d) {
        var hh = i + dh[d]; 
        var ww = j + dw[d];
        var count = 0;
        while (true) {
            if (hh < 0 || 8 <= hh || ww < 0 || 8 <= ww) { break; }
            if (board[hh][ww] == otherTurn(turn)) { ++count; }
            else { break; }
            hh += dh[d]; ww += dw[d];
        }

        if (hh < 0 || 8 <= hh || ww < 0 || 8 <= ww) { continue; }
        if (board[hh][ww] == turn && count > 0) { 
            if (f) {
                f(d, count);
                ok = true;
            } else {
                return true;
            }
        }
    }

    return ok;
}

function puttableToSomewhere()
{
    for (var i = 0; i < 8; ++i) {
        for (var j = 0; j < 8; ++j) {
            if (put(i, j, turn, null)) { return true; }
        }
    }

    return false;
}

function ai()
{
    //alert('ai');
    if (turn != WHITE) { return ; }

    for (var i = 0; i < 8; ++i) {
        for (var j = 0; j < 8; ++j) {
            if (put(i, j, turn, null)) { 
                if (put(i, j, turn, (function(d, count) {
                    putHandler(i, j, d, count);
                }))) {
                    board[i][j] = turn;
                    //alert('put')
                    postPut();
                    return true;
                }
            }
        }
    }

    return false;
}

function postPut()
{
        turn = otherTurn(turn);
        showBoard();

        if (puttableToSomewhere()) { return; }
        turn = otherTurn(turn);

        if (puttableToSomewhere()) { return; }

        var blackCnt = 0;
        var whiteCnt = 0;
        for (var i = 0; i < 8; ++i) {
            for (var j = 0; j < 8; ++j) {
                if (board[i][j] == WHITE) { ++whiteCnt; }
                if (board[i][j] == BLACK) { ++blackCnt; }
            }
        }

        alert('BLACK = ' + blackCnt + ' WHITE = ' + whiteCnt);
}

function putHandler(i, j, d, count) {
    for (var k = 0; k < count; ++k) {
        var hh = i + dh[d] * (k + 1);
        var ww = j + dw[d] * (k + 1);
        board[hh][ww] = turn;
    }
}

function onClick(i, j)
{
    if (put(i, j, turn, null)) {
        put(i, j, turn, (function(d, count) {
            putHandler(i, j, d, count);
        }));
        board[i][j] = turn;

        postPut();
    }
}

function onLoad()
{
    board[3][3] = board[4][4] = WHITE;
    board[3][4] = board[4][3] = BLACK;
    showBoard();
}