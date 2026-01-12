// dashboard.js — VERSION FIXÉE (BINANCE, COHÉRENTE AVEC CRUD)

// ===============================
// INIT DASHBOARD
// ===============================
export const initDashboard = async () => {
  const kpiTotalInvesti = document.querySelector("#kpi-total-investi");
  const kpiNbActifs = document.querySelector("#kpi-nb-actifs");
  const kpiValeurActuelle = document.querySelector("#kpi-current-value");
  const kpiDerniereMaj = document.querySelector("#kpi-last-update");
  const canvas = document.querySelector("#chart-portefeuille");

  if (
    !kpiTotalInvesti ||
    !kpiNbActifs ||
    !kpiValeurActuelle ||
    !kpiDerniereMaj ||
    !canvas
  )
    return;

  // ===============================
  // LECTURE LOCALSTORAGE
  // ===============================
  let actifs = [];
  try {
    actifs = JSON.parse(localStorage.getItem("cryptos") || "[]");
    if (!Array.isArray(actifs)) actifs = [];
  } catch {
    actifs = [];
  }

  // ===============================
  // KPI : TOTAL INVESTI
  // ===============================
  let totalInvesti = 0;
  actifs.forEach((a) => {
    totalInvesti += (Number(a.prix) || 0) * (Number(a.quantite) || 0);
  });
  kpiTotalInvesti.textContent = totalInvesti.toFixed(2) + " $";

  // ===============================
  // KPI : NOMBRE D’ACTIFS
  // ===============================
  kpiNbActifs.textContent = String(actifs.length);

  // ===============================
  // BINANCE : SYMBOLE → PAIRE
  // ===============================
  const paireBinance = {
    BTC: "BTCUSDT",
    ETH: "ETHUSDT",
    SOL: "SOLUSDT",
    BNB: "BNBUSDT",
    ADA: "ADAUSDT",
    XRP: "XRPUSDT",
    DOGE: "DOGEUSDT",
    USDT: null,
    USDC: null,
  };

  // ===============================
  // RÉCUPÉRATION PRIX BINANCE
  // ===============================
  const valeurParSymbole = {};

  try {
    for (const actif of actifs) {
      const sym = String(actif.symbole || "").trim().toUpperCase();
      const qte = Number(actif.quantite) || 0;
      if (qte <= 0) continue;

      let prix = 0;

      if (sym === "USDT" || sym === "USDC") {
        prix = 1;
      } else {
        const paire = paireBinance[sym];
        if (!paire) continue;

        const resp = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${paire}`
        );
        const data = await resp.json();
        prix = Number(data?.price) || 0;
      }

      if (!Number.isFinite(prix) || prix <= 0) continue;

      valeurParSymbole[sym] =
        (valeurParSymbole[sym] || 0) + prix * qte;
    }
  } catch {
    kpiValeurActuelle.textContent = "Erreur API";
    kpiDerniereMaj.textContent = new Date().toLocaleString();
    return;
  }

  // ===============================
  // KPI : VALEUR ACTUELLE
  // ===============================
  const labels = Object.keys(valeurParSymbole);
  const values = Object.values(valeurParSymbole);

  let totalActuel = 0;
  values.forEach((v) => (totalActuel += v));

  kpiValeurActuelle.textContent = "$" + totalActuel.toFixed(2);
  kpiDerniereMaj.textContent = new Date().toLocaleString();

  // ===============================
  // CHART.JS DOUGHNUT
  // ===============================
  const ctx = canvas.getContext("2d");
  if (window._pfChart) {
    window._pfChart.data.labels = labels;
    window._pfChart.data.datasets[0].data = values;
    window._pfChart.update();
  } else {
    window._pfChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{ data: values }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  }

  // ===============================
  // TABLE INFOS
  // ===============================
  remplirTableInfos();
};

// ===============================
// TABLE DASHBOARD
// ===============================
const remplirTableInfos = () => {
  const tbody = document.querySelector("#crypto-table-body");
  if (!tbody) return;

  let actifs = [];
  try {
    actifs = JSON.parse(localStorage.getItem("cryptos") || "[]");
    if (!Array.isArray(actifs)) actifs = [];
  } catch {
    actifs = [];
  }

  tbody.innerHTML = "";
  actifs.forEach((a) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.name || ""}</td>
      <td>${a.symbole || ""}</td>
      <td>${a.quantite || 0}</td>
      <td>${a.prix || 0}</td>
    `;
    tbody.appendChild(tr);
  });
};
