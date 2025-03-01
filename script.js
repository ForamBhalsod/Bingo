const boardElement = document.getElementById('bingo-board');
const bingoLetters = document.querySelectorAll('.letter');
const ws = new WebSocket("ws://192.168.2.11:8080"); // Replace with your PC’s local IP

let board = [];
let markedNumbers = [];

// Generate 5×5 Bingo board
function generateBoard() {
    let numbers = [];
    while (numbers.length < 25) {
        let num = Math.floor(Math.random() * 25) + 1;
        if (!numbers.includes(num)) numbers.push(num);
    }
    board = numbers;

    boardElement.innerHTML = '';
    numbers.forEach((num, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = num;
        cell.dataset.number = num;
        cell.onclick = () => markNumber(num);
        boardElement.appendChild(cell);
    });
}

// Mark a number and sync across devices
function markNumber(number) {
    if (!markedNumbers.includes(number)) {
        markedNumbers.push(number);
        let cell = document.querySelector(`[data-number='${number}']`);
        cell.classList.add('marked');

        ws.send(JSON.stringify({ type: "mark", number }));
    }
}

// Highlight "BINGO" letters (Only Local)
bingoLetters.forEach(letter => {
    letter.addEventListener('click', () => {
        letter.classList.toggle('active');
    });
});

// WebSocket messages (Sync Numbers Across Devices)
ws.onmessage = event => {
    const data = JSON.parse(event.data);
    if (data.type === "mark") {
        let cell = document.querySelector(`[data-number='${data.number}']`);
        if (cell) cell.classList.add('marked');
    }
};

// Start the game
generateBoard();
