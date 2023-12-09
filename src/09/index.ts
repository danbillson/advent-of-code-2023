const path = "src/09/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n");
const sequences = lines.map((line) => line.split(" ").map(Number));

function diff(a: number, b: number): number {
  return b - a;
}

function buildDiffTree(sequence: number[]): number[][] {
  let currentSeq = sequence;
  let tree = [sequence] as number[][];
  let next = [] as number[];

  while (!currentSeq.every((num) => num === 0)) {
    for (let i = 0; i < currentSeq.length - 1; i++) {
      next.push(diff(currentSeq[i], currentSeq[i + 1]));
    }

    tree.push(next);
    currentSeq = next;
    next = [];
  }

  return tree;
}

function part1() {
  const diffTree = sequences.map(buildDiffTree);

  const nextInSequence = diffTree.map((tree) => {
    return tree.reduceRight((acc, cur) => {
      return acc + cur[cur.length - 1];
    }, 0);
  });

  return nextInSequence.reduce((acc, cur) => acc + cur, 0);
}

console.log("Part 1:", part1());
// console.log("Part 2:", part2());
