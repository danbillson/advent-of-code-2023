const path = "src/05/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n") as Line[];

console.log("Part 1:", part1());
// console.log("Part 2:", part2());

type Line =
  | `seeds: ${string}`
  | `${string} map:`
  | `${string} ${string} ${string}`
  | ``;

// Destination range start, source range start, range length

function part1() {
  const [seedsData, , ...rest] = lines;
  const [, seeds] = seedsData
    .split(":")
    .map((x) => x.trim().split(" ").map(Number));

  let maps = [] as Record<number, number>[];
  for (let i = 0; i < rest.length; i++) {
    if (!rest[i]) continue;

    if (rest[i].includes("map")) {
      maps.push({});
    }

    const [destination, source, length] = rest[i].split(" ").map(Number);
    for (let j = 0; j < length; j++) {
      maps[maps.length - 1][source + j] = destination + j;
    }
  }

  const locations = seeds.map((seed) => {
    return maps.reduce((acc, cur) => {
      if (cur[acc]) {
        return cur[acc];
      }

      return acc;
    }, seed);
  });

  return Math.min(...locations);
}
