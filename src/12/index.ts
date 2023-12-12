const path = "src/12/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n");

const sum = (arr: number[]) => arr.reduce((acc, cur) => acc + cur, 0);

function arrangements(springs: string, counts: number[]): number {
  if (springs.length === 0) {
    if (counts.length === 0) {
      return 1;
    }
    return 0;
  }

  if (counts.length === 0) {
    for (let i = 0; i < springs.length; i++) {
      if (springs[i] === "#") {
        return 0;
      }
    }
    return 1;
  }

  if (springs.length < sum(counts) + counts.length - 1) return 0;

  if (springs[0] === ".") return arrangements(springs.slice(1), counts);

  if (springs[0] === "#") {
    const [count, ...rest] = counts;
    for (let i = 0; i < count; i++) {
      if (springs[i] === ".") {
        return 0;
      }
    }
    if (springs[count] === "#") return 0;

    return arrangements(springs.slice(count + 1), rest);
  }

  return (
    arrangements("#" + springs.slice(1), counts) +
    arrangements("." + springs.slice(1), counts)
  );
}

function part1() {
  return lines.reduce((acc, cur) => {
    const [springs, countString] = cur.split(" ");
    const counts = countString.split(",").map(Number);

    return acc + arrangements(springs, counts);
  }, 0);
}

console.log(part1());
// console.log(part2());
