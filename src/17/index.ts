const path = "src/17/data.txt";
const file = Bun.file(path);

const data = await file.text();
const city = data.split("\n").map((line) => line.split("").map(Number));

// hl: heat loss, r: row, c: column, dr: delta row, dc: delta column, n: number of moves
type Node = {
  hl: number;
  r: number;
  c: number;
  dr: number;
  dc: number;
  n: number;
};

class PriorityQueue {
  private nodes: { node: Node; priority: number }[] = [];

  enqueue(node: Node, priority: number) {
    this.nodes.push({ node, priority });
    this.nodes.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.nodes.shift()?.node;
  }

  isEmpty() {
    return !this.nodes.length;
  }
}

function shortestPath(grid: number[][]) {
  const city = [...grid];
  const pq = new PriorityQueue();
  const seen = new Set<string>();

  pq.enqueue({ hl: 0, r: 0, c: 0, dr: 0, dc: 0, n: 0 }, 0);

  while (!pq.isEmpty()) {
    const { hl, r, c, dr, dc, n } = pq.dequeue() as Node;
    console.log(hl, r, c, dr, dc, n);

    if (r === city.length - 1 && c === city[0].length - 1) return hl;

    const key = `${r}:${c}:${dr}:${dc}:${n}`;

    if (seen.has(key)) continue;
    seen.add(key);

    if (n < 3 && `${dr}:${dc}` !== `0:0`) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < city.length && nc < city[0].length) {
        pq.enqueue(
          { hl: hl + city[nr][nc], r: nr, c: nc, dr, dc, n: n + 1 },
          hl + city[nr][nc]
        );
      }
    }

    for (let [ndr, ndc] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      if (
        `${ndr}:${ndc}` !== `${dr}:${dc}` &&
        `${ndr}:${ndc}` !== `${-dr}:${-dc}`
      ) {
        const nr = r + ndr;
        const nc = c + ndc;
        if (nr >= 0 && nc >= 0 && nr < city.length && nc < city[0].length) {
          pq.enqueue(
            { hl: hl + city[nr][nc], r: nr, c: nc, dr: ndr, dc: ndc, n: 1 },
            hl + city[nr][nc]
          );
        }
      }
    }
  }

  return -1;
}

function part1() {
  return shortestPath(city);
}

console.log(part1());
// console.log(part2());
