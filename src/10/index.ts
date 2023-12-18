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

function intersection(...arrays: any[][]) {
  return arrays.reduce((a, b) => a.filter((c) => b.includes(c)));
}

// Takes grid and starting row and column
function getPipeLocations(
  grid: string[][],
  [sr, sc]: [number, number]
): { pipes: Set<string>; s: string } {
  const seen = new Set<string>([`${sr}:${sc}`]);
  const queue = [[sr, sc]];
  const maybeS = [];

  while (queue.length) {
    const [r, c] = queue.shift()!;
    const pipe = grid[r][c];

    // Up
    if (r > 0 && "S|JL".includes(pipe) && "|7F".includes(grid[r - 1][c])) {
      const key = `${r - 1}:${c}`;
      if (!seen.has(key)) {
        seen.add(key);
        queue.push([r - 1, c]);
        if (pipe === "S") maybeS.push(["|", "J", "L"]);
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
        if (pipe === "S") maybeS.push(["|", "7", "F"]);
      }
    }

    // Left
    if (c > 0 && "S-J7".includes(pipe) && "-LF".includes(grid[r][c - 1])) {
      const key = `${r}:${c - 1}`;
      if (!seen.has(key)) {
        seen.add(key);
        queue.push([r, c - 1]);
        if (pipe === "S") maybeS.push(["-", "J", "7"]);
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
        if (pipe === "S") maybeS.push(["-", "L", "F"]);
      }
    }
  }

  const [s] = intersection(...maybeS);
  return { pipes: seen, s };
}

function part1() {
  const [sr, sc] = findStart(grid);
  const { pipes } = getPipeLocations(grid, [sr, sc]);

  return pipes.size / 2;
}

function part2() {
  const gridCopy = [...grid];
  const [sr, sc] = findStart(gridCopy);
  const { pipes, s } = getPipeLocations(gridCopy, [sr, sc]);
  gridCopy[sr][sc] = s;

  const simpleGrid = gridCopy.map((row, r) =>
    row.map((pipe, c) => (pipes.has(`${r}:${c}`) ? pipe : "."))
  );

  const outside = new Set<string>();

  for (let r = 0; r < simpleGrid.length; r++) {
    let within = false;
    let up = false;
    for (let c = 0; c < simpleGrid[r].length; c++) {
      const pipe = simpleGrid[r][c];
      if (pipe === "|") within = !within;
      if (pipe === "L" || pipe === "F") up = pipe === "L";
      if (pipe === "7" || pipe === "J") {
        const exitPipe = up ? "J" : "7";
        if (pipe !== exitPipe) {
          within = !within;
        }
        up = false;
      }
      if (!within) outside.add(`${r}:${c}`);
    }
  }

  const combined = new Set([...outside, ...pipes]);

  return grid.length * grid[0].length - combined.size;
}

console.log(part1());
console.log(part2());
