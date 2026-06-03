# Paper Matching Minigame — Game Plan

## Overview

A small learning/relaxation minigame where the player matches "papers" on a table by type. Papers show one of four variants: English, Kanji, Kana, or Image. Players stack matching papers together or drag singletons to a trashcan. When all papers are resolved, the round ends and a new round begins.

## Primary Features

- Selectable content subtypes (colours, objects, animals, etc.).
- Configurable table/grid size (controls how many papers appear).
- Two modes: timed rounds (score mode) and chill mode (no timer).
- Drag-and-drop stacking on desktop; tap-to-select/stack on mobile.
- Paper variants per tile: `english`, `kanji`, `kana`, `image`.
- Trashcan area to discard unmatched papers.
- Automatic new round when the table is cleared in non-chill mode.

## Settings & Controls

- Subtype selector: choose which sets may appear (e.g., `colours`, `animals`).
- Grid size: small/medium/large or numeric (affects board dimensions).
- Round time: configurable seconds; ignored in Chill mode.
- Chill mode toggle: disables timer, optional hints and animations.
- Start button: begins the round using current settings.
- Actual card count per round is determined by a random density between `70%` and `100%` applied to the board size.

## Data Model (conceptual)

Pool {
- [index => [word information]]
}

Card {
- id: unique id
- poolIndex: integer (index into the round's `pool`, e.g. 0 = red, 1 = blue)
- variant: one of `english|kanji|kana|image` (enum)
- text: string (text to display for text variants or the image path)
}

Table {
- width: integer (grid columns)
- height: integer (grid rows)
- grid: array of arrays `grid[x][y][cards]` where cards can have 0 or more cards
}

Game State (updated) {
- settings: {subtypes[], gridSize, gridWidth, gridHeight, roundTime, chillMode}
- pool: Pool[]
- cards: Card[]
- table: Table
- timer: remaining seconds
- score: integer
- lives: integer (start at 5)
- roundActive: boolean
}

## UX / Flow

1. Player picks subtypes, grid size and mode, then presses Start.
2. Game builds the `pool` for the round: `pool: [0 = [red...], 1 = [blue...], ...]` where each `Pool` is indexed.
3. The game spawns `Card` objects onto the table grid (`table.grid`) based on `gridWidth` x `gridHeight` and a randomly chosen board density.
4. Interaction model (click/tap):
	 - First click/tap on a grid cell selects the `Card` at that spot (if any).
	 - Second click/tap must target another grid cell that contains a `Card` (moving to empty cells is not allowed).
	 - On the second click, check `poolIndex` of source and target:
		 - If `poolIndex` matches, the cards stack: move the card on the table grid to the target position, remove the source card from the table, and display cards on the target location as a stack.
		 - If `poolIndex` does not match, deduct one life (from `lives`, starting at 5) and snap the source card back to its original cell with a short rejection animation.
	 - Stack behavior:
		 - Once cards are stacked, they are treated as one stack entity for future matching.
		 - You can drag or tap the entire stack to another compatible stack or card.
		 - When a stack is moved, the first-clicked/tapped card remains on top visually, and the destination stack appears as layered cards beneath it.
5. Trash behavior:
	 - Dragging/tapping the trashcan resolves a `Card` immediately.
	 - If a card has an available pair on the board, trashing it is incorrect and loses a life.
	 - In chill mode, trashing has no penalty only if no valid pair exists; otherwise the same life rule applies.
	 - Trashing does not restore deducted lives.
6. Round end:
	 - When all table cells are empty or `lives` reaches 0, show round summary.
	 - In non-chill mode, a new round auto-starts once all cards are resolved.
	 - In chill mode, wait for the player's confirmation or restart manually based on settings.

## Matching Rules & Edge Cases

- Match requirement: exact same `pool index`.
- Multiple identical papers: stacks can be larger than two if multiple same-type papers are present. Allow stacking multiple into one pile.
- Stacks count as one card for remaining matching logic.
- Can have up to all 4 of the matching cards on the field.
- Not all table spots have to be filled at round start.
- Grid density is randomly decided before each round. For a `gridWidth x gridHeight` board, roll a percentage between `70%` and `100%`, multiply it by the total board spaces, and round up to determine the number of cards spawned that round.
- No identical exact cards are allowed on the board. Multiple variants of the same word may appear (e.g. `Red + image`), but never duplicate exact cards.

## Visuals & Interaction

- Table/grid layout: free-floating cards arranged in a grid or scattered layout with slight offsets.
- Paper card shows one of the four text / image options.
- Trashcan fixed at a corner/bottom right of the screen with clear affordance for drop or tap.
- Stacking animation: dragged card smoothly moves and attaches to target, then both fade/merge from table.
- Stack merging should show the moved stack as a top card over the existing stack, with lower cards visible as layers beneath.

## Accessibility & Mobile

- Click and drag for mouse.
- Large touch targets for mobile.
- Tap has precedence; click/tap-to-select-then-confirm is supported, and dragging should also work.

## Scoring (optional)

- Basic: +points for successful stack, -points for trashing when a matching pair existed.
- Time bonus for finishing rounds faster (in timed mode).
- Leaderboard or local high-score persistence.
- Scoring is deferred for later.

## Assets & Localization

- JSON files per subtype (existing `colours.json`) with array entries: [English, Kanji, Kana, imagePath].
- Load assets dynamically based on selected subtypes.
- Support fallback: if an image is missing, use a visible error image placeholder so the missing asset is obvious and fixable.
