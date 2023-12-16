function columns(matrix: string[][], i: number) {
  return matrix.map((row) => row[i]);
}

export function logMatrix(matrix: string[][]) {
  let shape = [matrix.length, matrix[0].length];
  let colMaxes: number[] = [];

  for (let i = 0; i < shape[1]; i++) {
    colMaxes.push(
      Math.max.apply(
        null,
        columns(matrix, i).map((n) => n.toString().length)
      )
    );
  }

  matrix.forEach((row) => {
    console.log.apply(
      null,
      row.map((val, j) => {
        return (
          new Array(colMaxes[j] - val.toString().length + 1).join(" ") +
          val.toString() +
          "  "
        );
      })
    );
  });
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
