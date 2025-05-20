const stateData = {
  Colorado: {
    payRate: 21.32,
    withOvertime: 31.98,
    overtimeCost: 9.27,
    realHourlyCost: 41.25,
    kareRate: 31.66,
    savings: 9.59,
  },
  Oregon: {
    payRate: 23.77,
    withOvertime: 35.655,
    overtimeCost: 10.34,
    realHourlyCost: 45.99,
    kareRate: 32.19,
    savings: 13.8,
  },
  Alabama: {
    payRate: 16,
    withOvertime: 24,
    overtimeCost: 6.96,
    realHourlyCost: 30.96,
    kareRate: 20.83,
    savings: 10.13,
  },
  // Add remaining states as needed
};

const stateSelect = document.getElementById("state");
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

function updateSummary(state) {
  const data = stateData[state];
  if (data) {
    payrateEl.textContent = `$${data.payRate}`;
    withOvertimeEl.textContent = `$${data.withOvertime}`;
    overtimeCostFixedEl.textContent = `$${data.overtimeCost}`;
    realHourlyCostEl.textContent = `$${data.realHourlyCost}`;
    kareRateEl.textContent = `$${data.kareRate}`;
    savingsEl.textContent = `$${data.savings}`;
    OVERTIME_COST_PER_HOUR = data.realHourlyCost;
    KARE_COST_PER_HOUR = data.kareRate;
    calculate();
  }
}

function calculate() {
  const hours = parseInt(hoursInput.value);
  const percent = parseInt(percentInput.value);

  const kareHours = (hours * percent) / 100;
  const normalOvertimeHours = hours - kareHours;

  const overtimeCost = normalOvertimeHours * OVERTIME_COST_PER_HOUR;
  const kareCost = kareHours * KARE_COST_PER_HOUR;
  const total = overtimeCost + kareCost;
  const savings = hours * OVERTIME_COST_PER_HOUR - total;

  overtimeCostEl.textContent = `$${overtimeCost.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
  kareCostEl.textContent = `$${kareCost.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
  monthlySavingsEl.textContent = `$${Math.round(savings).toLocaleString()}`;
  annualSavingsEl.textContent = `$${Math.round(savings * 12).toLocaleString()}`;
  replaceText.textContent = `${percent}%`;
  hourText.textContent = `${hours}`;
}

[stateSelect, hoursRange, percentRange, hoursInput, percentInput].forEach(
  (input) => {
    input.addEventListener("input", (e) => {
      if (e.target === stateSelect) {
        updateSummary(stateSelect.value);
      }
      if (e.target === hoursRange) hoursInput.value = hoursRange.value;
      if (e.target === percentRange) percentInput.value = percentRange.value;
      if (e.target === hoursInput) hoursRange.value = hoursInput.value;
      if (e.target === percentInput) percentRange.value = percentInput.value;
      calculate();
    });
  }
);

// Initial load
updateSummary(stateSelect.value);
