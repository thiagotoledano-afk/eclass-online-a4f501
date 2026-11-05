// Calendário do dashboard. `fonte` é a URL da API (servidor local) ou a lista de eventos (versão online).
// `aoClicar(url)` permite à versão online navegar sem sair da página.
window.iniciarCalendario = function (el, fonte, aoClicar) {
  if (!el || !window.FullCalendar) return null;
  var celular = window.matchMedia("(max-width: 720px)").matches;
  var cal = new FullCalendar.Calendar(el, {
    locale: "pt-br",
    initialView: celular ? "listWeek" : "dayGridMonth",
    headerToolbar: celular
      ? { left: "prev,next", center: "title", right: "listWeek,dayGridMonth" }
      : { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,listWeek" },
    height: "auto",
    firstDay: 1,
    events: fonte,
    eventDisplay: "block",
    defaultTimedEventDuration: "00:01",
    displayEventEnd: false,
    eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
    noEventsContent: "Nada nesse intervalo.",
    eventClick: function (info) {
      if (aoClicar && info.event.url) {
        info.jsEvent.preventDefault();
        aoClicar(info.event.url);
      }
    },
    eventDidMount: function (info) {
      var p = info.event.extendedProps;
      info.el.title = (p.materia || "") + (p.fonte ? " · fonte: " + p.fonte : "");
      var dot = info.el.querySelector(".fc-list-event-dot");
      if (dot) dot.style.borderColor = info.event.backgroundColor;
    }
  });
  cal.render();
  return cal;
};

document.addEventListener("DOMContentLoaded", function () {
  if (window.ECLASS_ONLINE) return;  // a versão online chama iniciarCalendario sozinha
  window.iniciarCalendario(document.getElementById("calendario"), "/api/eventos");
});
