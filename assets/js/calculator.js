let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;

const display = document.getElementById('display');
const history = document.getElementById('history');

// Update display
function updateDisplay() {
    display.textContent = currentInput;
    if (previousInput && operation) {
        history.textContent = `${previousInput} ${getOperatorSymbol(operation)}`;
    } else {
        history.textContent = '';
    }
}

// Get operator symbol for display
function getOperatorSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '%': '%'
    };
    return symbols[op] || op;
}

// Append number to display
function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }

    if (number === '.' && currentInput.includes('.')) {
        return;
    }

    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

// Append operator
function appendOperator(op) {
    if (operation !== null) {
        calculate();
    }

    operation = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
    updateDisplay();
}

// Calculate result
function calculate() {
    if (operation === null || shouldResetDisplay) {
        return;
    }

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) {
        return;
    }

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero!');
                clearAll();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }

    // Round to avoid floating point issues
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = result.toString();
    operation = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

// Clear all
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Delete last character
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    // Numbers and decimal
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
    }
    // Operators
    else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendOperator(e.key);
    }
    else if (e.key === '%') {
        appendOperator('%');
    }
    // Enter or equals
    else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    }
    // Escape to clear
    else if (e.key === 'Escape') {
        clearAll();
    }
    // Backspace to delete
    else if (e.key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    }
});

// Initialize
updateDisplay();
