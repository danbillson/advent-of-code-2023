// The change to part 2 was just wild enough to create a new file
const path = "src/07/data.txt";
const file = Bun.file(path);

const data = await file.text();
const lines = data.split("\n") as Line[];

type Line = `${string} ${string}`;
type Card = keyof typeof cardValues;
type Cards = [Card, Card, Card, Card, Card];
type Hand = { cards: Cards; bid: number };

function getCardDistribution(cards: Cards) {
  const jokerCount = cards.filter((card) => card === "J").length;
  const cardsWithoutJoker = cards
    .filter((card) => card !== "J")
    .reduce(
      (acc, card) => ({
        ...acc,
        [card]: (acc[card] || 0) + 1,
      }),
      {} as Record<Card, number>
    );

  if (jokerCount === 5) return { J: 5 };

  const [bestCard] = Object.entries(cardsWithoutJoker).sort(
    (a, b) => b[1] - a[1]
  )[0] as [Card, number];

  return {
    ...cardsWithoutJoker,
    [bestCard]: cardsWithoutJoker[bestCard] + jokerCount,
  };
}

const cardValues = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  J: 1,
};

function highCard(a: Cards, b: Cards) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    return cardValues[a[i]] - cardValues[b[i]];
  }
  return 0;
}

function sortByCards({ cards: a }: Hand, { cards: b }: Hand) {
  const aDistribution = getCardDistribution(a);
  const bDistribution = getCardDistribution(b);

  const aValues = Object.values(aDistribution);
  const bValues = Object.values(bDistribution);

  // Five of a kind
  if (aValues.length === 1 && bValues.length === 1) {
    return highCard(a, b);
  }
  if (aValues.length === 1) return 1;
  if (bValues.length === 1) return -1;

  // Four of a kind
  if (aValues.includes(4) && bValues.includes(4)) {
    return highCard(a, b);
  }
  if (aValues.includes(4)) return 1;
  if (bValues.includes(4)) return -1;

  // Full house
  if (
    aValues.includes(3) &&
    aValues.includes(2) &&
    bValues.includes(3) &&
    bValues.includes(2)
  ) {
    return highCard(a, b);
  }
  if (aValues.includes(3) && aValues.includes(2)) return 1;
  if (bValues.includes(3) && bValues.includes(2)) return -1;

  // Three of a kind
  if (aValues.includes(3) && bValues.includes(3)) {
    return highCard(a, b);
  }
  if (aValues.includes(3)) return 1;
  if (bValues.includes(3)) return -1;

  // Two pairs
  if (
    aValues.filter((v) => v === 2).length === 2 &&
    bValues.filter((v) => v === 2).length === 2
  ) {
    return highCard(a, b);
  }
  if (aValues.filter((v) => v === 2).length === 2) return 1;
  if (bValues.filter((v) => v === 2).length === 2) return -1;

  // One pair
  if (aValues.includes(2) && bValues.includes(2)) {
    return highCard(a, b);
  }
  if (aValues.includes(2)) return 1;
  if (bValues.includes(2)) return -1;

  // High card
  return highCard(a, b);
}

function part1() {
  const hands = lines.map((line) => {
    const [cards, bid] = line.split(" ");
    return { cards: cards.split(""), bid: Number(bid) };
  }) as Hand[];

  const sorted = hands.sort(sortByCards);

  return sorted.reduce((acc, { bid }, i) => acc + bid * (i + 1), 0);
}

console.log("Part 1:", part1());
