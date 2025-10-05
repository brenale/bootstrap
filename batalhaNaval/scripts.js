
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
      
  //      mapa = [
  //        [0,0,0,0],
  //        [0,1,0,0],
  //        [0,0,1,0],
  //        [0,0,0,1]
  //      ];
  
  //      navios = [ 
  //        [1,1],
  //        [2,2],
  //        [3,3]
  //      ];  
      
    } else if (tamMapa === 6) {
        tiro = 24;
        numNavios = 4;
  //     mapa = [
  //        [0,0,0,0,0,0,0],
  //        [0,1,0,0,0,0,0],
  //        [0,0,1,0,0,0,0],
  //        [0,0,0,1,0,0,0],
  //        [0,0,0,0,1,0,0],
  //        [0,0,0,0,0,0,0],
  //      ];
  //      navios = [ 
  //        [1,1],
  //        [2,2],
  //        [3,3],
  //        [4,4]
  //      ];  
    } else {
        tiro = 30;
        numNavios = 5;
 //       mapa = [
 //         [0,0,0,0,0,0,0,0],
 //         [0,1,0,0,0,0,0,0],
 //         [0,0,1,0,0,0,0,0],
 //         [0,0,0,1,0,0,0,0],
 //         [0,0,0,0,1,0,0,0],
 //         [0,0,0,0,0,1,0,0],
 //         [0,0,0,0,0,0,0,0],
 //         [0,0,0,0,0,0,0,0]  
 //       ];
  
  //      navios = [ 
  //        [1,1],
  //        [2,2],
  //        [3,3],
  //        [4,4],
  //        [5,5],
  //  ];  
  }
    acertos = 0;

 // monta array com o tamanho e 0
    mapa = Array.from({ length: tamMapa }, () => Array(tamMapa).fill(0));
    console.log("mapa:", mapa)
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
    gridDiv.innerHTML = ''; //limpa div
    gridDiv.style.gridTemplateColumns = `repeat(${tamMapa}, 40px)`; //propriedade css e repetindo a qtde tam mapa
    for (let x = 0; x < tamMapa; x++) { // cria coordenads x (0,0),(0,1),(0,2)
      for (let y = 0; y < tamMapa; y++) { // cria nas cel as coordenados y (0,0),(0,1),(0,2) 
        const cell = document.createElement('div'); //cria div na memoria n aparece, para aparecer appendChild
        cell.classList.add('cell'); //adiciona css  na cell
        cell.onclick = () => atirar(x, y, cell); //marca aonde foi clicado e as coordenadas x e y
        gridDiv.appendChild(cell); // insere a nova cell na div
      }
    }

    //  mensagem
    document.getElementById('message').textContent = `Você tem ${tiro} tiros para acertar ${numNavios} navios`;
  }

  function atirar(x, y, cell) {
    if (tiro <= 0) {
      document.getElementById('message').textContent = '⚠️ Acabaram seus tiros!';
      return;
    }

    if (mapa[x][y] === 1) {
      cell.classList.add('acerto');
      //cell.textContent = '💥';
      cell.innerHTML = '<img src="naviodesenho.png">';
      mapa[x][y] = 2; // 2 = navio acertado
      acertos++;
      document.getElementById('message').textContent = '💥 Acertou!';
    } else if (mapa[x][y] === 0) {
      cell.classList.add('errou');
      //cell.textContent = '❌'
      cell.innerHTML = '<img src="mardesenho.png">';
      mapa[x][y] = -1; // -1 = tiro errado
      document.getElementById('message').textContent = '❌ Errou!';
    } else {
      document.getElementById('message').textContent = '⛔ Você já atirou aqui!';
      return;
    }

    tiro = tiro -1;
    if (acertos === navios.length) {
      document.getElementById('message').textContent = '🏁 Todos os navios foram afundados! Parabéns!';
      document.getElementById('message2').textContent = ` Restam ${numNavios-acertos} navios.`;
      endGame();
    } else if (tiro === 0) {
      document.getElementById('message').textContent = '⚠️ Fim dos tiros! Fim de jogo!';
      endGame();
    } else {
      document.getElementById('message').textContent += ` Restam ${tiro} tiro.`;
      console.log(message)
      document.getElementById('message2').textContent = ` Restam ${numNavios-acertos} navios.`;
      console.log(message2)
    }
  }

  // Finaliza o jogo 
  function endGame() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(c => c.onclick = null);
  }

