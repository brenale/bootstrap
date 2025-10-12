// Importa duas funções de outro arquivo chamado "mensagens.js"
// "mensagens" contém textos prontos (ex: mensagens de acerto, erro, fim de jogo)
// "mostrarMensagem" serve para exibir textos em elementos HTML
import { mensagens, mostrarMensagem } from "./mensagens.js";

// Declara variáveis principais usadas no jogo
let mapa = [];        // Matriz (grade) que representa o tabuleiro
let navios = [];      // Lista com todos os navios e suas posições
let tiro = 0;         // Quantidade de tiros restantes
let acertos = 0;      // Quantos acertos o jogador já teve
let tamMapa = 0;      // Tamanho do mapa (ex: 4x4, 6x6, 8x8)
let tiposNavios = []; // Define quantos navios e seus tamanhos

// Objeto com os nomes dos navios, usados para mostrar textos e imagens
const nomesNavios = {
  1: "Fragata",
  2: "Destroyer",
  3: "Submarino",
  4: "Porta-aviões"
};

// Mostra mensagens de ação no painel principal (ex: "acertou", "errou", etc.)
function mostrarMensagemAcao(texto) {
  mostrarMensagem('message', texto);
}

// Atualiza o painel de status (mostra tiros restantes e navios vivos)
function atualizarStatus() {
  // Filtra os navios que ainda não foram totalmente afundados
  const naviosRestantes = navios.filter(n => n.acertos < n.posicoes.length).length;
  // Mostra tiros e quantos navios ainda restam
  mostrarMensagem('message2', `Tiros: ${tiro} | Navios restantes: ${naviosRestantes}`);
}

// Função principal — chamada quando o jogador clica em "Iniciar"
function iniciar() {
  configurarMapa();     // Define o tamanho do mapa e os tipos de navio
  inicializarNavios();  // Coloca os navios aleatoriamente no mapa
  criarTabuleiro();     // Cria o tabuleiro (grade de botões/células na tela)
  mostrarMensagemAcao(mensagens.inicio(tiro, navios.length)); // Mensagem inicial
  atualizarStatus();    // Mostra status inicial
}

// Define o tamanho do mapa, número de tiros e tipos de navios conforme a escolha do jogador
function configurarMapa() {
  tamMapa = Number(document.getElementById('tamanho').value); // Lê valor do <select>

  // Dependendo do tamanho escolhido, ajusta dificuldade
  switch (tamMapa) {
    case 4:
      tiposNavios = [
        { tamanho: 1, quantidade: 2 },
        { tamanho: 2, quantidade: 2 }
      ];
      tiro = 15;
      break;
    case 6:
      tiposNavios = [
        { tamanho: 1, quantidade: 2 },
        { tamanho: 2, quantidade: 2 },
        { tamanho: 3, quantidade: 1 }
      ];
      tiro = 30;
      break;
    default:
      tiposNavios = [
        { tamanho: 1, quantidade: 3 },
        { tamanho: 2, quantidade: 2 },
        { tamanho: 3, quantidade: 2 },
        { tamanho: 4, quantidade: 1 }
      ];
      tiro = 40;
      break;
  }

  // Reseta variáveis
  acertos = 0;
  // Cria uma matriz vazia com o tamanho definido (ex: 6x6)
  mapa = Array.from({ length: tamMapa }, () => Array(tamMapa).fill(0));
  navios = []; // Limpa os navios anteriores
}

// Cria e posiciona todos os navios aleatoriamente no mapa
function inicializarNavios() {
  tiposNavios.forEach(tipo => {
    for (let i = 0; i < tipo.quantidade; i++) {
      colocarNavio(tipo.tamanho); // Coloca cada navio de um tipo
    }
  });
}

// Cria o tabuleiro visual (as células clicáveis)
function criarTabuleiro() {
  const gridDiv = document.getElementById('mapa'); // Pega a div do HTML
  gridDiv.innerHTML = ''; // Limpa o conteúdo anterior
  gridDiv.style.gridTemplateColumns = `repeat(${tamMapa}, 40px)`; // Define colunas

  // Cria uma célula (div) para cada posição do mapa
  for (let x = 0; x < tamMapa; x++) {
    for (let y = 0; y < tamMapa; y++) {
      const cell = document.createElement('div');
      cell.classList.add('cell'); // Adiciona a classe CSS
      // Define o que acontece quando o jogador clica
      cell.onclick = () => atirar(x, y, cell);
      gridDiv.appendChild(cell); // Adiciona no tabuleiro
    }
  }
}

// Função que posiciona 1 navio no mapa, de forma aleatória
function colocarNavio(tamanho) {
  let colocado = false; // Controle para repetir até conseguir colocar
  const direcoes = ['horizontal', 'vertical', 'diagonal']; // Três orientações possíveis

  while (!colocado) {
    // Escolhe aleatoriamente uma direção
    const orientacao = direcoes[Math.floor(Math.random() * 3)];
    // Posição inicial aleatória
    const x = Math.floor(Math.random() * tamMapa);
    const y = Math.floor(Math.random() * tamMapa);
    let posicoes = []; // Guarda as coordenadas que o navio vai ocupar

    // Tenta ocupar as células conforme o tamanho do navio
    for (let i = 0; i < tamanho; i++) {
      let nx = x, ny = y;
      if (orientacao === 'horizontal') ny += i;
      if (orientacao === 'vertical') nx += i;
      if (orientacao === 'diagonal') { nx += i; ny += i; }

      // Se sair do mapa ou sobrepor outro navio, cancela
      if (nx >= tamMapa || ny >= tamMapa || mapa[nx][ny] !== 0) {
        posicoes = [];
        break;
      }
      posicoes.push([nx, ny]);
    }
console.log(posicoes);
    // Se conseguiu posicionar o navio corretamente
    if (posicoes.length === tamanho) {
      // Marca no mapa com o índice do navio
      posicoes.forEach(([nx, ny]) => (mapa[nx][ny] = navios.length + 1));
      // Adiciona o navio à lista
      navios.push({ posicoes, acertos: 0, tamanho });
      colocado = true; // Sai do loop
    }
  }
}

// Função chamada quando o jogador clica em uma célula (atira)
function atirar(x, y, cell) {
  // Se não há mais tiros
  if (tiro <= 0) {
    mostrarMensagemAcao(mensagens.semTiros);
    return;
  }

  const valor = mapa[x][y]; // Lê o valor da célula (0 = vazio, >0 = navio)
  let mensagem = '';

  if (valor > 0) {
    // Acertou um navio
    mapa[x][y] = -2; // Marca a célula como atingida
    tiro--;          // Diminui tiros restantes
    const navio = navios[valor - 1]; // Encontra o navio atingido
    navio.acertos++; // Soma acertos nesse navio

    // Muda aparência da célula (acerto)
    cell.classList.add('acerto');
    // Mostra uma imagem de navio na célula
    cell.innerHTML = `<img src="${getImagemNavio(navio.tamanho)}" alt="${nomesNavios[navio.tamanho]}" class="navio-img">`;

    // Se o navio foi totalmente afundado
    if (navio.acertos === navio.posicoes.length) {
      revelarNavioUnico(navio); // Mostra o navio completo
      mensagem = mensagens.afundado(nomesNavios[navio.tamanho]);
    } else {
      mensagem = mensagens.acerto; // Apenas um acerto parcial
    }
    acertos++;
  } else if (valor === 0) {
    // Errou o tiro
    mapa[x][y] = -1; // Marca como água atingida
    tiro--;
    cell.classList.add('errou');
    cell.innerHTML = '<img src="./assets/mar.png" alt="mar">';
    mensagem = mensagens.erro;
  } else {
    // Tentou atirar em um lugar já atingido antes
    mensagem = mensagens.repetido;
  }

  // Mostra a mensagem correspondente
  mostrarMensagemAcao(mensagem);
  // Atualiza o painel de status
  atualizarStatus();
  // Verifica se o jogo terminou
  verificarFimJogo();
}

// Revela a imagem completa de um navio quando ele é afundado
function revelarNavioUnico(navio) {
  // Pega a primeira e a última posição do navio
  const [x0, y0] = navio.posicoes[0];
  const [x1, y1] = navio.posicoes[navio.posicoes.length - 1];

  // Determina se o navio está na horizontal, vertical ou diagonal
  const orientacao = (x0 === x1) ? 'horizontal' :
                     (y0 === y1) ? 'vertical' : 'diagonal';

  // Cria o nome do tipo (para usar em classes CSS)
  const tipo = nomesNavios[navio.tamanho].toLowerCase().replace('ç', 'c').replace(/ /g, '-');

  // Percorre todas as partes do navio
  navio.posicoes.forEach(([nx, ny], i) => {
    const idx = nx * tamMapa + ny;
    const c = document.querySelectorAll('.cell')[idx];

    // Mostra a imagem do navio
    c.innerHTML = `<img src="${getImagemNavio(navio.tamanho)}" alt="" class="navio-img">`;

    // Remove classes antigas e adiciona novas conforme posição
    c.classList.remove(
      'navio-unico',
      `${tipo}-inicio-horizontal`, `${tipo}-meio-horizontal`, `${tipo}-fim-horizontal`,
      `${tipo}-inicio-vertical`, `${tipo}-meio-vertical`, `${tipo}-fim-vertical`,
      `${tipo}-inicio-diagonal`, `${tipo}-meio-diagonal`, `${tipo}-fim-diagonal`
    );

    // Define classes CSS diferentes para início, meio e fim
    if (navio.tamanho === 1) {
      c.classList.add('navio-unico');
    } else {
      const posicao = i === 0 ? 'inicio' : i === navio.posicoes.length - 1 ? 'fim' : 'meio';
      c.classList.add(`${tipo}-${posicao}-${orientacao}`);
    }
  });
}

// Retorna o caminho da imagem do navio com base no tamanho
function getImagemNavio(tamanho) {
  const nome = nomesNavios[tamanho].toLowerCase().replace('ç', 'c').replace(/ /g, '-');
  return `./assets/${nome}.png`;
}

// Verifica se o jogo terminou (vitória ou derrota)
function verificarFimJogo() {
  // Conta quantas partes de navios existem no total
  const totalPartes = navios.reduce((sum, n) => sum + n.posicoes.length, 0);

  if (acertos === totalPartes) {
    // Jogador destruiu todos os navios
    mostrarMensagemAcao(mensagens.fimDeJogoVitoria);
    endGame();
  } else if (tiro === 0) {
    // Jogador ficou sem tiros
    mostrarMensagemAcao(mensagens.fimDeJogoDerrota);
    endGame();
  }
}

// Encerra o jogo (remove cliques das células)
function endGame() {
  document.querySelectorAll('.cell').forEach(c => c.onclick = null);
}

// Torna a função "iniciar" acessível pelo botão no HTML
window.iniciar = iniciar;
