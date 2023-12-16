const path = "src/16/data.txt";
const file = Bun.file(path);

const data = await file.text();
const mirrors = data.split("\n").map((line) => line.split(""));

type Beam = {
  pos: [number, number];
  dir: "up" | "down" | "left" | "right";
};

const move = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
} as const;

function travel(
  mirrors: string[][],
  pos: [number, number] = [0, -1],
  dir: "up" | "down" | "left" | "right" = "right"
) {
  const seen = new Set();
  const energized = new Set();
  let beams = [{ pos, dir }];

  while (beams.length > 0) {
    const disabled: Beam[] = [];

    for (const beam of beams) {
      const { pos, dir } = beam;
      const [y, x] = pos;
      const [dy, dx] = move[dir];

      const key = [y, x, dir].join(":");
      if (seen.has(key)) {
        disabled.push(beam);
        continue;
      } else {
        seen.add(key);
      }

      energized.add([y, x].join(":"));
      const [ny, nx] = [y + dy, x + dx];

      if (ny < 0 || ny >= mirrors.length || nx < 0 || nx >= mirrors[0].length) {
        disabled.push(beam);
        continue;
      }

      const nextTile = mirrors[ny][nx];
      let nextDir = dir;

      if (nextTile == "|" && (dir == "right" || dir == "left")) {
        beams.push({ pos: [ny, nx], dir: "up" });
        nextDir = "down";
      }

      if (nextTile == "-" && (dir == "up" || dir == "down")) {
        beams.push({ pos: [ny, nx], dir: "right" });
        nextDir = "left";
      }

      if (nextTile == "/") {
        if (dir == "up") nextDir = "right";
        if (dir == "down") nextDir = "left";
        if (dir == "right") nextDir = "up";
        if (dir == "left") nextDir = "down";
      }

      if (nextTile == "\\") {
        if (dir == "up") nextDir = "left";
        if (dir == "down") nextDir = "right";
        if (dir == "right") nextDir = "down";
        if (dir == "left") nextDir = "up";
      }

      beam.pos = [ny, nx];
      beam.dir = nextDir;
    }

    beams = beams.filter((b) => !disabled.includes(b));
  }

  return energized.size - 1;
}

function part1() {
  return travel(mirrors);
}

function part2() {
  let max = 0;

  for (let i = 0; i < mirrors.length; i++) {
    for (let j = 0; j < mirrors[0].length; j++) {
      if (i === 0) {
        const energized = travel(mirrors, [i - 1, j], "down");
        if (energized > max) {
          max = energized;
        }
      }
      if (i === mirrors.length - 1) {
        const energized = travel(mirrors, [i + 1, j], "up");
        if (energized > max) {
          max = energized;
        }
      }
      if (j === 0) {
        const energized = travel(mirrors, [i, j - 1], "right");
        if (energized > max) {
          max = energized;
        }
      }
      if (j === mirrors[0].length - 1) {
        const energized = travel(mirrors, [i, j + 1], "left");
        if (energized > max) {
          max = energized;
        }
      }
    }
  }

  return max;
}

console.log(part1());
console.log(part2());
