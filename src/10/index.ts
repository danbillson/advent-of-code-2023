const path = "src/10/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n");

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

  let start: [number, number] = [0, 0];
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] === "S") {
        start = [i, j];
      }
    }
  }

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

console.log("Part 1:", part1());
// console.log("Part 2:", part2());
