const path = "src/10/data.txt";
const file = Bun.file(path);

const data = await file.text();
const grid = data.split("\n").map((line) => line.split(""));

function findStart(lines: string[][]): [number, number] {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] === "S") {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

function part1() {
  const [sr, sc] = findStart(grid);
  const seen = new Set<string>([`${sr}:${sc}`]);
  const queue = [[sr, sc]];

  while (queue.length) {
    const [r, c] = queue.shift()!;
    const pipe = grid[r][c];

    // Up
    if (r > 0 && "S|JL".includes(pipe) && "|7F".includes(grid[r - 1][c])) {
      const key = `${r - 1}:${c}`;
      if (!seen.has(key)) {
        seen.add(key);
        queue.push([r - 1, c]);
      }
    }

    // Down
    if (
      r < grid.length - 1 &&
      "S|7F".includes(pipe) &&
      "|JL".includes(grid[r + 1][c])
    ) {
      const key = `${r + 1}:${c}`;
      if (!seen.has(key)) {
        seen.add(key);
        queue.push([r + 1, c]);
      }
    }

    // Left
    if (c > 0 && "S-J7".includes(pipe) && "-LF".includes(grid[r][c - 1])) {
      const key = `${r}:${c - 1}`;
      if (!seen.has(key)) {
        seen.add(key);
        queue.push([r, c - 1]);
      }
    }

    // Right
    if (
      c < grid[r].length - 1 &&
      "S-LF".includes(pipe) &&
      "-J7".includes(grid[r][c + 1])
    ) {
      const key = `${r}:${c + 1}`;
      if (!seen.has(key)) {
        seen.add(key);
        queue.push([r, c + 1]);
      }
    }
  }

  return seen.size / 2;
}

console.log(part1());
