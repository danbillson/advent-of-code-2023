const path = "src/10/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n");

function findStart(grid: string[][]): [number, number] {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] === "S") {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

// Each pipe should have exactly 2 adjacent pipes
function getAdjacentPipes(grid: string[][], [x, y]: [number, number]) {
  const currentPipe = grid[x][y];
  let adjacentPipes: [number, number][] = [];
  // Certain pipes can only connect to certain other pipes i.e. down pipes to up pipes and left pipes to right pipes
  if (
    ["S", "J", "|", "L"].includes(currentPipe) &&
    ["7", "|", "F"].includes(grid[x - 1][y])
  )
    adjacentPipes.push([x - 1, y]);
  if (
    ["S", "7", "|", "F"].includes(currentPipe) &&
    ["J", "|", "L"].includes(grid[x + 1][y])
  )
    adjacentPipes.push([x + 1, y]);
  if (
    ["S", "J", "-", "7"].includes(currentPipe) &&
    ["L", "-", "F"].includes(grid[x][y - 1])
  )
    adjacentPipes.push([x, y - 1]);
  if (
    ["S", "L", "-", "F"].includes(currentPipe) &&
    ["J", "-", "7"].includes(grid[x][y + 1])
  )
    adjacentPipes.push([x, y + 1]);
  return adjacentPipes;
}

function nextCoord(
  grid: string[][],
  visited: string[],
  [x, y]: [number, number]
) {
  const nextPipes = getAdjacentPipes(grid, [x, y]);

  return nextPipes.find((pipe) => !visited.includes(pipe.join(","))) as [
    number,
    number
  ];
}

function part1() {
  const grid = lines.map((line) => line.split(""));
  const start = findStart(grid);

  let count = 0;
  let visited = [start.join(",")];
  let [posOne, posTwo] = getAdjacentPipes(grid, start);

  while (posOne !== posTwo) {
    visited.push(posOne.join(","));
    visited.push(posTwo.join(","));
    posOne = nextCoord(grid, visited, posOne);
    posTwo = nextCoord(grid, visited, posTwo);
    count++;
  }

  return count;
}

function inside(grid: string[][], shape: string[], [x, y]: [number, number]) {
  if (shape.includes(`${x},${y}`)) return false;
  if (x === 0 || y === 0 || x === grid.length - 1 || y === grid[0].length - 1)
    return false;

  let intersections = 0;
  let row = grid[x];
  for (let i = y; i < row.length; i++) {
    // Check if we're going along the edge of the shape
    if (row[i] === "F" && "7-".includes(row[i + 1])) continue;
    if (row[i] === "L" && "|J".includes(row[i + 1])) continue;
    if ("SF|L".includes(row[i]) && shape.includes(`${x},${i}`)) {
      intersections++;
    }
  }
  if (intersections % 2 === 1) console.log(x, y, intersections);

  return intersections % 2 === 1;
}

function part2() {
  const grid = lines.map((line) => line.split(""));
  const start = findStart(grid);

  let pipes = [start.join(",")];
  let [posOne, posTwo] = getAdjacentPipes(grid, start);

  while (posOne !== posTwo) {
    pipes.push(posOne.join(","));
    pipes.push(posTwo.join(","));
    posOne = nextCoord(grid, pipes, posOne);
    posTwo = nextCoord(grid, pipes, posTwo);
  }

  let insideCount = 0;
  for (let row = 0; row < lines.length; row++) {
    console.log(row);
    for (let col = 0; col < lines[row].length; col++) {
      if (inside(grid, pipes, [row, col])) {
        insideCount++;
      }
    }
  }

  return insideCount;
}

// console.log("Part 1:", part1());
console.log("Part 2:", part2());

// Tried: 69, 70, 72, 73, 1387, 1636, 1641, 1642, 8331
