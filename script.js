const options = ["colours"]
var GRID_SIZE = 4;
var pool = [];
var deck = [];
var table = [];

async function loadOptionData(option) {
  const data = await fetch(`${option}.json`).then((res) => res.json());
  return Array.isArray(data) ? data : Object.values(data).flat();
}

async function createEntryPool(selectedOptions) {
  const pool = [];
  const loaders = selectedOptions.filter((option) => options.includes(option));
  const results = await Promise.all(loaders.map((option) => loadOptionData(option)));
  results.forEach((entries) => pool.push(...entries));
  return pool;
}

function generateDeck(pool, gridSize) {
    const variation = Math.floor(Math.random() * (100-60+1) + 60) / 100;
    var cardCount = gridSize * gridSize;
    cardCount = Math.floor(cardCount * variation);
    if (!pool.length || cardCount <= 0) {
        return [];
    }

    const deck = [];
    let remainingSlots = cardCount;

    var totalOptions = [];

    for(const [index, card] of pool.entries()) {
        cardOptions = [];
        for (const [variantIndex, variant] of card.entries()) {
            cardOptions.push({poolIndex: index, variant: variantIndex, paired: false});
        }
        totalOptions.push(cardOptions);
    }

    while (remainingSlots > 0) {
        const index = Math.floor(Math.random() * totalOptions.length)
        const cardsForDeck = totalOptions[index];

        const count = Math.min(remainingSlots, weightedRandom());

        for (let i = 0; i < count; i++) {
            const cardIndex = Math.floor(Math.random() * cardsForDeck.length);
            deck.push(cardsForDeck[cardIndex]);
            cardsForDeck.splice(cardIndex, 1);
        }

        totalOptions.splice(index, 1);

        remainingSlots -= count;
    }
    return deck;
}

function weightedRandom() {
  const r = Math.random();

  if (r < 0.10) return 1;
  if (r < 0.60) return 2;
  return 3;
}

function generateTable(deck, gridSize) {
    const board = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => [])
    );

    const positions = [];

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            positions.push({ x, y });
        }
    }

    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    for (let i = 0; i < deck.length; i++) {
        const { x, y } = positions[i];
        board[y][x].push(deck[i]);
    }
    return board;
}

async function test() {
    console.log(await createEntryPool(["colours"]));
    pool = await createEntryPool(["colours"]);
    console.log(pool);
    deck = generateDeck(pool, GRID_SIZE);
    console.log(deck);
    table = generateTable(deck, GRID_SIZE);
    console.log(table);
    drawBoard(table);
}

function redrawBoard(table)
{
    while(board.lastElementChild) { board.removeChild(board.lastElementChild);}
    drawBoard(table);
}

function drawBoard(table) {
    const board = document.getElementById("board");

    for (let y = 0; y < table.length; y++) {
        for (let x = 0; x < table[0].length; x++) {
            const cardObject = table[y][x].at(-1);
            if (cardObject) {
                const card = document.createElement("div");
                card.classList.add("card");
                const cardContent = document.createElement("div");
                cardContent.textContent = pool[cardObject.poolIndex][cardObject.variant];
                card.appendChild(cardContent);
                if (table[y][x].length > 1) {
                    cardContent.classList.add("paperStack");
                }
                else {
                    cardContent.classList.add("paper");
                }
                card.style.width = `${100 / GRID_SIZE}%`;
                card.style.height = `${100 / GRID_SIZE}%`;
                card.style.left = `${y * (100 / GRID_SIZE)}%`;
                card.style.top = `${x * (100 / GRID_SIZE)}%`;    
                board.appendChild(card);  
                setupCardMovement(card);
            }
        }
    }
}

function makeMove(card, start, end) {
    if (start.row == end.row && start.col == end.col) {
        moveCard(card, start.col, start.row);
    } else if (end.col < 0 || end.col > (GRID_SIZE - 1) || end.row < 0 || end.row > (GRID_SIZE - 1))
    {
        if (checkForSoloCard(start)) {
            table[start.col][start.row][0].paired = true;
            table[start.col][start.row] = [];
        } else {
            moveCard(card, start.col, start.row);
        }
    } else {
        const startCard = table[start.col][start.row][0];
        const endCard = table[end.col][end.row][0];
        const sameVariant = (startCard && endCard && startCard.poolIndex == endCard.poolIndex);

        if (sameVariant) {
            moveCard(card, end.col, end.row);
            table[end.col][end.row].push(...table[start.col][start.row]);
            table[end.col][end.row].forEach(obj => {obj.paired = true});
            table[start.col][start.row] = [];
        }
    }
    checkWinLose();
    redrawBoard(table);
}

function checkWinLose() {
    console.log(deck);
    if (deck.every(obj => obj.paired)) {
        deck = [];
        table = [];
        deck = generateDeck(pool, GRID_SIZE);
        table = generateTable(deck, GRID_SIZE);
    }
}

function checkForSoloCard(start) {
    const card = table[start.col][start.row][0];
    return deck.every(obj => !(obj.poolIndex == card.poolIndex && obj.variant != card.variant));
}

function setupCardMovement(card) {
  card.addEventListener("pointerdown", e => {
      e.preventDefault();
    dragging = true;

    const rect = card.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    card.setPointerCapture(e.pointerId);

    const board = document.querySelector(".board");
    const boardRect = board.getBoundingClientRect();

    const cellSize = boardRect.width / GRID_SIZE;

    const leftStyle = card.style.left;
    const topStyle = card.style.top;

    const left = leftStyle.endsWith("%")
      ? (parseFloat(leftStyle) / 100) * boardRect.width
      : parseFloat(leftStyle);
    const top = topStyle.endsWith("%")
      ? (parseFloat(topStyle) / 100) * boardRect.height
      : parseFloat(topStyle);

    startCol = Math.round(left / cellSize);
    startRow = Math.round(top / cellSize);
  });

  card.addEventListener("pointermove", e => {
      e.preventDefault();
    if (!dragging) return;

    const boardRect = document
      .querySelector(".board")
      .getBoundingClientRect();

    card.style.left =
      `${e.clientX - boardRect.left - offsetX}px`;

    card.style.top =
      `${e.clientY - boardRect.top - offsetY}px`;
  });

  card.addEventListener("pointerup", e => {
      e.preventDefault();
    dragging = false;
    const position = snapCard(card);
    makeMove(card, {row: startRow, col: startCol}, position);
  });
}

let dragging = false;
let offsetX = 0;
let offsetY = 0;
let startCol = 0;
let startRow = 0;

function moveCard(card, col, row) {
    const board = document.querySelector(".board");
    const rect = board.getBoundingClientRect();

    const cellSize = rect.width / GRID_SIZE;
    card.style.left = `${col * cellSize}px`;
    card.style.top = `${row * cellSize}px`;
}

function snapCard(card) {
  const board = document.querySelector(".board");
  const rect = board.getBoundingClientRect();

  const cellSize = rect.width / GRID_SIZE;

  const leftStyle = card.style.left;
  const topStyle = card.style.top;

  const left = leftStyle.endsWith("%")
    ? (parseFloat(leftStyle) / 100) * rect.width
    : parseFloat(leftStyle);
  const top = topStyle.endsWith("%")
    ? (parseFloat(topStyle) / 100) * rect.height
    : parseFloat(topStyle);

  var col = Math.round(left / cellSize);
  var row = Math.round(top / cellSize);

  return { row, col };
}

test();