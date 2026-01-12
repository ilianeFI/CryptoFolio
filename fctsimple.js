// fctsimple.js
// Rôle : CRUD simple (Module 2) : ajouter / afficher / supprimer / reset.
import { fetchPrixMarcheUSD_Binance } from "./fonctions.js";
const CLE_SIMPLE = "cryptosSimple";

// CREATE 
export const ajouterSimple = () => {
  const sectionSimple = document.querySelector("#crud-simple") || document;
  const btnAjouter = sectionSimple.querySelector("#ajouter");
  if (!btnAjouter) return;

  btnAjouter.addEventListener("click", async (e) => {
    e.preventDefault();

    const nom = sectionSimple.querySelector("#nom").value.trim();
    const quantite = Number(sectionSimple.querySelector("#quantite").value);
    const symbole = sectionSimple.querySelector("#symbole").value.trim();
    const categorie="Meme";
    const aujourdhui = new Date();
    const date = aujourdhui.toISOString().split("T")[0];
    if (!nom || !symbole || !quantite) return;
    const prix = await fetchPrixMarcheUSD_Binance(symbole);
    if (!Number.isFinite(prix) || prix <= 0) {
      alert("Prix introuvable pour " + symbole);
      return;
    }


    const cryptos = JSON.parse(localStorage.getItem("cryptos") || "[]");
    cryptos.push({ name: nom, symbole, quantite, prix, categorie, date });
    localStorage.setItem("cryptos", JSON.stringify(cryptos));
    location.reload();

    afficherSimple();
  });
};

// READ : afficher la liste simple
export const afficherSimple = () => {
  const liste = JSON.parse(localStorage.getItem(CLE_SIMPLE) || "[]");

  const sectionSimple = document.querySelector("#crud-simple") || document;
  const tbody = sectionSimple.querySelector("#actifs-simple-tbody") || document.querySelector("#actifs-simple-tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  for (let i = 0; i < liste.length; i++) {
    const actif = liste[i];

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${actif.nom || ""}</td>
      <td>${actif.symbole || ""}</td>
      <td>${Number(actif.quantite) || 0}</td>
      <td class="text-end">
        <button class="delete-simple btn btn-sm btn-outline-danger" data-index="${i}" type="button">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  }
};

// DELETE : supprimer un élément simple (délégation d'événement)
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".delete-simple");
  if (!btn) return;

  // sécurité : on supprime seulement si le bouton est dans la section CRUD simple
  const sectionSimple = document.querySelector("#crud-simple");
  if (sectionSimple && !sectionSimple.contains(btn)) return;

  const index = Number(btn.dataset.index);
  const liste = JSON.parse(localStorage.getItem(CLE_SIMPLE) || "[]");
  if (!liste[index]) return;

  liste.splice(index, 1);
  localStorage.setItem(CLE_SIMPLE, JSON.stringify(liste));

  afficherSimple();
});

// RESET : bouton poubelle à côté de "Ajouter"
export const resetSimple = () => {
  const btnReset = document.querySelector("#reset-simple");
  if (!btnReset) return;

  btnReset.addEventListener("click", () => {
    const ok = confirm("Réinitialiser le portefeuille (simple) ?");
    if (!ok) return;

    localStorage.removeItem(CLE_SIMPLE);
    location.reload();
  });
};
