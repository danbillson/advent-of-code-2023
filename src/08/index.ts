const path = "src/08/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n") as Line[];

type Line = string | "" | `${string} = (${string}, ${string})`;

function lineToMap(line: Line) {
  const [key, value] = line.split(" = ");
  const [left, right] = value.split(", ");

  return { [key]: { L: left.slice(1), R: right.slice(0, -1) } };
}

function part1() {
  const [instructions, , ...maps] = lines;

  const map = maps.reduce((acc, cur) => {
    return { ...acc, ...lineToMap(cur) };
  }, {});

  let count = 0;
  let current = "AAA";
  while (current !== "ZZZ") {
    const instruction = instructions[count % instructions.length];
    current = map[current as keyof typeof map][instruction];
    count++;
  }

  return count;
}

// Greatest common divisor
// https://brilliant.org/wiki/greatest-common-divisor/
function gcd(a: number, b: number): number {
  if (b === 0) return a;
  return gcd(b, a % b);
}

function part2() {
  const [instructions, , ...maps] = lines;

  const map = maps.reduce((acc, cur) => {
    return { ...acc, ...lineToMap(cur) };
  }, {});

  const starts = Object.keys(map).filter((key) => key.endsWith("A"));

  const shortestRoutes = starts.map((start) => {
    let count = 0;
    let current = start;
    while (!current.endsWith("Z")) {
      const instruction = instructions[count % instructions.length];
      current = map[current as keyof typeof map][instruction];
      count++;
    }

    return count;
  });

  // Lowest common multiple
  // https://brilliant.org/wiki/lowest-common-multiple/?quiz=lowest-common-multiple#_=_
  const lcm = shortestRoutes.reduce((acc, cur) => {
    return (acc * cur) / gcd(acc, cur);
  });

  return lcm;
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
