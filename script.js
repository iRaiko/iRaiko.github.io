const settingsKey = "iraiko-game-settings";
const options = ["colours", "food"];

function createSubtypeOptions() {
  const list = document.getElementById("options");
  list.innerHTML = "";

  options.forEach((option) => {
    const wrapper = document.createElement("label");
    wrapper.className = "option-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "subtypes";
    checkbox.value = option;
    checkbox.id = `subtype-${option}`;

    const labelText = document.createElement("span");
    labelText.textContent = option;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(labelText);
    list.appendChild(wrapper);
  });
}

function getCurrentSettings() {
  const roundTime = Number(document.getElementById("roundTime").value) || 60;
  const chillMode = document.getElementById("chillMode").checked;
  const gridSize = Number(document.getElementById("gridSize").value) || 8;
  const selectedSubtypes = Array.from(document.querySelectorAll("input[name='subtypes']:checked")).map(
    (input) => input.value
  );

  return {
    roundTime,
    chillMode,
    gridSize,
    subtypes: selectedSubtypes.length ? selectedSubtypes : [...options],
  };
}

let timerInterval = null;
let remainingSeconds = 0;
let currentPool = [];

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

function chooseVariantCount(maxSlots) {
  if (maxSlots === 1) {
    return 1;
  }

  const baseWeights = [0.1, 0.4, 0.4, 0.1].slice(0, maxSlots);
  const total = baseWeights.reduce((sum, weight) => sum + weight, 0);
  const normalized = baseWeights.map((weight) => weight / total);
  const roll = Math.random();
  let running = 0;

  for (let i = 0; i < normalized.length; i += 1) {
    running += normalized[i];
    if (roll <= running) {
      return i + 1;
    }
  }

  return maxSlots;
}

function generateTable(pool, gridSize) {
  const variation = Math.floor(Math.random() * (100-60+1) + 60) / 100;
  var cardCount = gridSize * gridSize;
  cardCount = Math.floor(cardCount * variation);
  if (!pool.length || cardCount <= 0) {
    return [];
  }

  const deck = [];
  let remainingSlots = cardCount;

  while (remainingSlots > 0) {
    // ensure we pick a pool index that isn't already in the deck when possible
    const usedIndices = new Set(deck.map((e) => e.poolIndex));
    let poolIndex;
    if (usedIndices.size >= pool.length) {
      // all pool entries are already used; fall back to allowing duplicates
      poolIndex = Math.floor(Math.random() * pool.length);
    } else {
      do {
        poolIndex = Math.floor(Math.random() * pool.length);
      } while (usedIndices.has(poolIndex));
    }
    const card = pool[poolIndex];
    const maxVariants = Math.min(4, remainingSlots);
    const variantCount = chooseVariantCount(maxVariants);

    // derive textual variants from the card entry (exclude likely filenames)
    let variants = [];
    if (Array.isArray(card)) {
      variants = card.filter((v) => typeof v === "string" && !/\.[a-zA-Z0-9]{2,5}$/.test(v));
      variants = variants.map(String);
    } else {
      variants = [String(card)];
    }
    if (!variants.length && Array.isArray(card)) {
      variants = card.map(String);
    }

    // shuffle variants so multiple placed copies get different text first
    for (let i = variants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [variants[i], variants[j]] = [variants[j], variants[i]];
    }

    deck.push({ card, variantCount, poolIndex, variants });

    remainingSlots -= variantCount;
  }

  // Build list of all possible cell indices and shuffle them
  const totalCells = gridSize * gridSize;
  const indices = Array.from({ length: totalCells }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Assign positions for each variant of each deck card
  const table = [];
  let pointer = 0;

  deck.forEach((entry, entryIndex) => {
    for (let v = 0; v < entry.variantCount; v += 1) {
      if (pointer >= indices.length) break;
      const idx = indices[pointer++];
      const row = Math.floor(idx / gridSize);
      const col = idx % gridSize;
      const variantText = (entry.variants && entry.variants.length)
        ? entry.variants[v % entry.variants.length]
        : (Array.isArray(entry.card) ? String(entry.card[0]) : String(entry.card));

      table.push({
        id: entry.poolIndex,
        card: entry.card,
        row,
        col,
        variant: variantText,
      });
    }
  });

  return table;
}

function saveSettings(settings) {
  localStorage.setItem(settingsKey, JSON.stringify(settings));
}

function loadSettings() {
  const raw = localStorage.getItem(settingsKey);
  let saved = null;

  if (raw) {
    try {
      saved = JSON.parse(raw);
    } catch (error) {
      console.warn("Failed to parse saved settings", error);
    }
  }

  const defaults = {
    roundTime: 60,
    chillMode: false,
    gridSize: 5,
    subtypes: [...options],
  };

  const current = saved ? { ...defaults, ...saved } : defaults;

  document.getElementById("roundTime").value = current.roundTime;
  document.getElementById("chillMode").checked = current.chillMode;
  document.getElementById("gridSize").value = current.gridSize;

  document.querySelectorAll("input[name='subtypes']").forEach((input) => {
    input.checked = current.subtypes.includes(input.value);
  });
}

async function enterFullscreen() {
  const target = document.documentElement;
  if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
    return;
  }

  const request = target.requestFullscreen || target.webkitRequestFullscreen || target.msRequestFullscreen;
  if (request) {
    try {
      await request.call(target);
    } catch (error) {
      console.warn("Fullscreen request failed", error);
    }
  }
}

async function exitFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
    return;
  }

  const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
  if (exit) {
    try {
      await exit.call(document);
    } catch (error) {
      console.warn("Exit fullscreen failed", error);
    }
  }
}

function handleFormUpdate() {
  const settings = getCurrentSettings();
  saveSettings(settings);
}

function updateGamePanel(settings, poolCount = 0, tableCards = []) {
  const scoreValue = document.getElementById("scoreValue");
  const timerValue = document.getElementById("timerValue");

  scoreValue.textContent = "0";
  timerValue.textContent = settings.chillMode ? "Chill" : `${settings.roundTime}s`;

  const gameTable = document.getElementById("gameTable");
  if (!tableCards.length) {
    gameTable.innerHTML = `
      <p class="game-table__placeholder">
        Starting a ${settings.gridSize}×${settings.gridSize} game with ${poolCount} pool entries.
      </p>
    `;
    return;
  }

  // Render grid and place cards
  gameTable.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "game-grid";
  grid.style.gridTemplateColumns = `repeat(${settings.gridSize}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${settings.gridSize}, 1fr)`;
  grid.style.minHeight = "320px";

  tableCards.forEach((placed) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    const content = placed.variant ?? (Array.isArray(placed.card) ? placed.card[0] : String(placed.card));
    cardEl.textContent = content;
    cardEl.style.gridColumnStart = placed.col + 1;
    cardEl.style.gridRowStart = placed.row + 1;
    grid.appendChild(cardEl);
  });

  // Add a small header summary above the grid
  const summary = document.createElement("p");
  summary.className = "game-table__placeholder";
  summary.textContent = `Generated ${tableCards.length} cards from ${poolCount} pool entries.`;

  gameTable.appendChild(summary);
  gameTable.appendChild(grid);
}

function startTimer(settings) {
  const timerValue = document.getElementById("timerValue");

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  if (settings.chillMode) {
    timerValue.textContent = "Chill";
    return;
  }

  remainingSeconds = settings.roundTime;
  timerValue.textContent = `${remainingSeconds}s`;

  timerInterval = setInterval(() => {
    remainingSeconds -= 1;
    if (remainingSeconds < 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerValue.textContent = "Done";
      return;
    }
    timerValue.textContent = `${remainingSeconds}s`;
  }, 1000);
}

async function showGameScreen(settings) {
  currentPool = await createEntryPool(settings.subtypes);
  const tableCards = generateTable(currentPool, settings.gridSize);
  console.log(tableCards);
  document.querySelector(".settings-card").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  updateGamePanel(settings, currentPool.length, tableCards);
  startTimer(settings);
}

function hideGameScreen() {
  document.querySelector(".settings-card").classList.remove("hidden");
  document.getElementById("gameScreen").classList.add("hidden");
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function initSettingsPage() {
  createSubtypeOptions();
  loadSettings();

  document.getElementById("settingsForm").addEventListener("input", handleFormUpdate);
  document.getElementById("start").addEventListener("click", async () => {
    const settings = getCurrentSettings();
    saveSettings(settings);
    await enterFullscreen();
    await showGameScreen(settings);
  });

  document.getElementById("quitRun").addEventListener("click", async () => {
    hideGameScreen();
    await exitFullscreen();
  });
}

document.addEventListener("DOMContentLoaded", initSettingsPage);