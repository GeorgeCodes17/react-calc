import React, { useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const buttonsToRender = ['Clear', '-', 'Back', '1', '2', '3', '\u00F7', '4', '5', '6', 'x', '7', '8', '9', '+', '0', '.', '='];
const buttonsValues = ['c', '-', 'b', '1', '2', '3', '/', '4', '5', '6', '*', '7', '8', '9', '+', '0', '.' , '='];
const operators = ['-', '\u00F7', 'x', '+'];
const doubleWidthButton = ['=', 'b'];


const Buttons = props => (
    <div>
    {
      [...Array(buttonsToRender.length)].map((e, index) =>
        <button
          className="button"
          key={buttonsValues[index]}
          style={ doubleWidthButton.includes(buttonsValues[index]) ? { width:'50%' } : {}}
          onClick={()=>props.handleInput(buttonsToRender[index])}
        >
          {buttonsToRender[index]}
        </button>
      )
    }
    </div>
)

const Display = props => (
  <div className='display-container'>
    <div className="display">
      {props.displayText}
    </div>
    <p className="shortcuts-message"><i>You can use a physical keyboard. E.g. "c" or "Delete" = 'Clear'</i></p>
  </div>
)


function Calculator() {
  function handleTypedInput(event){
    var keyPressed = event.key
    switch(keyPressed) {
      case 'Enter':
        keyPressed = '=';
        break;
      case 'c': case 'Delete':
        keyPressed = 'Clear';
        break;
      case 'Backspace':
        keyPressed = 'Back';
        break;
      case '*': case 'X':
        keyPressed = 'x';
        break;
      case '/':
        keyPressed = '÷';
        break;
    }
    if(buttonsToRender.includes(keyPressed)) {
      handleInput(keyPressed);
    }
  }

  useEffect(() => {
    document.title = 'Reactful Calculator';
    document.addEventListener("keydown", handleTypedInput);
    return () => document.removeEventListener("keydown", handleTypedInput);
  });
  const [calcDisplay, setCalcDisplay] = useState('0');

  function resetCalculator() {
    setCalcDisplay('0');
  }
  
  function decrementCalcInput() {
    if(calcDisplay === '0' || calcDisplay.length === 1) {
      return setCalcDisplay('0');
    }
    return setCalcDisplay(calcDisplay.slice(0, -1));
  }

  function calculateAnswer() {
    try {
      return eval(getCalcValsFromInput(calcDisplay)).toString();
    } catch (e) {
      return 'e';
    }
  }

  function addToCalcDisplay(inputToDisplay) {
    calcDisplay !== '0' ? setCalcDisplay(calcDisplay + inputToDisplay) : setCalcDisplay(inputToDisplay);
  }

  function getCalcValsFromInput(input) {
    var calcVals = '';
    input.split('').forEach(displayElem => {
      var indexOfElem = buttonsToRender.indexOf(displayElem);
      calcVals += buttonsValues[indexOfElem];
    });
    return calcVals;
  }

  function handleInput(inputToDisplay) {
    switch(inputToDisplay) {
      case 'x': case '÷': case '+': case '-':
        var lastDisplayChar = calcDisplay.slice(-1);
        if(!operators.includes(lastDisplayChar) && calcDisplay !== '0' || calcDisplay === '0' && inputToDisplay === '-') {
          return addToCalcDisplay(inputToDisplay);
        }
        return;
      case '.':
        var lastNum = calcDisplay.split(/[x÷+-]+/).pop();
        if(lastNum.split('.').length-1 === 1){
          return;
        }
        return addToCalcDisplay(inputToDisplay);
      case 'Back':
        return decrementCalcInput();
      case 'Clear':
        return resetCalculator();
      case '=':
        var answer = calculateAnswer();
        if(answer === 'e') {
          return resetCalculator();
        }
        return setCalcDisplay(answer);
      default:
        return addToCalcDisplay(inputToDisplay);
    }
  }

  return (
    <div>
      <h1 className="title">Karlculator</h1>
      
      <div className="container">
        <Display displayText={calcDisplay}/>
        
        <Buttons numOfButtons={buttonsToRender} handleInput={handleInput} />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Calculator />
  </React.StrictMode>
);
