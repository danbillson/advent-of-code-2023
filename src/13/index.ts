const path = "src/13/data.txt";
const file = Bun.file(path);

const data = await file.text();
const patterns = data.split("\n\n").map((pattern) => pattern.split("\n"));

function findReflection(pattern: string[]) {
  for (let i = 0; i < pattern.length - 1; i++) {
    let left = i;
    let right = i + 1;
    let valid = true;
    while (left >= 0 && right < pattern.length) {
      if (pattern[left] !== pattern[right]) {
        valid = false;
        break;
      }
      left--;
      right++;
    }
    if (valid) {
      return i + 1;
    }
  }

  return 0;
}

function split(pattern: string[]) {
  return pattern.map((row) => row.split(""));
}

function join(pattern: string[][]) {
  return pattern.map((row) => row.join(""));
}

function transpose(matrix: string[][]) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

function part1() {
  return patterns.reduce((acc, cur) => {
    const horizontalReflection = findReflection(cur);

    // I wish we had pipes
    const rotated = join(transpose(split(cur)));
    const verticalReflection = findReflection(rotated);

    return acc + horizontalReflection * 100 + verticalReflection;
  }, 0);
}

function getDiff(left: string, right: string) {
  let diff = 0;
  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) {
      diff++;
    }
  }
  return diff;
}

function findSmudgyReflection(pattern: string[]) {
  for (let i = 0; i < pattern.length - 1; i++) {
    let left = i;
    let right = i + 1;
    let totalDiff = 0;
    while (left >= 0 && right < pattern.length) {
      totalDiff += getDiff(pattern[left], pattern[right]);
      left--;
      right++;
    }
    if (totalDiff === 1) return i + 1;
  }

  return 0;
}

function part2() {
  return patterns.reduce((acc, cur) => {
    const horizontalReflection = findSmudgyReflection(cur);
    const rotated = join(transpose(split(cur)));
    const verticalReflection = findSmudgyReflection(rotated);

    return acc + horizontalReflection * 100 + verticalReflection;
  }, 0);
}

console.log(part1());
console.log(part2());
