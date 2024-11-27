class Calculator {
    constructor(expressionElement, resultElement) {
        this.expressionElement = expressionElement;
        this.resultElement = resultElement;
        this.expression = '';
        this.result = '0';
        this.history = [];
    }

    appendToExpression(value) {
        this.expression += value;
        this.updateDisplay();
    }

    clearExpression() {
        this.expression = '';
        this.result = '0';
        this.updateDisplay();
    }

    deleteLastCharacter() {
        this.expression = this.expression.slice(0, -1);
        this.updateDisplay();
    }

    calculateResult() {
        try {
            const sanitizedExpression = this.expression.replace(/×/g, '*').replace(/÷/g, '/');
            this.result = eval(sanitizedExpression).toString();
            this.history.push(`${this.expression} = ${this.result}`);
            this.expression = '';
        } catch (error) {
            this.result = 'Error';
        }
        this.updateDisplay();
        this.updateHistory();
    }

    updateDisplay() {
        this.expressionElement.textContent = this.expression;
        this.resultElement.textContent = this.result;
    }

    updateHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        this.history.slice(-5).reverse().forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            historyList.appendChild(li);
        });
    }
}

const expressionElement = document.getElementById('expression');
const resultElement = document.getElementById('result');
const calculator = new Calculator(expressionElement, resultElement);

document.querySelector('.calculator-buttons').addEventListener('click', event => {
    if (!event.target.matches('button')) return;

    const action = event.target.dataset.action;
    const buttonContent = event.target.textContent;

    switch (action) {
        case 'clear':
            calculator.clearExpression();
            break;
        case 'delete':
            calculator.deleteLastCharacter();
            break;
        case '=':
            calculator.calculateResult();
            break;
        default:
            calculator.appendToExpression(buttonContent);
    }
});

// Theme switcher
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Set initial theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

// History panel toggle
const historyToggle = document.getElementById('history-toggle');
const historyPanel = document.getElementById('history-panel');
historyToggle.addEventListener('click', () => {
    historyPanel.style.display = historyPanel.style.display === 'none' ? 'block' : 'none';
});

// Keyboard support
document.addEventListener('keydown', event => {
    const key = event.key;
    const button = document.querySelector(`button[data-action="${key}"]`);
    if (button) button.click();

    if (key === 'Enter') document.querySelector('button[data-action="="]').click();
    if (key === 'Escape') document.querySelector('button[data-action="clear"]').click();
    if (key === 'Backspace') document.querySelector('button[data-action="delete"]').click();
});

