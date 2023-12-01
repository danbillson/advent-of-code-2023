const path = "./src/01/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n");

const numbers = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
} as const;

console.log(part1());
console.log(part2());

function findFirst(arr: string[], cond: (str: string) => boolean) {
  for (let char of arr) {
    if (cond(char)) return char;
  }
}

function findFirstNum(arr: string[], reverse = false) {
  let word = "";
  const target = Object.keys(numbers);
  for (let char of arr) {
    if (!isNaN(parseInt(char))) return char;
    word += char;
    for (let num of target) {
      if (reverse) {
        if (word.includes(num.split("").reverse().join(""))) {
          return numbers[num as keyof typeof numbers];
        }
        continue;
      }

      if (word.includes(num)) {
        return numbers[num as keyof typeof numbers];
      }
    }
  }
}

function part1() {
  return lines.reduce((acc, cur) => {
    const chars = cur.split("");
    const first = findFirst(chars, (char) => !isNaN(parseInt(char)));
    const last = findFirst(chars.reverse(), (char) => !isNaN(parseInt(char)));
    const num = `${first}${last}`;
    return acc + Number(num);
  }, 0);
}

function part2() {
  return lines.reduce((acc, cur) => {
    const chars = cur.split("");
    const first = findFirstNum(chars);
    const last = findFirstNum(chars.reverse(), true);
    const num = `${first}${last}`;
    return acc + Number(num);
  }, 0);
}
