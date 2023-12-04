const path = "src/04/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n") as Line[];

console.log("Part 1:", part1());
console.log("Part 2:", part2());

type Line = `Card ${number}: ${string} | ${string}`;

function score(matches: number) {
  let score = 0;
  for (let i = 0; i < matches; i++) {
    if (i === 0) {
      score += 1;
      continue;
    }
    score *= 2;
  }
  return score;
}

function findMatches(lines: Line[]) {
  return lines.map((line) => {
    const [, numbers] = line.split(":");
    const [winning, yours] = numbers
      .split("|")
      .map((x) => x.trim().split(" ").filter(Boolean));

    return yours.filter((x) => winning.includes(x));
  });
}

function part1() {
  const matches = findMatches(lines);

  return matches.reduce((acc, cur) => acc + score(cur.length), 0);
}

function part2() {
  const matches = findMatches(lines);
  const matchesCount = matches.reduce(
    (acc, cur) => [...acc, cur.length],
    [] as number[]
  );

  const copies = Array.from({ length: matches.length }, () => 1);
  for (let i = 0; i < copies.length; i++) {
    for (let j = 1; j <= matchesCount[i]; j++) {
      for (let k = 0; k < copies[i]; k++) {
        copies[i + j] += 1;
      }
    }
  }

  return copies.reduce((acc, cur) => acc + cur, 0);
}
