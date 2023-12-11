const path = "src/11/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n");
const spaceGrid = lines.map((line) => line.split(""));

function findEmptySpace(grid: string[][]) {
  let emptyRows = [];
  let emptyCols = [];
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].every((cell) => cell === ".")) {
      emptyRows.push(i);
    }
    const col = grid.map((row) => row[i]);
    if (col.every((cell) => cell === ".")) {
      emptyCols.push(i);
    }
  }

  return [emptyRows, emptyCols];
}

function galaxyLocations(grid: string[][]) {
  let locations: [number, number][] = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "#") {
        locations.push([i, j]);
      }
    }
  }
  return locations;
}

function countWithin(values: number[], start: number, end: number) {
  return values.reduce((acc, cur) => {
    if ((cur >= start && cur <= end) || (cur <= start && cur >= end)) {
      return acc + 1;
    }
    return acc;
  }, 0);
}

function shortestPath(
  start: [number, number],
  end: [number, number],
  jumpsX: number[],
  jumpsY: number[],
  factor = 2
) {
  const [startX, startY] = start;
  const [endX, endY] = end;

  const xJumpCount = countWithin(jumpsX, startX, endX);
  const yJumpCount = countWithin(jumpsY, startY, endY);

  const xDiff = Math.abs(startX - endX) + xJumpCount * (factor - 1);
  const yDiff = Math.abs(startY - endY) + yJumpCount * (factor - 1);

  return xDiff + yDiff;
}

function part1() {
  const [emptyRows, emptyCols] = findEmptySpace(spaceGrid);
  const locations = galaxyLocations(spaceGrid);

  return locations.reduce((acc, cur, i) => {
    let locationSum = 0;
    for (let j = i; j < locations.length; j++) {
      locationSum += shortestPath(cur, locations[j], emptyRows, emptyCols);
    }
    return acc + locationSum;
  }, 0);
}

function part2() {
  const [emptyRows, emptyCols] = findEmptySpace(spaceGrid);
  const locations = galaxyLocations(spaceGrid);

  return locations.reduce((acc, cur, i) => {
    let locationSum = 0;
    for (let j = i; j < locations.length; j++) {
      locationSum += shortestPath(
        cur,
        locations[j],
        emptyRows,
        emptyCols,
        100000
      );
    }
    return acc + locationSum;
  }, 0);
}

console.log(part1());
console.log(part2());
