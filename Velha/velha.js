let clicks = 0;
let winner = false;
let score1 = 0;
let score2 = 0;

 

const matrix = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]; 

function process(pos) {
    if (winner) {
        alert("O " + winner + " já ganhou!");
        return;
    }

    if (!document.game.opt[pos].value) {
        clicks++;
        let type = clicks % 2 === 0 ? '🔵' : '❌';
        document.game.opt[pos].value = type;
        check(type);
        
        if (clicks === 9 && !winner) {
            alert("Deu velha!👵#");
        }
    } else {
        alert("Você já jogou aí.");
    }
}

function check(type) {
    matrix.forEach(function(combo) {
        let count = 0;
        combo.forEach(function(pos) {
            if (document.game.opt[pos].value === type) {
                count++;
                
            }
        });

        if (count === 3) {
            wins(combo);
            // Se tiver um campo com nome do jogador, pega o nome. Caso contrário, mostra o símbolo.
            let player = (document.game[type] && document.game[type].value) || type;
            
            winner = player;
        
            alert("Parabéns " + player + "! Arrasou!");
            if (type === '❌') {
              score1++;
            } 
            else if (type === '🔵') {
              score2++;
            }
        }
        document.getElementById("score1").textContent = score1;
        document.getElementById("score2").textContent = score2;
    });
}

function wins(combo) {
    combo.forEach(function(i) {
        document.game.opt[i].className = "win";
    });
}

function reset() {
    for (let x = 0; x <= 8; x++) {
        document.game.opt[x].value = "";
        document.game.opt[x].className = "";
    }

    // Se existir campos para os nomes dos jogadores, limpa também
    if (document.game.X) document.game.X.value = "";
    if (document.game.O) document.game.O.value = "";

    winner = false;
    clicks = 0;
}


function jogarNovamente() {
   for (let x = 0; x <= 8; x++) {
       document.game.opt[x].value = "";
   }

   winner = false;
   clicks = 0;
}








