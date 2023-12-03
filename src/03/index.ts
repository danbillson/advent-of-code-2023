const path = "src/03/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n");

console.log("Part 1:", part1());
// console.log("Part 2:", part2());

function hasAdjacentSymbol(row: number, col: number, length: number) {
  const startCol = col <= 1 ? 0 : col - 1;
  const endCol = col + length >= lines[row].length ? col : col + length + 1;
  const top = row === 0 ? [] : lines[row - 1].slice(startCol, endCol).split("");
  const middle = [lines[row][col - 1], lines[row][col + length]];
  const bottom =
    row === lines.length - 1
      ? []
      : lines[row + 1].slice(startCol, endCol).split("");

  const adjacent = [...top, ...middle, ...bottom];
  return adjacent.some((char) => char && char !== "." && isNaN(parseInt(char)));
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
          hasAdjacentSymbol(i, j - partNo.length + 1, partNo.length)
        ) {
          partSum += parseInt(partNo);
        }

        continue;
      }

      if (partNo) {
        if (hasAdjacentSymbol(i, j - partNo.length, partNo.length)) {
          partSum += parseInt(partNo);
        }
        partNo = "";
      }
    }

    return acc + partSum;
  }, 0);
}
