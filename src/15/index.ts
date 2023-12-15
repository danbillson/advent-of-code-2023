const path = "src/15/data.txt";
const file = Bun.file(path);

const data = await file.text();
const sequence = data.split(",");

function hash(chars: string) {
  return chars.split("").reduce((acc, cur) => {
    const ascii = cur.charCodeAt(0);

    return ((acc + ascii) * 17) % 256;
  }, 0);
}

function part1() {
  return sequence.reduce((acc, cur) => acc + hash(cur), 0);
}

console.log(part1());
// console.log(part2());
