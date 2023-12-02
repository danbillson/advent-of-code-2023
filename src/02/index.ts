const path = "./src/02/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n");

const limits = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

console.log(part1());

function part1() {
  return lines.reduce((acc, cur) => {
    const [game, cubes] = cur.split(":");
    const rounds = cubes.split(";").map((round) => {
      const cubePair = round
        .trim()
        .split(",")
        .map((cube) => cube.trim().split(" ").reverse());
      return Object.fromEntries(cubePair);
    }) as Record<keyof typeof limits, string>[];

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
