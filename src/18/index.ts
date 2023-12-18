const path = "src/18/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n") as Line[];

type Direction = "R" | "L" | "U" | "D";

type Line = `${Direction} ${number} (#${string})`;

type Instruction = {
  direction: Direction;
  distance: number;
  colour: string;
};

function getInstructions(lines: Line[]): Instruction[] {
  return lines.map((line) => {
    const [direction, distance, colour] = line.split(" ");
    return {
      direction: direction as Direction,
      distance: parseInt(distance),
      colour: colour.slice(1, -1),
    };
  });
}

const move = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
} as const;

function part1() {
  const instructions = getInstructions(lines);
  const points = [[0, 0]];

  let boundaries = 0;

  for (let { direction, distance } of instructions) {
    const [dr, dc] = move[direction];
    const [r, c] = points[points.length - 1];
    points.push([r + dr * distance, c + dc * distance]);
    boundaries += distance;
  }

  // Use shoelace formula to calculate the area of the polygon
  // https://en.wikipedia.org/wiki/Shoelace_formula
  // The problem with shoelace is that it treats points in the polygon as
  // if they we're at the middle of a square, this is why we use Pick's later
  let area = 0;
  for (let i = 0; i < points.length - 1; i++) {
    // Values need to wrap around hence the modulo
    area +=
      points[i][0] *
      (points[(i - 1 + points.length) % points.length][1] -
        points[(i + 1) % points.length][1]);
  }
  area = Math.abs(area) / 2;

  // Use Pick's theorem to calculate the interior points
  // https://en.wikipedia.org/wiki/Pick%27s_theorem
  const interior = area - boundaries / 2 + 1;

  return interior + boundaries;
}

console.log(part1());
// console.log(part2());
