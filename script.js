const operand = document.querySelectorAll(".operand");
const operator = document.querySelectorAll(".operator");
const equal = document.querySelector(".equal-operator");
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
let fromOperateEqualForOperand = false;
let fromOperateEqualForOperator = false;
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
  firstValue = result;
  setEqual = false;
}

function updateOperator(event) {
  console.log(event.target.className);
  if(fromOperateEqualForOperator) {
    operatorValue = event.target.dataset.operator;
    fromOperateEqualForOperator = false;
  }
  
  if(!firstValue && firstValue !=0) setFirstValue();
  
  if(typeof firstValue === 'number' && operatorValue && currentOperand.length > 0){
    setSecondValue();
    result = operate(operatorValue, firstValue, secondValue);
    currentOperand = result;
    currentOperator = event.target.dataset.operator;
    firstValueHolder = firstValue;
    firstValue = result;
    if(currentOperator === 'equals') {
      setEqual = true;
      fromOperateEqualForOperand = true;
      fromOperateEqualForOperator = true;
      firstValue = firstValueHolder;
      currentOperator = operatorValue;
      updateEqualListener();
    }
    operatorValue = currentOperator;
    updateResultScreen();
    updateInputScreen();
    setOperandToBlank();
    console.log(firstValue + ' ' +operatorValue+ ' '+secondValue);
    return;
  } 
  operatorValue = event.target.dataset.operator;
  updateInputScreen();
  currentOperand = "";
}

function updateEqualListener(){
  if(fromOperateEqualForOperator) {
    equal.removeEventListener("click", updateOperator);
    return;
  }
  equal.addEventListener("click", updateOperator);
}

function setOperandToBlank(){
  currentOperand = "";
  secondValue = null;
}

function updateOperand(event) {
  if(fromOperateEqualForOperand && fromOperateEqualForOperator) {
    firstValue = null;
    fromOperateEqualForOperand = false;
  }
  if(typeof firstValue === 'number' && operatorValue) updateEqualListener();
  if(currentOperand.includes(".") && event.target.textContent == ".") return;
  currentOperand += event.target.textContent;
  updateResultScreen();
  console.log(currentOperand);
}

function setFirstValue() {
  if(!currentOperand) firstValue = 0;
  else firstValue = parseFloat(currentOperand);
  currentOperand = "";
}

function setSecondValue() {
  secondValue = parseFloat(currentOperand);
  currentOperand = "";
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
  let quotient = operand[0] / operand[1];
  let result, float, index, newString;
  if (operand[1] == 0) {
    alert("The world doesn't revolve around you! You can't divide anything by zero!");
    return;
  }
  if(!(Number.isInteger(quotient))){
    result = quotient.toString().split(".");
    if(result[1].length > 2){
      float = parseFloat(result[1]);
      newString = float.toPrecision(2).toString().split("");
      index = newString.indexOf(".");
      if(index>0) newString.splice(index, 1).splice(2);
      newString.splice(2);
      result[1] = newString.join("");
    }
    return parseFloat(result.join("."));
  }
  return quotient;
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
