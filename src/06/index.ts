const path = "src/06/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n") as Line[];

type Line =
  | `Time: ${string} ${string} ${string}`
  | `Distance: ${string} ${string} ${string}`;

function formatLine(line: Line) {
  const [, data] = line
    .split(":")
    .map((x) => x.trim().split(" ").filter(Boolean).map(Number));
  return data;
}

function part1() {
  const [timeData, distanceData] = lines;
  const times = formatLine(timeData);
  const distances = formatLine(distanceData);

  return times.reduce((acc, time, i) => {
    const record = distances[i];
    let wins = 0;

    for (let j = 0; j <= time; j++) {
      const held = j;
      const dist = (time - held) * held;

      if (dist > record) {
        wins++;
      }
    }

    return acc * wins;
  }, 1);
}

function getRealValue(line: Line) {
  const [, data] = line
    .split(":")
    .map((x) => x.trim().split(" ").filter(Boolean).join(""));

  return Number(data);
}

function part2() {
  const [timeData, distanceData] = lines;
  const time = getRealValue(timeData);
  const record = getRealValue(distanceData);

  let wins = 0;

  for (let j = 0; j <= time; j++) {
    const held = j;
    const dist = (time - held) * held;

    if (dist > record) {
      wins++;
    }
  }

  return wins;
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
