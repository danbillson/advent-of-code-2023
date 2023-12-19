const path = "src/19/data.txt";
const file = Bun.file(path);

const data = await file.text();
const [workflowData, ratingData] = data.split("\n\n");

type Workflow =
  | {
      value: "x" | "m" | "a" | "s";
      comparison: "<" | ">";
      target: number;
      destination: string;
    }
  | string;

function createWorkflows(data: string) {
  return data.split("\n").reduce((acc, cur) => {
    const [key, steps] = cur.split(/[{}]/);
    const workflows = steps.split(",").map((step) => {
      const [value, comparison, target, , destination] = step.split(/([<>:])/);
      if (!destination) return value;

      return {
        value,
        comparison,
        target: parseInt(target),
        destination,
      } as Workflow;
    });

    return { ...acc, [key]: workflows };
  }, {} as Record<string, Workflow[]>);
}

type Rating = Record<"x" | "m" | "a" | "s", number>;

function createRatings(data: string) {
  return data.split("\n").reduce((acc, cur) => {
    const values = cur
      .slice(1, -1)
      .split(",")
      .reduce((acc, cur) => {
        const [key, value] = cur.split("=");
        return { ...acc, [key]: parseInt(value) };
      }, {} as Rating);

    return [...acc, values];
  }, [] as Rating[]);
}

function totalRating(rating: Rating) {
  return Object.values(rating).reduce((acc, cur) => acc + cur, 0);
}

function part1() {
  const workflows = createWorkflows(workflowData);
  const ratings = createRatings(ratingData);

  let accepted = 0;

  for (const rating of ratings) {
    let cur = "in";

    while (cur !== "A" && cur !== "R") {
      for (const workflow of workflows[cur]) {
        if (typeof workflow === "string") {
          if (workflow === "A") accepted += totalRating(rating);
          cur = workflow;
          break;
        }

        const { value, comparison, target, destination } = workflow;

        if (comparison === "<" && rating[value] < target) {
          if (destination === "A") accepted += totalRating(rating);
          cur = destination;
          break;
        }

        if (comparison === ">" && rating[value] > target) {
          if (destination === "A") accepted += totalRating(rating);
          cur = destination;
          break;
        }
      }
    }
  }

  return accepted;
}

console.log(part1());
// console.log(part2());
