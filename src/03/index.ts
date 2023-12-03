const path = "src/03/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n");

console.log("Part 1:", part1());
console.log("Part 2:", part2());

function containsAdjacent(
  row: number,
  col: number,
  length: number,
  cond: (char: string) => boolean
) {
  const startCol = col <= 1 ? 0 : col - 1;
  const endCol = col + length >= lines[row].length ? col : col + length + 1;
  const top = row === 0 ? [] : lines[row - 1].slice(startCol, endCol).split("");
  const middle = [lines[row][col - 1], lines[row][col + length]];
  const bottom =
    row === lines.length - 1
      ? []
      : lines[row + 1].slice(startCol, endCol).split("");

  const adjacent = [...top, ...middle, ...bottom];
  return adjacent.some(cond);
}

function containsAdjacentSymbol(row: number, col: number, length: number) {
  return containsAdjacent(
    row,
    col,
    length,
    (char) => Boolean(char) && char !== "." && isNaN(parseInt(char))
  );
}

function containsAdjacentNumber(row: number, col: number) {
  return containsAdjacent(row, col, 1, (char) => !isNaN(parseInt(char)));
}

function getSurrounding(row: number, col: number) {
  return [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ];
}

function resolveNumber(row: number, col: number) {
  if (isNaN(parseInt(lines[row][col]))) {
    return null;
  }

  let back = "";
  let forward = "";

  for (let i = col - 1; i >= 0; i--) {
    if (!isNaN(parseInt(lines[row][i]))) {
      back = lines[row][i] + back;
    } else {
      break;
    }
  }

  for (let i = col; i < lines[row].length; i++) {
    if (!isNaN(parseInt(lines[row][i]))) {
      forward += lines[row][i];
    } else {
      break;
    }
  }

  return parseInt(back + forward);
}

function resolveNumbers(row: number, col: number) {
  const surrounding = getSurrounding(row, col);
  const numbers = surrounding.map(([row, col]) => resolveNumber(row, col));
  return [...new Set(numbers)].filter(Boolean) as number[];
}

function part1() {
  return lines.reduce((acc, cur, i) => {
    let partNo = "";
    let partSum = 0;

    for (let j = 0; j < cur.length; j++) {
      if (!isNaN(parseInt(cur[j])) && cur[j] !== ".") {
        partNo += cur[j];

        if (
          j === cur.length - 1 &&
          containsAdjacentSymbol(i, j - partNo.length + 1, partNo.length)
        ) {
          partSum += parseInt(partNo);
        }

        continue;
      }

      if (partNo) {
        if (containsAdjacentSymbol(i, j - partNo.length, partNo.length)) {
          partSum += parseInt(partNo);
        }
        partNo = "";
      }
    }

    return acc + partSum;
  }, 0);
}

function part2() {
  return lines.reduce((acc, cur, i) => {
    let gears = 0;
    for (let j = 0; j < cur.length; j++) {
      if (cur[j] === "*" && containsAdjacentNumber(i, j)) {
        const numbers = resolveNumbers(i, j);
        if (numbers.length === 2) {
          gears += numbers[0] * numbers[1];
        }
      }
    }
    return acc + gears;
  }, 0);
}
