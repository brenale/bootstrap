
  let mapa = [];
  let navios = [];
  let tiro = 0;
  let acerto = 0;
  let tamMapa = 0;

  // Função principal para iniciar o jogo
  function iniciar() {
    // Define tamanho do mapa buscando a opção do combo
    tamMapa = parseInt(document.getElementById('tamanho').value);
    
    if (tamMapa === 4) {
      tiro = 12;
      numNavios = 3
    } else if (tamMapa === 6) {
      tiro = 24;
      numNavios = 4;
    } else {
      tiro = 30;
      numNavios = 5;
    }
    
    acertos = 0;

    // Cria matriz do mapa
    mapa = Array.from({ length: tamMapa }, () => Array(tamMapa).fill(0));
    
    // Gera posições aleatórias dos navios
    navios = [];
    while (navios.length < numNavios) {
      const x = Math.floor(Math.random() * tamMapa);
      const y = Math.floor(Math.random() * tamMapa);
      if (mapa[x][y] === 0) {
        mapa[x][y] = 1; // 1 = navio
        navios.push([x, y]);
      }
    }

    // Monta visual do mapa dinamicamente com a opção escolhida
    const gridDiv = document.getElementById('mapa');
    console.log("gridDiv:", gridDiv)
    gridDiv.innerHTML = '';
    gridDiv.style.gridTemplateColumns = `repeat(${tamMapa}, 40px)`;
    for (let x = 0; x < tamMapa; x++) {
      for (let y = 0; y < tamMapa; y++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.onclick = () => atirar(x, y, cell);
        gridDiv.appendChild(cell);
      }
    }

    document.getElementById('message').textContent = `Você tem ${tiro} tiros!`;
    document.getElementById('restart').style.display = 'none';
  }

  // Função de atirar em uma célula
  function atirar(x, y, cell) {
    if (tiro <= 0) {
      document.getElementById('message').textContent = '⚠️ Acabaram seus tiros!';
      return;
    }

    if (mapa[x][y] === 1) {
      cell.classList.add('acerto');
      cell.textContent = '💥';
      //cell.innerHTML = '<img src="navio.png">';
      mapa[x][y] = 2; // 2 = navio acertado
      acertos++;
      document.getElementById('message').textContent = '💥 Acertou!';
    } else if (mapa[x][y] === 0) {
      cell.classList.add('errou');
      cell.textContent = '❌'
      mapa[x][y] = -1; // -1 = tiro errado
      document.getElementById('message').textContent = '❌ Errou!';
    } else {
      document.getElementById('message').textContent = '⛔ Você já atirou aqui!';
      return;
    }

    tiro = tiro -1;
    if (acertos === navios.length) {
      document.getElementById('message').textContent = '🏁 Todos os navios foram afundados! Parabéns!';
      endGame();
    } else if (tiro === 0) {
      document.getElementById('message').textContent = '⚠️ Fim dos tiros! Fim de jogo!';
      endGame();
    } else {
      document.getElementById('message').textContent += ` Restam ${tiro} tiro.`;
    }
  }

  // Finaliza o jogo 
  function endGame() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(c => c.onclick = null);
  }

