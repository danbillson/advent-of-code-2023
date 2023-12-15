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

function createInstructions(list: string[]) {
  return list.map((chars) => {
    // [lens label, operation character, lens focal length]
    const [label, op, fl] = chars.split(/([-=])/);
    return {
      key: label,
      box: hash(label),
      label: `${label} ${fl}`,
      op,
    };
  });
}

type Instruction = ReturnType<typeof createInstructions>[number];

function moveBoxes(instructions: Instruction[]) {
  return instructions.reduce((acc, cur) => {
    if (cur.op === "=") {
      const current = acc[cur.box] || [];
      const newBox = current.some((l) => l.startsWith(cur.key))
        ? current.map((l) => (l.startsWith(cur.key) ? cur.label : l))
        : [...current, cur.label];
      return { ...acc, [cur.box]: newBox };
    } else {
      const current = acc[cur.box] || [];
      const newBox = current.filter((l) => !l.startsWith(cur.key));
      return { ...acc, [cur.box]: newBox };
    }
  }, {} as Record<string, string[]>);
}

function lensPower(box: number, slot: number, focalLength: number) {
  return box * slot * focalLength;
}

function focusingPower(boxes: Record<string, string[]>) {
  return Object.entries(boxes).reduce((acc, cur) => {
    const [box, labels] = cur;

    const power = labels.reduce((acc, cur, i) => {
      const [, fl] = cur.split(" ");
      return acc + lensPower(Number(box) + 1, i + 1, Number(fl));
    }, 0);

    return acc + power;
  }, 0);
}

function part2() {
  const instructions = createInstructions(sequence);
  const boxes = moveBoxes(instructions);
  return focusingPower(boxes);
}

console.log(part1());
console.log(part2());
