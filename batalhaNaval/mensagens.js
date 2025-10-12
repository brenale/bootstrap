export const mensagens = {
  inicio: (tiros, navios) => `Status: Você tem ${tiros} tiros! ${navios} navio${navios !== 1 ? 's' : ''}.`,
  semTiros: "Status:⚠️ Acabaram seus tiros!",
  acerto: "Status:💥 Acertou uma parte do navio!",
  afundado: (nome) => `Status:🔥 ${nome} afundado!`,
  erro: "Status:❌ Errou!",
  repetido: "Status:⛔ Você já atirou aqui!",
  fimDeJogoVitoria: "Status:🏁 Todos os navios foram afundados! Parabéns!",
  fimDeJogoDerrota: "Status:⚠️ Fim dos tiros! Fim de jogo!",
  restanteTiros: (tiros) => ` Restam ${tiros} tiro${tiros !== 1 ? 's' : ''}.`,
  restanteNavios: (navios) => ` Restam ${navios} navio${navios !== 1 ? 's' : ''}.`
};

export function mostrarMensagem(id, texto) {
  const el = document.getElementById(id);
  if (el) el.textContent = texto;
}

