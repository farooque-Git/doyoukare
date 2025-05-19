const hoursRange = document.getElementById("hours");
const percentRange = document.getElementById("percentage");
const hoursInput = document.getElementById("hoursInput");
const percentInput = document.getElementById("percentInput");

const overtimeCostEl = document.getElementById("overtimeCost");
const kareCostEl = document.getElementById("kareCost");
const monthlySavingsEl = document.getElementById("monthlySavings");
const annualSavingsEl = document.getElementById("annualSavings");
const replaceText = document.getElementById("replaceText");
const hourText = document.getElementById("hourText");

// Constants from UI
const OVERTIME_COST_PER_HOUR = 43.5;
const KARE_COST_PER_HOUR = 21.39;

function calculate() {
  const hours = parseInt(hoursInput.value);
  const percent = parseInt(percentInput.value);

  const kareHours = (hours * percent) / 100;
  const normalOvertimeHours = hours - kareHours;

  const overtimeCost = normalOvertimeHours * OVERTIME_COST_PER_HOUR;
  const kareCost = kareHours * KARE_COST_PER_HOUR;
  const total = overtimeCost + kareCost;
  const savings = hours * OVERTIME_COST_PER_HOUR - total;

  overtimeCostEl.textContent = `$${(
    normalOvertimeHours * OVERTIME_COST_PER_HOUR
  ).toLocaleString()}`;
  kareCostEl.textContent = `$${kareCost.toLocaleString()}`;
  monthlySavingsEl.textContent = `$${Math.round(savings).toLocaleString()}`;
  annualSavingsEl.textContent = `$${Math.round(savings * 12).toLocaleString()}`;
  replaceText.textContent = `${percent}%`;
  hourText.textContent = `${hours}`;
}

[hoursRange, percentRange, hoursInput, percentInput].forEach((input) => {
  input.addEventListener("input", (e) => {
    if (e.target === hoursRange) hoursInput.value = hoursRange.value;
    if (e.target === percentRange) percentInput.value = percentRange.value;
    if (e.target === hoursInput) hoursRange.value = hoursInput.value;
    if (e.target === percentInput) percentRange.value = percentInput.value;
    calculate();
  });
});

calculate();
