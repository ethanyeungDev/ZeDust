// ui/modal.js
import { simulateTurn } from "../campaign/turnSystem.js";
import { updateCharts } from "./netChart.js";

export function initModal() {
  const btn = document.getElementById("nextTurnBtn");
  const modal = document.getElementById("confirmModal");
  const yes = document.getElementById("confirmYes");
  const no = document.getElementById("confirmNo");

  btn.addEventListener("click", () => modal.classList.remove("hidden"));
  no.addEventListener("click", () => modal.classList.add("hidden"));

  yes.addEventListener("click", () => {
    modal.classList.add("hidden");
    const delta = simulateTurn();
    updateCharts();
  });
}