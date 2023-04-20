const operand = document.querySelectorAll(".operand");
const operator = document.querySelectorAll(".operator");
const inputScreen = document.querySelector(".input-screen");
const resultScreen = document.querySelector(".result-screen");
const clearScreen = document.querySelector(".clear");
const delChar = document.querySelector(".delete");
let firstValue = null;
let secondValue = null;
let currentOperand = "";
let operatorValue = null;
let currentOperator = null;
let result;
let setEqual = false;
let firstValueHolder;
const operatorLibrary = {
  divide: "÷",
  multiply: "x",
  add: "+",
  subtract: "-",
  equals: "="
};

operand.forEach(button => button.addEventListener("click", updateOperand));
operator.forEach(button => button.addEventListener("click", updateOperator));

clearScreen.addEventListener("click", clear);
delChar.addEventListener("click", deleteCharacter);

function updateResultScreen() {
  resultScreen.textContent = currentOperand;
}

function updateInputScreen() {
  if(!setEqual)  {
    inputScreen.textContent = firstValue + ' ' + operatorLibrary[operatorValue];
    return;;
  }
  inputScreen.textContent = `${firstValue} ${operatorLibrary[operatorValue]} ${secondValue} =`;
  setEqual = false;
}

function updateOperator(event) {
  console.log(event.target.textContent);
  if(!firstValue && firstValue !=0) setFirstValue();
  if(typeof firstValue === 'number' && operatorValue && currentOperand.length > 0){
    setSecondValue();
    result = operate(operatorValue, firstValue, secondValue);
    currentOperand = result;
    firstValueHolder = firstValue;
    firstValue = result;
    if(event.target.dataset.operator === 'equals') {
      setEqual = true;
      firstValue = firstValueHolder;
    }
    updateResultScreen();
    updateInputScreen();
    setOperandToBlank();
    operatorValue = event.target.dataset.operator;
    return;
  }
  operatorValue = event.target.dataset.operator;
  updateInputScreen();
  currentOperand = "";
}

function updateOperand(event) {
  currentOperand += event.target.textContent;
  updateResultScreen();
  console.log(currentOperand);
}

function setFirstValue() {
  if(!currentOperand) firstValue = 0;
  else firstValue = parseInt(currentOperand);
  currentOperand = "";
}

function setSecondValue() {
  secondValue = parseInt(currentOperand);
  currentOperand = "";
}

function setOperandToBlank(){
  currentOperand = "";
  secondValue = null;
}

function add(operand) {
  return operand[0] + operand[1];
}

function subtract(operand) {
  return operand[0] - operand[1];
}

function multiply(operand) {
  return operand[0] * operand[1];
}

function divide(operand) {
  return operand[0] / operand[1];
}

function operate(operator, ...operand) {
  if(operator == "add") return add(operand);
  if(operator == "subtract") return subtract(operand);
  if(operator == "multiply") return multiply(operand);
  if(operator == "divide") return divide(operand);
}

function clear() {
  inputScreen.textContent = "";
  resultScreen.textContent = "0";
  currentOperand = "";
  firstValue = null;
  secondValue = null;
  operatorValue = null;
}

function deleteCharacter() {
  const newValue = currentOperand.split("");
  newValue.splice(newValue.length - 1, 1);
  currentOperand = newValue.join("");
  updateResultScreen();
}
