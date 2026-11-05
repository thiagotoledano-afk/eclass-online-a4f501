(function () {
  var b = document.getElementById("copiar-diag"), t = document.getElementById("texto-diag");
  if (!b) return;
  b.addEventListener("click", function () {
    t.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    if (navigator.clipboard) navigator.clipboard.writeText(t.value).then(function () { ok = true; }).catch(function () {});
    document.getElementById("copiado").textContent = "Copiado. Agora é só colar (Ctrl+V) na mensagem.";
  });
})();
