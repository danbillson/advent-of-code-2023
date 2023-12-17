import { logMatrix } from "../utils";

const path = "src/10/data.txt";
const file = Bun.file(path);

const data = await file.text();
// const lines = data.split("\n");
const lines = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`.split("\n");

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
    x > 0 &&
    ["S", "J", "|", "L"].includes(currentPipe) &&
    ["7", "|", "F"].includes(grid[x - 1][y])
  )
    adjacentPipes.push([x - 1, y]);
  if (
    x < grid.length - 1 &&
    ["S", "7", "|", "F"].includes(currentPipe) &&
    ["J", "|", "L"].includes(grid[x + 1][y])
  )
    adjacentPipes.push([x + 1, y]);
  if (
    y > 0 &&
    ["S", "J", "-", "7"].includes(currentPipe) &&
    ["L", "-", "F"].includes(grid[x][y - 1])
  )
    adjacentPipes.push([x, y - 1]);
  if (
    y < grid[x].length - 1 &&
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

function part2() {
  const grid = lines.map((line) => line.split(""));
  const start = findStart(grid);
  grid[start[0]][start[1]] = "F";

  let pipes = [start.join(",")];
  let [posOne, posTwo] = getAdjacentPipes(grid, start);

  while (posOne !== posTwo) {
    pipes.push(posOne.join(","));
    pipes.push(posTwo.join(","));
    posOne = nextCoord(grid, pipes, posOne);
    posTwo = nextCoord(grid, pipes, posTwo);
  }

  const pipeMap = grid.map((row, i) => {
    return row.map((pipe, j) => (pipes.includes(`${i},${j}`) ? pipe : "."));
  });

  logMatrix(pipeMap);

  const outside = new Set<string>();

  for (let row = 0; row < pipeMap.length; row++) {
    let within = false;
    let up = false;
    for (let col = 0; col < pipeMap[row].length; col++) {
      let pipe = pipeMap[row][col];
      if (pipe === "|") within = !within;
      if ("LF".includes(pipe)) up = pipe === "L";
      if ("7J".includes(pipe)) {
        if (pipe !== (up ? "J" : "7")) {
          within = !within;
        }
        up = false;
      }
      if (pipe === "." || pipe === "-") continue;
      if (!within) outside.add(`${row},${col}`);
    }
  }

  console.log(outside);

  return pipeMap.length * pipeMap[0].length - (outside.size + pipes.length);
}

// console.log("Part 1:", part1());
console.log("Part 2:", part2());

// Tried: 69, 70, 72, 73, 1387, 1636, 1641, 1642, 8331
