const path = "src/05/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n") as Line[];

type Line =
  | `seeds: ${string}`
  | `${string} map:`
  | `${string} ${string} ${string}`
  | ``;

type Map = [number, number, number];

// Destination range start, source range start, range length

function createMaps(data: Line[]) {
  let mapList = [] as Map[][];
  for (let i = 0; i < data.length; i++) {
    if (!data[i]) continue;

    if (data[i].includes("map")) {
      mapList.push([]);
      continue;
    }

    const [destination, source, length] = data[i].split(" ").map(Number);
    mapList[mapList.length - 1].push([destination, source, length]);
  }
  return mapList;
}

function getLocation(seed: number) {
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
}

const maps = createMaps(lines.slice(1));

function part1() {
  const [seedsData] = lines;
  const [, seeds] = seedsData
    .split(":")
    .map((x) => x.trim().split(" ").map(Number));

  const locations = seeds.map(getLocation);

  return Math.min(...locations);
}

function getMinLocation(seed: number, length: number, step = 1000) {
  let minLocation = Infinity;
  for (let j = seed; j < seed + length; j += step) {
    const location = getLocation(j);
    if (location < minLocation) {
      minLocation = location;
    }
  }
  return minLocation;
}

function part2() {
  const [seedsData] = lines;
  const [, seedsPairs] = seedsData
    .split(":")
    .map((x) => x.trim().split(" ").map(Number));

  let seeds = [] as [number, number][];
  for (let i = 0; i < seedsPairs.length; i += 2) {
    seeds.push([seedsPairs[i], seedsPairs[i + 1]]);
  }

  let minLocation = Infinity;
  let minPair = seeds[0];
  for (let pair of seeds) {
    const [seed, length] = pair;
    const location = getMinLocation(seed, length);
    if (location < minLocation) {
      minLocation = location;
      minPair = pair;
    }
  }

  return getMinLocation(minPair[0], minPair[1], 1);
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
