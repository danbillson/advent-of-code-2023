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

  let maps = [] as [number, number, number][][];
  for (let i = 0; i < rest.length; i++) {
    if (!rest[i]) continue;

    if (rest[i].includes("map")) {
      maps.push([]);
      continue;
    }

    const [destination, source, length] = rest[i].split(" ").map(Number);
    maps[maps.length - 1].push([destination, source, length]);
  }

  const locations = seeds.map((seed) => {
    return maps.reduce((location, map) => {
      let newLocation = location;
      for (let i = 0; i < map.length; i++) {
        const [destination, source, length] = map[i];
        if (newLocation >= source && newLocation < source + length) {
          newLocation = destination + (newLocation - source);
          break;
        }
      }
      return newLocation;
    }, seed);
  });

  return Math.min(...locations);
}
