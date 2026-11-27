const display = document.getElementById("display");
const expressionLabel = document.getElementById("expression");
const message = document.getElementById("message");
const keypad = document.getElementById("keypad");
const historyList = document.getElementById("history");

let expression = "";
let justCalculated = false;

function prettyExpression(value) {
  return value.replace(/\*/g, "×").replace(/\//g, "÷");
}

function updateDisplay() {
  display.textContent = expression
    ? prettyExpression(expression)
    : "0";
  expressionLabel.textContent = "";
  message.textContent = "";
}

function clearCalculator() {
  expression = "";
  justCalculated = false;
  updateDisplay();
}

function appendValue(value) {
  message.textContent = "";

  if (justCalculated && /[0-9.(]/.test(value)) {
    expression = "";
  }
  justCalculated = false;

  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/()]/).pop();
    if (currentNumber.includes(".")) return;
    if (!currentNumber) expression += "0";
  }

  expression += value;
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  justCalculated = false;
  updateDisplay();
}

function toggleSign() {
  if (!expression) {
    expression = "-";
  } else if (justCalculated) {
    expression = `-(${expression})`;
  } else {
    expression = `-(${expression})`;
  }
  justCalculated = false;
  updateDisplay();
}

function addHistory(source, result) {
  const item = document.createElement("li");
  const calculation = document.createElement("span");
  const answer = document.createElement("span");

  calculation.textContent = prettyExpression(source);
  answer.textContent = result;
  answer.className = "history-result";

  item.append(calculation, answer);
  historyList.prepend(item);

  while (historyList.children.length > 5) {
    historyList.lastElementChild.remove();
  }
}

async function calculate() {
  if (!expression.trim()) return;

  const source = expression;
  message.textContent = "";

  try {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression: source })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Calculation failed.");
    }

    const result = Number(data.result);
    const formatted = Number.isInteger(result)
      ? String(result)
      : String(Number(result.toPrecision(12)));

    expressionLabel.textContent = `${prettyExpression(source)} =`;
    expression = formatted;
    display.textContent = formatted;
    addHistory(source, formatted);
    justCalculated = true;
  } catch (error) {
    message.textContent = error.message;
  }
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.action === "clear") clearCalculator();
  else if (button.dataset.action === "delete") deleteLast();
  else if (button.dataset.action === "sign") toggleSign();
  else if (button.dataset.action === "calculate") calculate();
  else if (button.dataset.value) appendValue(button.dataset.value);
});

document.getElementById("clear-history").addEventListener("click", () => {
  historyList.replaceChildren();
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9.]$/.test(event.key)) {
    appendValue(event.key);
  } else if (["+", "-", "*", "/", "(", ")"].includes(event.key)) {
    appendValue(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    deleteLast();
  } else if (event.key === "Escape") {
    clearCalculator();
  }
});