var minesweeper = function (size1, size2, mines) {
    var dashboard;
    var init = function () {
        dashboard = new Array(size1).fill(0);
        for (var i = 0; i < size1; i++) {
            dashboard[i] = new Array(size2).fill(0);
        }
        for (var i = 0; i < mines; i++) {
            var randomX = Math.floor(Math.random() * size1);
            var randomY = Math.floor(Math.random() * size2);
            if (dashboard[randomX][randomY] == 9) {
                i--;
            }
            else {
                dashboard[randomX][randomY] = 9;
                countMineAround(randomX, randomY)
            }
        }
        printDashboard();
        drawGame();
    }

    var countMineAround = function (positionX, positionY) {
        var beginLoop1 = getBeginNumberOfLoop(positionX - 1);
        var endLoop1 = getEndNumberOfLoop(positionX + 1, size1);

        var beginLoop2 = getBeginNumberOfLoop(positionY - 1);
        var endLoop2 = getEndNumberOfLoop(positionY + 1, size2);

        for (var i = beginLoop1; i <= endLoop1; i++) {
            for (var j = beginLoop2; j <= endLoop2; j++) {
                if (i != positionX || j != positionY) {
                    if (dashboard[i][j] != 9) {
                        dashboard[i][j]++;
                    }
                }
            }
        }
    }

    var getBeginNumberOfLoop = function (numberIndexLoop) {
        if (numberIndexLoop < 0) {
            return 0;
        }
        return numberIndexLoop;
    }

    var getEndNumberOfLoop = function (numberIndexLoop, size) {
        if (numberIndexLoop > size - 1) {
            return size - 1;
        }
        return numberIndexLoop;
    }

    var printDashboard = function () {
        for (var i = 0; i < size1; i++) {
            var row = '';
            for (var j = 0; j < size2; j++) {
                row = row + ' ' + dashboard[i][j];
            }
            console.log(row);
        }
    }

    var drawGame = function () {
        var table = document.getElementById('dashboard');
        table.removeEventListener('click', showSquare);
        table.addEventListener('click', showSquare);
        table.addEventListener('contextmenu', showFlag);
        for (var i = 0; i < size1; i++) {
            var tr = document.createElement('tr');
            table.appendChild(tr);
            for (var j = 0; j < size2; j++) {
                var td = document.createElement('td');
                td.setAttribute('data-x', i);
                td.setAttribute('data-y', j);
                td.setAttribute('data-discover', 0);
                td.setAttribute('data-flag', 0);
                tr.appendChild(td);
            }
        }
    }

    var showSquare = function (event) {
        var element = event.target;
        var flag = element.getAttribute('data-flag');
        if (!Number(flag)) {
            var posiX = element.getAttribute('data-x');
            var posiY = element.getAttribute('data-y');
            if (dashboard[posiX][posiY] == 9) {
                element.classList.add("mineRed");
                showMines();
                var table = document.getElementById('dashboard');
                table.removeEventListener('click', showSquare);
                face.classList.add("faceLose");
            }
            else if (dashboard[posiX][posiY] != 0) {
                element.setAttribute('data-discover', 1)
                element.classList.add("td" + dashboard[posiX][posiY]);
            }
            else {
                var positions = {
                    x: posiX,
                    y: posiY
                };
                showNoMineSquare(positions);
            }
            var squareDiscover = document.querySelectorAll('[data-discover="1"]').length;
            if (squareDiscover == size1 * size2 - mines) {
                showMines();
                var table = document.getElementById('dashboard');
                table.removeEventListener('click', showSquare);
                face.classList.add("faceWin");
            }
        }
    }

    var showNoMineSquare = function (posi) {
        var element = document.querySelector('[data-x="' + posi.x + '"][data-y="' + posi.y + '"]');
        if (posi.x < 0 || posi.x >= size1 || posi.y < 0 || posi.y >= size2) {
            return;
        }
        else if (Number(element.getAttribute('data-discover'))) {
            return;
        }
        else if (dashboard[posi.x][posi.y] != 0) {
            element.setAttribute('data-discover', 1);
            element.setAttribute('data-flag', 0);
            element.classList.remove("flag");
            element.classList.add("td" + dashboard[posi.x][posi.y]);
            return;
        }
        else {
            element.setAttribute('data-discover', 1);
            element.setAttribute('data-flag', 0);
            element.classList.remove("flag");
            element.classList.add("td" + dashboard[posi.x][posi.y]);
            showNoMineSquare({ x: Number(posi.x) - 1, y: Number(posi.y) });
            showNoMineSquare({ x: Number(posi.x) - 1, y: Number(posi.y) + 1 });
            showNoMineSquare({ x: Number(posi.x) - 1, y: Number(posi.y) - 1 });
            showNoMineSquare({ x: Number(posi.x), y: Number(posi.y) - 1 });
            showNoMineSquare({ x: Number(posi.x), y: Number(posi.y) + 1 });
            showNoMineSquare({ x: Number(posi.x) + 1, y: Number(posi.y) - 1 });
            showNoMineSquare({ x: Number(posi.x) + 1, y: Number(posi.y) });
            showNoMineSquare({ x: Number(posi.x) + 1, y: Number(posi.y) + 1 });
        }
    }

    var showFlag = function (event) {
        var element = event.target;
        var flagDiscover = element.getAttribute("data-flag");
        if (!Number(flagDiscover) && !element.classList.length) {
            element.classList.add("flag");
            element.setAttribute('data-flag', 1);
        }
        else {
            element.classList.remove("flag");
            element.setAttribute('data-flag', 0);
        }
    }

    var showMines = function () {
        for (var i = 0; i < size1; i++) {
            for (var j = 0; j < size2; j++) {
                var element = document.querySelector('[data-x="' + i + '"][data-y="' + j + '"]');
                if (dashboard[i][j] == 9) {
                    element.classList.add("mine");
                }
                else if (Number(element.getAttribute('data-flag')) == 1) {
                    element.classList.add("noMine");
                }
            }
        }
    }

    return {
        init: init
    }
}

var face = document.getElementById('face');

var initMinesweeper = function () {
    face.className = '';
    var table = document.getElementById("table");
    var tbody = document.querySelector("table tbody");
    if(tbody){
        table.removeChild(tbody);
    }
    var dash = document.createElement('tbody');
    dash.setAttribute('id','dashboard');
    dash.setAttribute('oncontextmenu','return false;');
    table.appendChild(dash);
    var min = minesweeper(9, 9, 10);
    min.init();
};

initMinesweeper();
face.addEventListener('click', initMinesweeper);