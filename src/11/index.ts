const path = "src/11/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n");
const spaceGrid = lines.map((line) => line.split(""));

function expandSpace(grid: string[][]) {
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

  let newGrid = [];
  for (let i = 0; i < grid.length; i++) {
    if (emptyRows.includes(i)) {
      newGrid.push(new Array(grid[0].length + emptyCols.length).fill("."));
    }
    newGrid.push([...grid[i]]);
  }

  for (let i = 0; i < newGrid.length; i++) {
    for (let j = 0; j < emptyCols.length; j++) {
      newGrid[i].splice(emptyCols[j] + j, 0, ".");
    }
  }

  return newGrid;
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

function shortestPath(start: [number, number], end: [number, number]) {
  const [startX, startY] = start;
  const [endX, endY] = end;

  const xDiff = Math.abs(startX - endX);
  const yDiff = Math.abs(startY - endY);

  return xDiff + yDiff;
}

function part1() {
  const expandedGrid = expandSpace(spaceGrid);
  const locations = galaxyLocations(expandedGrid);

  return locations.reduce((acc, cur, i) => {
    let locationSum = 0;
    for (let j = i; j < locations.length; j++) {
      locationSum += shortestPath(cur, locations[j]);
    }
    return acc + locationSum;
  }, 0);
}

console.log(part1());
