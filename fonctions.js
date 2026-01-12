// fonctions.js — VERSION FIXÉE (BINANCE, PRIX OK)

// ===============================
// 1) PRIX MARCHÉ BINANCE
// ===============================
export const fetchPrixMarcheUSD_Binance = async (symbole) => {
  const sym = String(symbole || "").trim().toUpperCase();

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

  // Stablecoins
  if (sym === "USDT" || sym === "USDC") return 1;

  const paire = paireBinance[sym];
  if (!paire) return null;

  try {
    const resp = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${paire}`
    );
    const data = await resp.json();
    const price = Number(data?.price);
    return Number.isFinite(price) && price > 0 ? price : null;
  } catch {
    return null;
  }
};

// ===============================
// 2) CREATE
// ===============================
export const ajouterCrypto = () => {
  const btn = document.querySelector("#submit");
  if (!btn) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const nom = document.querySelector("#nom-input").value.trim();
    const symbole = document.querySelector("#symbole-input").value.trim().toUpperCase();
    const quantite = Number(document.querySelector("#qte-input").value);
    const categorie = document.querySelector("#cat-input").value || "";
    const date = document.querySelector("#date-input").value || "";

    if (!nom || !symbole || !Number.isFinite(quantite) || quantite <= 0) {
      alert("Champs invalides");
      return;
    }

    const prix = await fetchPrixMarcheUSD_Binance(symbole);
    if (!Number.isFinite(prix) || prix <= 0) {
      alert("Prix introuvable pour " + symbole);
      return;
    }

    const cryptos = JSON.parse(localStorage.getItem("cryptos") || "[]");
    cryptos.push({ name: nom, symbole, quantite, prix, categorie, date });
    localStorage.setItem("cryptos", JSON.stringify(cryptos));
    location.reload();
  });
};

// ===============================
// 3) READ
// ===============================
export const afficherCryptos = () => {
  const cryptos = JSON.parse(localStorage.getItem("cryptos") || "[]");
  const tbody = document.querySelector("#actifs-tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  cryptos.forEach((c, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.symbole}</td>
        <td>${c.quantite}</td>
        <td>${c.prix}</td>
        <td>${c.categorie || ""}</td>
        <td>${c.date || ""}</td>
        <td class="text-end">
          <button class="update btn btn-sm btn-outline-light"
                  data-index="${i}"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal">
            ✏️
          </button>
          <button class="delete btn btn-sm btn-outline-danger"
                  data-index="${i}">
            🗑️
          </button>
        </td>
      </tr>
    `;
  });
};

// ===============================
// 4) DELETE
// ===============================
export const suppCrypto = () => {
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const res=confirm("voulez vous vraiment supprimer Ce Crypto ?");
      if(res){
              const idx = Number(e.currentTarget.dataset.index);
      const cryptos = JSON.parse(localStorage.getItem("cryptos") || "[]");
      cryptos.splice(idx, 1);
      localStorage.setItem("cryptos", JSON.stringify(cryptos));
      location.reload();
      }

    });
  });
};

// ===============================
// 5) UPDATE
// ===============================
export const modifierCrypto = () => {
  const form = document.querySelector("#form-modif");
  if (!form) return;

  const nom = document.querySelector("#m-nom");
  const symbole = document.querySelector("#m-symbole");
  const quantite = document.querySelector("#m-quantite");
  const date = document.querySelector("#m-date");
  const cat = document.querySelector("#m-cat");
  const closeBtn = document.querySelector("#button-close");

  let indexCourant = null;

  document.querySelectorAll(".update").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      indexCourant = Number(e.currentTarget.dataset.index);
      const cryptos = JSON.parse(localStorage.getItem("cryptos") || "[]");
      const c = cryptos[indexCourant];
      if (!c) return;

      nom.value = c.name;
      symbole.value = c.symbole;
      quantite.value = c.quantite;
      date.value = c.date || "";
      cat.value = c.categorie || "";
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (indexCourant === null) return;

    const mNom = nom.value.trim();
    const mSym = symbole.value.trim().toUpperCase();
    const mQte = Number(quantite.value);
    const mDate = date.value;
    const mCat = cat.value;

    if (!mNom || !mSym || !Number.isFinite(mQte) || mQte <= 0) {
      alert("Champs invalides");
      return;
    }

    const prix = await fetchPrixMarcheUSD_Binance(mSym);
    if (!Number.isFinite(prix) || prix <= 0) {
      alert("Prix introuvable pour " + mSym);
      return;
    }

    const cryptos = JSON.parse(localStorage.getItem("cryptos") || "[]");
    cryptos[indexCourant] = {
      ...cryptos[indexCourant],
      name: mNom,
      symbole: mSym,
      quantite: mQte,
      prix,
      date: mDate,
      categorie: mCat,
    };

    localStorage.setItem("cryptos", JSON.stringify(cryptos));
    closeBtn?.click();
    location.reload();
  });
};

// ===============================
// 6) RESET
// ===============================
export const resetCrudComplet = () => {
  const form = document.querySelector("#crud form");
  if (!form) return;

  form.addEventListener("reset", (e) => {
    if (!confirm("Réinitialiser tout le portefeuille ?")) {
      e.preventDefault();
      return;
    }
    localStorage.removeItem("cryptos");
    location.reload();
  });
};
