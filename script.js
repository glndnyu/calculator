const operand = document.querySelectorAll(".operand");
const operator = document.querySelectorAll(".operator");
const equal = document.querySelector(".equal-operator");
const inputScreen = document.querySelector(".input-screen");
const resultScreen = document.querySelector(".result-screen");
const clearScreen = document.querySelector(".clear");
const delChar = document.querySelector(".delete");
let firstValue = null;
let secondValue = null;
let currentOperand = "0";
let operatorValue = null;
let currentOperator = null;
let result;
let setEqual = false;
let fromOperateEqualForOperand = false;
let fromOperateEqualForOperator = false;
let firstValueHolder;
let divideByZero = false;
let secondValueNull = true;
let isEqualOn = false;
const operatorLibrary = {
  divide: "÷",
  multiply: "x",
  add: "+",
  subtract: "-",
  equals: "="
};
const operatorTerm = {
  "*": "multiply",
  "-": "subtract",
  "/": "divide",
  "+": "add",
  "Enter": "equals",
  "=": "equals"
};
operand.forEach(button => button.addEventListener("click", updateOperand));
operator.forEach(button => button.addEventListener("click", updateOperator));
window.addEventListener("keydown", checkKey);
clearScreen.addEventListener("click", clear);
delChar.addEventListener("click", deleteCharacter);

function checkKey(event){
  switch(true){
    case !(isNaN(parseInt(event.key))):
    case event.key == '.':
      updateOperand(event);
      break;
    case event.key == '-':
    case event.key == '+':
    case event.key == '*':
    case event.key == '/':
      updateOperator(event);
      break;
    case event.key == '=':
    case event.key == 'Enter':
      break;
    case event.key == 'Backspace':
      deleteCharacter();
      break;
    case event.key == 'Escape':
      clear();
      break;
  }
}

function updateResultScreen() {
  if(typeof currentOperand == 'string'){
    let firstChar = currentOperand.split("");
    if(firstChar[0] == "0") firstChar.splice(0,1);
    currentOperand = firstChar.join("");
  }
  resultScreen.textContent = currentOperand;
}

function updateInputScreen() {
  if(divideByZero){
    inputScreen.textContent = `${firstValue} ${operatorLibrary[operatorValue]} ${secondValue} = ERROR!`;
    divideByZero = false;
    return;  
  }
  if(!setEqual)  {
    inputScreen.textContent = firstValue + ' ' + operatorLibrary[operatorValue];
    return;
  }
  inputScreen.textContent = `${firstValue} ${operatorLibrary[operatorValue]} ${secondValue} =`;
  firstValue = result;
  setEqual = false;
}

function getOperatorTerm(event) {
  const key = Object.keys(operatorTerm);
  const values = Object.values(operatorTerm);
  
  let index = key.indexOf(event.key);
  
  return values[index];
}

function updateOperator(event) {
  let operatorPressed = (event.type === 'keydown') ? getOperatorTerm(event) : event.target.dataset.operator;
  
  if(fromOperateEqualForOperator) {
    operatorValue = operatorPressed;
    fromOperateEqualForOperator = false;
  }
  
  if(!firstValue && firstValue !=0) setFirstValue();
  
  if(typeof firstValue === 'number' && operatorValue && !secondValueNull){
    setSecondValue();
    result = operate(operatorValue, firstValue, secondValue);
    isEqualOn = false;
    
    if(!result && result != 0) { 
      clearValues();
      return;
    }

    currentOperand = result;
    currentOperator = operatorPressed;
    firstValueHolder = firstValue;
    firstValue = result;

    if(currentOperator === 'equals') {
      setEqual = true;
      fromOperateEqualForOperand = true;
      fromOperateEqualForOperator = true;
      firstValue = firstValueHolder;
      currentOperator = operatorValue;
    }
    operatorValue = currentOperator;
    updateEqualListener();
    updateResultScreen();
    updateInputScreen();
    setOperandToBlank();
    return;
  } 
  operatorValue = operatorPressed;
  updateInputScreen();
  currentOperand = "0";
}

function updateEqualListener(){
  
  if(!isEqualOn) {
    console.log("Bye bitches!");
    equal.removeEventListener("click", updateOperator);
    return;
  }
  console.log("Hello bitches!");
  equal.addEventListener("click", updateOperator);
}

function setOperandToBlank(){
  currentOperand = "0";
  secondValue = null;
  secondValueNull = true;
}

function updateOperand(event) {
  let valuePressed = (event.type === 'keydown') ?  event.key : event.target.textContent;
  isEqualOn = true;
  if(fromOperateEqualForOperand && fromOperateEqualForOperator) {
    firstValue = null;
    fromOperateEqualForOperand = false;
  }

  if(typeof firstValue === 'number' && operatorValue) {
    console.log("Here");
    secondValueNull = false;
    updateEqualListener();
  }

  if(currentOperand.includes(".") && valuePressed == '.') return;

  currentOperand += valuePressed;
  updateResultScreen();
  
}

function setFirstValue() {
  if(!currentOperand) firstValue = 0;
  else firstValue = parseFloat(currentOperand);
  currentOperand = "0";
}

function setSecondValue() {
  secondValue = parseFloat(currentOperand);
  currentOperand = "0";
}

function add(operand) {
  let sum = operand[0] + operand[1];
  return checkDecimal(sum);
}

function subtract(operand) {
  let diff = operand[0] - operand[1];
  return checkDecimal(diff);
}

function multiply(operand) {
  let prod = operand[0] * operand[1];
  return checkDecimal(prod);
}

function divide(operand) {
  let quotient = operand[0] / operand[1];
  return checkZeroDivisor(operand[1]) ? checkDecimal(quotient) : null;
}

function checkDecimal(value){
  let result, float, index, newString;
  if(!(Number.isInteger(value))){
    result = value.toString().split(".");
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
  return value;
}

function checkZeroDivisor(divisor) {
  if (divisor == 0) {
    alert("The world doesn't revolve around you! You can't divide anything by zero!");
    divideByZero = true;
    updateInputScreen();
    return false;
  } return true;
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
  clearValues();
}

function clearValues(){
  currentOperand = "0";
  firstValue = null;
  secondValue = null;
  operatorValue = null;
  isEqualOn = false;
  updateEqualListener();
}

function deleteCharacter() {
  const newValue = currentOperand.split("");
  newValue.splice(newValue.length - 1, 1);
  currentOperand = newValue.join("");
  updateResultScreen();

  if(currentOperand == ""){
    isEqualOn = false;
    secondValueNull = true;
    updateEqualListener();
  }
}
