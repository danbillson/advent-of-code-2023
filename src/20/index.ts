const path = "src/20/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n") as Line[];

type Line = `broadcaster -> ${string}` | `${"%" | "&"}${string} -> ${string}`;

type Modules = Record<string, Module>;
type Module =
  | {
      type: "%";
      memory: "on" | "off";
      destinations: (keyof Modules)[];
    }
  | {
      type: "&";
      memory: Record<keyof Modules, string>;
      destinations: (keyof Modules)[];
    };

function createModules(lines: Line[]): Modules {
  return lines.reduce((acc, cur) => {
    const [key, destination] = cur.split(" -> ");
    const destinations = destination.trim().split(", ");
    if (cur.startsWith("broadcaster"))
      return { ...acc, broadcaster: { destinations } };

    const type = key.slice(0, 1) as "%" | "&";
    return {
      ...acc,
      [key.slice(1)]: {
        type,
        memory: type === "%" ? "off" : {},
        destinations,
      },
    };
  }, {});
}

function addConnections(modules: Modules) {
  let modulesCopy = { ...modules };

  for (const [key, module] of Object.entries(modulesCopy)) {
    for (const destination of module.destinations) {
      if (
        Object.keys(modulesCopy).includes(destination) &&
        modulesCopy[destination].type === "&"
      ) {
        // @ts-ignore-next-line
        modulesCopy[destination].memory[key] = "low";
      }
    }
  }
  return modulesCopy;
}

function part1() {
  const initialModules = createModules(lines);
  console.log(initialModules);
  const modules = addConnections(initialModules);

  const moduleStart = modules.broadcaster.destinations.map((target) => [
    "broadcast",
    target,
    "low",
  ]);

  let high = 0,
    low = 0;

  for (let i = 0; i < 1000; i++) {
    low += 1;
    const queue = [...moduleStart];

    while (queue.length) {
      const [source, target, pulse] = queue.shift()!;

      if (pulse === "low") low += 1;
      else high += 1;

      if (!(target in modules)) continue;

      const module = modules[target];
      if (module.type === "%") {
        if (pulse === "low") {
          module.memory = module.memory === "off" ? "on" : "off";
          const outPulse = module.memory === "on" ? "high" : "low";
          for (const destination of module.destinations) {
            queue.push([target, destination, outPulse]);
          }
        }
      } else {
        module.memory[source] = pulse;
        const outPulse = Object.values(module.memory).every(
          (val) => val === "high"
        )
          ? "low"
          : "high";
        for (const destination of module.destinations) {
          queue.push([target, destination, outPulse]);
        }
      }
    }
  }

  return low * high;
}

console.log(part1());
// console.log(part2());
