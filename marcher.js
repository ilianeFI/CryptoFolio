// marcher.js
// Rôle : afficher 4 courbes (BTC/ETH/SOL/BNB) via API Binance + Chart.js

const COIN_MARCHE = {
  BTC: { symbole: "BTCUSDT", canvasId: "mkt-btc" },
  ETH: { symbole: "ETHUSDT", canvasId: "mkt-eth" },
  SOL: { symbole: "SOLUSDT", canvasId: "mkt-sol" },
  BNB: { symbole: "BNBUSDT", canvasId: "mkt-bnb" },
};

const charts = {}; // mémoriser les charts pour update

// Convertir timeframe en interval Binance
function tfEnInterval(tf) {
  switch (tf) {
    case "1H":
      return "1h";
    case "4H":
      return "4h";
    default:
      return "1d";
  }
}

// Dessiner ou mettre à jour une courbe
async function dessinerCourbe(ticker, tf) {
  const conf = COIN_MARCHE[ticker];
  if (!conf) return;

  const canvas = document.getElementById(conf.canvasId);
  if (!canvas) return;

  const interval = tfEnInterval(tf);
  const url = `https://api.binance.com/api/v3/klines?symbol=${conf.symbole}&interval=${interval}&limit=100`;

  try {
    const resp = await fetch(url);
    const data = await resp.json();
    if (!Array.isArray(data)) return;

    const labels = [];
    const valeurs = [];

    data.forEach((kline) => {
      const ts = kline[0]; // timestamp
      const prix = Number(kline[4]); // prix de clôture
      const d = new Date(ts);
      labels.push(tf === "1D"
        ? d.toLocaleDateString()
        : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      valeurs.push(prix);
    });

    if (charts[conf.canvasId]) {
      charts[conf.canvasId].data.labels = labels;
      charts[conf.canvasId].data.datasets[0].data = valeurs;
      charts[conf.canvasId].update();
      return;
    }

    charts[conf.canvasId] = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          data: valeurs,
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: true } },
      },
    });
  } catch (e) {
    console.error("Erreur Binance API", ticker, e);
  }
}

// Gestion des chips
function activerChip(card, tf) {
  card.querySelectorAll(".chip").forEach(c => c.classList.remove("chip-active"));
  const actif = card.querySelector(`.chip[data-tf="${tf}"]`);
  if (actif) actif.classList.add("chip-active");
}

// Brancher les chips pour chaque carte
function brancherCarte(ticker) {
  const card = document.querySelector(`#marchee .glass-card[data-ticker="${ticker}"]`);
  if (!card) return;

  card.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", async () => {
      const tf = (chip.dataset.tf || "1D").toUpperCase();
      activerChip(card, tf);
      await dessinerCourbe(ticker, tf);
    });
  });

  activerChip(card, "1D");
}

// Init
export async function initMarchee() {
  await Promise.all([
    dessinerCourbe("BTC", "1D"),
    dessinerCourbe("ETH", "1D"),
    dessinerCourbe("SOL", "1D"),
    dessinerCourbe("BNB", "1D"),
  ]);

  ["BTC", "ETH", "SOL", "BNB"].forEach(brancherCarte);
}
