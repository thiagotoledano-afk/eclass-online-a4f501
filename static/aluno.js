// Botão "Sincronizar Aluno Online": conversa com a extensão do Opera (ponte.js) por mensagem da página.
(function () {
  "use strict";
  var botao = document.getElementById("sincronizar-aluno");
  if (!botao) return;
  var status = document.getElementById("aluno-status");
  var semExt = document.getElementById("aluno-sem-extensao");
  var entrar = document.getElementById("aluno-entrar");
  var achou = false;
  function antiga(a, b) {   // "1.1" < "1.3"
    var x = a.split(".").map(Number), y = b.split(".").map(Number);
    for (var i = 0; i < Math.max(x.length, y.length); i++) {
      if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) < (y[i] || 0);
    }
    return false;
  }

  window.addEventListener("message", function (e) {
    if (e.source !== window || !e.data) return;
    if (e.data.eclass === "extensao-presente") {
      achou = true;
      botao.hidden = false; semExt.hidden = true;
      status.textContent = "Extensão conectada (v" + e.data.versao + "). Ela sincroniza sozinha a cada 4 h; o botão faz agora.";
      var atual = document.getElementById("cartao-aluno").dataset.versao;
      if (atual && antiga(e.data.versao, atual)) {   // instalada é mais velha: mostra como atualizar
        semExt.hidden = false;
        document.getElementById("aluno-instalar-titulo").innerHTML =
          "<b>Versão nova disponível (" + atual + ")</b> — a sua é a " + e.data.versao + ". Atualize assim:";
      }
    }
    if (e.data.eclass === "resultado-aluno") {
      botao.disabled = false; botao.textContent = "Sincronizar Aluno Online";
      if (e.data.ok) {
        status.textContent = "Pronto: " + e.data.materias + " matérias recebidas. Atualizando a tela…";
        setTimeout(function () { location.reload(); }, 2500);   // dá tempo da fila gravar
      } else {
        var msg = e.data.mensagem || ("Não deu: " + e.data.status);
        if (/timed out|timeout|abort/i.test(msg)) {
          msg = "O Eclass Tracker demorou demais para responder (mais de 30 s). Recarregue a página em 1 minuto e tente de novo. " +
                "Se repetir, me mande os arquivos travamento-*.txt da pasta data\\logs.";
        }
        status.textContent = msg;
        entrar.hidden = !(e.data.status === "sessao" || e.data.status === "primeira");
      }
    }
  });
  botao.addEventListener("click", function () {
    botao.disabled = true; botao.textContent = "Lendo o Aluno Online…";
    status.textContent = "Lendo o boletim com o seu login…";
    window.postMessage({eclass: "sincronizar-aluno"}, location.origin);
    setTimeout(function () {   // sem resposta: não deixa o botão preso
      if (botao.disabled) {
        botao.disabled = false; botao.textContent = "Sincronizar Aluno Online";
        status.textContent = "Sem resposta em 60 s. Recarregue a página (F5) e tente de novo; se continuar, reinicie o Eclass Tracker.";
      }
    }, 60000);
  });
  setTimeout(function () {
    if (!achou) { semExt.hidden = false; status.textContent = "Extensão não encontrada neste navegador."; }
  }, 1500);
})();
