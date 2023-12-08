const path = "src/08/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n") as Line[];

type Line = string | "" | `${string} = (${string}, ${string})`;

const start = "AAA";
const end = "ZZZ";

function lineToMap(line: Line) {
  const [key, value] = line.split(" = ");
  const [left, right] = value.split(", ");

  return { [key]: { left: left.slice(1), right: right.slice(0, -1) } };
}

function part1() {
  const [instructions, , ...maps] = lines;

  const map = maps.reduce((acc, cur) => {
    return { ...acc, ...lineToMap(cur) };
  }, {});

  let count = 0;
  let current = start;
  while (current !== end) {
    const instruction = instructions[count % instructions.length];
    const { left, right } = map[current as keyof typeof map];
    if (instruction === "R") current = right;
    if (instruction === "L") current = left;
    count++;
  }

  return count;
}

console.log("Part 1:", part1());
