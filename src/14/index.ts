import { logMatrix } from "../utils";

const path = "src/14/data.txt";
const file = Bun.file(path);

const data = await file.text();
const grid = data.split("\n").map((line) => line.split(""));

function transpose(matrix: string[][]) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

function tilt(line: string[]) {
  const row = [...line];
  for (let i = 0; i < row.length; i++) {
    if (row[i] === "O") {
      for (let j = i; j >= 0; j--) {
        if (row[j - 1] === "#") break;
        if (row[j - 1] === ".") {
          row[j - 1] = "O";
          row[j] = ".";
        }
      }
    }
  }
  return row;
}

function part1() {
  const rotated = transpose(grid);

  return rotated.reduce((acc, cur) => {
    const tilted = tilt(cur);
    const score = tilted.reduce((acc, cur, i) => {
      if (cur === "O") {
        return acc + (tilted.length - i);
      }
      return acc;
    }, 0);
    return acc + score;
  }, 0);
}

console.log(part1());
// console.log(part2());
