// Janela de editar/lançar nota. Abre na hora do clique, já preenchida com o que está na tela.
(function () {
  "use strict";
  var dlg = document.getElementById("dialogo-nota");
  if (!dlg || !dlg.showModal) return;
  var form = document.getElementById("form-nota");
  var f = function (nome) { return form.querySelector("[name=" + nome + "]"); };   // (form.elements["item"] é um método!)

  function opcoes(card, atual) {
    var sel = f("categoria");
    sel.innerHTML = "";
    var lista = [["", "automático"]];
    (card.dataset.componentes || "").split("|").filter(Boolean).forEach(function (c) { lista.push([c, c]); });
    lista.push(["—", "fora da conta"]);
    lista.forEach(function (o) {
      var op = document.createElement("option");
      op.value = o[0]; op.textContent = o[1]; op.selected = o[0] === (atual || "");
      sel.appendChild(op);
    });
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-editar-nota], [data-nova-nota]");
    if (!b) return;
    var card = b.closest(".nota-card");
    var nova = b.hasAttribute("data-nova-nota");
    form.action = nova ? "/materia/" + card.dataset.materia + "/notas/nova" : "/nota/" + b.dataset.editarNota + "/editar";
    document.getElementById("dialogo-titulo").textContent = nova ? "Lançar nota" : b.dataset.item;
    document.getElementById("campo-item").hidden = !nova;
    f("item").required = nova; f("item").value = "";
    f("nota").value = nova ? "" : (b.dataset.nota || "");
    f("nota").required = nova;
    f("maximo").value = nova ? "10" : (b.dataset.maximo || "10");
    f("voltar").value = card.dataset.voltar || location.pathname;
    opcoes(card, nova ? b.dataset.novaNota : b.dataset.componente);
    document.getElementById("botao-apagar").hidden = nova || b.dataset.origem !== "manual";
    dlg.showModal();
    (nova ? f("item") : f("nota")).focus();
  });
  document.getElementById("botao-cancelar").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });   // clique fora fecha
})();
