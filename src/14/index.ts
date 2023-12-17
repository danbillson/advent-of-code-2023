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
  const titled = tiltNorth(grid);
  return getScore(titled);
}

console.log(part1());
// console.log(part2());
