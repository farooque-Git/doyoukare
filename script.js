// Import state data
import { stateData } from "./data.js";

const stateSelect = document.getElementById("state");
const licenseSelect = document.getElementById("license");
const payrateEl = document.querySelector(".summary p:nth-of-type(1) span");
const withOvertimeEl = document.querySelector(".summary p:nth-of-type(2) span");
const overtimeCostFixedEl = document.querySelector(
  ".summary p:nth-of-type(3) span"
);
const realHourlyCostEl = document.querySelector(
  ".summary p:nth-of-type(4) strong"
);
const kareRateEl = document.querySelector(
  ".summary p:nth-of-type(5) span.orange"
);
const savingsEl = document.querySelector(
  ".summary p:nth-of-type(6) strong.orange"
);

// Update summary text based on license type
const summaryTexts = document.querySelectorAll(".summary p");
const licenseTypeText = summaryTexts[0].textContent.split(" ")[1]; // Get the license type text

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

let OVERTIME_COST_PER_HOUR = 41.25; // default
let KARE_COST_PER_HOUR = 31.66; // default

// License type multipliers (adjust these based on your actual rates)
const licenseMultipliers = {
  "CNA / CMA": 1,
  "LPN/ LVN": 1.5,
  RN: 2.2,
};

function formatCurrency(value) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function updateSummaryTexts(licenseType) {
  summaryTexts.forEach((p) => {
    const text = p.textContent;
    if (text.includes("CNA / CMA")) {
      p.textContent = text.replace("CNA / CMA", licenseType);
    }
  });
}

function updateSummary(state, licenseType) {
  const data = stateData[state];
  if (data) {
    const multiplier = licenseMultipliers[licenseType] || 1;

    // Apply multiplier to all rates
    const adjustedPayRate = data.payRate * multiplier;
    const adjustedWithOvertime = data.withOvertime * multiplier;
    const adjustedOvertimeCost = data.overtimeCost * multiplier;
    const adjustedRealHourlyCost = data.realHourlyCost * multiplier;
    const adjustedKareRate = data.kareRate * multiplier;
    const adjustedSavings = data.savings * multiplier;

    payrateEl.textContent = formatCurrency(adjustedPayRate);
    withOvertimeEl.textContent = formatCurrency(adjustedWithOvertime);
    overtimeCostFixedEl.textContent = formatCurrency(adjustedOvertimeCost);
    realHourlyCostEl.textContent = formatCurrency(adjustedRealHourlyCost);
    kareRateEl.textContent = formatCurrency(adjustedKareRate);
    savingsEl.textContent = formatCurrency(adjustedSavings);

    OVERTIME_COST_PER_HOUR = adjustedRealHourlyCost;
    KARE_COST_PER_HOUR = adjustedKareRate;

    // Update the summary texts to reflect the selected license type
    updateSummaryTexts(licenseType);

    calculate();
  }
}

function calculate() {
  // parse values safely and clamp inputs to valid ranges
  let hours = parseInt(hoursInput.value);
  let percent = parseInt(percentInput.value);

  if (isNaN(hours) || hours < 0) hours = 0;
  if (isNaN(percent) || percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  // keep inputs in sync (for sliders and text inputs)
  hoursInput.value = hours;
  hoursRange.value = hours;
  percentInput.value = percent;
  percentRange.value = percent;

  const kareHours = (hours * percent) / 100;
  const normalOvertimeHours = hours - kareHours;

  const overtimeCost = normalOvertimeHours * OVERTIME_COST_PER_HOUR;
  const kareCost = kareHours * KARE_COST_PER_HOUR;
  const total = overtimeCost + kareCost;
  const savings = hours * OVERTIME_COST_PER_HOUR - total;

  overtimeCostEl.textContent = formatCurrency(overtimeCost);
  kareCostEl.textContent = formatCurrency(kareCost);
  monthlySavingsEl.textContent = formatCurrency(savings);
  annualSavingsEl.textContent = formatCurrency(savings * 12);
  replaceText.textContent = `${percent}%`;
  hourText.textContent = `${hours}`;
}

// Set up event listeners for each input
stateSelect.addEventListener("change", () => {
  updateSummary(stateSelect.value, licenseSelect.value);
});

licenseSelect.addEventListener("change", () => {
  updateSummary(stateSelect.value, licenseSelect.value);
});

hoursRange.addEventListener("input", () => {
  hoursInput.value = hoursRange.value;
  calculate();
});

percentRange.addEventListener("input", () => {
  percentInput.value = percentRange.value;
  calculate();
});

hoursInput.addEventListener("input", () => {
  let val = Math.min(
    Math.max(parseInt(hoursInput.value) || 0, parseInt(hoursRange.min) || 0),
    parseInt(hoursRange.max) || 500
  );
  hoursInput.value = val;
  hoursRange.value = val;
  calculate();
});

percentInput.addEventListener("input", () => {
  let val = Math.min(
    Math.max(
      parseInt(percentInput.value) || 0,
      parseInt(percentRange.min) || 0
    ),
    parseInt(percentRange.max) || 150
  );
  percentInput.value = val;
  percentRange.value = val;
  calculate();
});

// Initial load
updateSummary(stateSelect.value, licenseSelect.value);
