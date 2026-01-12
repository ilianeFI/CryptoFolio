import {
  ajouterCrypto,afficherCryptos,suppCrypto,modifierCrypto, resetCrudComplet,
} from "./fonctions.js";

import { initMarchee } from "./marcher.js";
import { ajouterSimple, afficherSimple, resetSimple } from "./fctsimple.js";
import { initDashboard } from "./dashboard.js";

document.addEventListener("DOMContentLoaded", () => {
  // DASHBOARD 
  initDashboard();
  const refreshBtn = document.querySelector("#refresh-dashboard");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", (e) => {
      e.preventDefault();
      initDashboard();
    });
  }

  // CRUD COMPLET
  afficherCryptos();
  ajouterCrypto();
  resetCrudComplet();
  suppCrypto();
  modifierCrypto();

  // CRUD SIMPLE
  afficherSimple();
  ajouterSimple();
  resetSimple();

  // MARCHÉS
  initMarchee();

  // NAVIGATION SIDEBAR 
  const links = document.querySelectorAll(".nav-pill");
  const pages = document.querySelectorAll("main .page");

  const showPage = (id) => {
    pages.forEach((section) => {
      section.style.display = section.id === id ? "block" : "none";
    });
    
    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const targetId = href.startsWith("#") ? href.substring(1) : null;
      link.classList.toggle("active", targetId === id);
    });
  };

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      e.preventDefault();
      const id = href.substring(1);
      showPage(id);
    });
  });

  showPage("dashboard");
});
