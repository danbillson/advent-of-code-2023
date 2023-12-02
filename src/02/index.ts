const path = "./src/02/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n");

const limits = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

console.log("Part 1:", part1());
console.log("Part 2:", part2());

function formatCubes(cubes: string): Record<keyof typeof limits, string>[] {
  return cubes.split(";").map((round) => {
    const cubePair = round
      .trim()
      .split(",")
      .map((cube) => cube.trim().split(" ").reverse());
    return Object.fromEntries(cubePair);
  });
}

function part1() {
  return lines.reduce((acc, cur) => {
    const [game, cubes] = cur.split(":");
    const rounds = formatCubes(cubes);

    for (let round of rounds) {
      const colors = Object.keys(round) as (keyof typeof limits)[];
      for (let color of colors) {
        const count = parseInt(round[color]);
        if (count > limits[color]) {
          return acc;
        }
      }
    }

    const [, gameNo] = game.split(" ");
    return acc + parseInt(gameNo);
  }, 0);
}

function part2() {
  return lines.reduce((acc, cur) => {
    const [, cubes] = cur.split(":");
    const rounds = formatCubes(cubes);

    const counts = rounds.reduce(
      (acc, cur) => {
        return {
          red: Math.max(acc.red, parseInt(cur.red ?? "1")),
          green: Math.max(acc.green, parseInt(cur.green ?? "1")),
          blue: Math.max(acc.blue, parseInt(cur.blue ?? "1")),
        };
      },
      {
        red: 1,
        green: 1,
        blue: 1,
      }
    );

    const power = Object.values(counts).reduce((acc, cur) => acc * cur, 1);

    return acc + power;
  }, 0);
}
