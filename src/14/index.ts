const path = "src/14/data.txt";
const file = Bun.file(path);

const data = await file.text();
const grid = data.split("\n").map((line) => line.split(""));

function tiltNorth(grid: string[][]) {
  for (let col = 0; col < grid[0].length; col++) {
    for (let row = 0; row < grid.length; row++) {
      if (grid[row][col] === "O") {
        for (let i = row; i >= 0; i--) {
          if (grid[i - 1]?.[col] === "#") break;
          if (grid[i - 1]?.[col] === ".") {
            grid[i - 1][col] = "O";
            grid[i][col] = ".";
          }
        }
      }
    }
  }

  return grid;
}

function tiltWest(grid: string[][]) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "O") {
        for (let i = col; i >= 0; i--) {
          if (grid[row][i - 1] === "#") break;
          if (grid[row][i - 1] === ".") {
            grid[row][i - 1] = "O";
            grid[row][i] = ".";
          }
        }
      }
    }
  }

  return grid;
}

function tiltSouth(grid: string[][]) {
  for (let col = 0; col < grid[0].length; col++) {
    for (let row = grid.length - 1; row >= 0; row--) {
      if (grid[row][col] === "O") {
        for (let i = row; i < grid.length; i++) {
          if (grid[i + 1]?.[col] === "#") break;
          if (grid[i + 1]?.[col] === ".") {
            grid[i + 1][col] = "O";
            grid[i][col] = ".";
          }
        }
      }
    }
  }

  return grid;
}

function tiltEast(grid: string[][]) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = grid[0].length - 1; col >= 0; col--) {
      if (grid[row][col] === "O") {
        for (let i = col; i < grid[0].length; i++) {
          if (grid[row][i + 1] === "#") break;
          if (grid[row][i + 1] === ".") {
            grid[row][i + 1] = "O";
            grid[row][i] = ".";
          }
        }
      }
    }
  }

  return grid;
}

function cycle(grid: string[][]) {
  const north = tiltNorth(grid);
  const west = tiltWest(north);
  const south = tiltSouth(west);
  const east = tiltEast(south);

  return east;
}

function getScore(grid: string[][]) {
  let score = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "O") {
        score += grid.length - row;
      }
    }
  }

  return score;
}

function part1() {
  const tilted = tiltNorth(grid);
  return getScore(tilted);
}

function part2() {
  let gridCopy = [...grid];
  const stored = new Map<string, number>();
  const loads: Record<number, number> = {};

  let i = 0;
  while (!stored.has(JSON.stringify(gridCopy))) {
    stored.set(JSON.stringify(gridCopy), i);
    loads[i] = getScore(gridCopy);
    gridCopy = cycle(gridCopy);
    i++;
  }

  const target = 1000000000;
  const cycleStart = stored.get(JSON.stringify(gridCopy))!;
  const cycleLength = i - cycleStart;
  const cycleOffset = target - cycleStart;
  const cycleIndex = cycleOffset % cycleLength;

  return loads[cycleIndex + cycleStart];
}

console.log(part1());
console.log(part2());
