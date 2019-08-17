
const ops = [
  (l: number, r: number) => ({
    str: `${l} + ${r}`, val: l + r,
  }),
  (l: number, r: number) => ({
    str: `${l} - ${r}`, val: l - r,
  }),
  (l: number, r: number) => ({
    str: `${r} - ${l}`, val: r - l,
  }),
  (l: number, r: number) => ({
    str: `${l} * ${r}`, val: l * r,
  }),
];

export interface ISolution { stack: string[]; ints: number[]; }

export const findSolutions = (cards: number[], numbers: number[]): ISolution[] => {
  cards = cards.sort();
  numbers = numbers.sort();

  let called = 0;
  let search = 0;
  const paths: { [index: string]: boolean } = {};
  const solutions: ISolution[] = [];

  const step = (stack: string[], ints: number[], init: boolean = true) => {
    called++;
    ints = ints.sort();
    const key = ints.join("|");

    if (key in paths) { return; } else { paths[key] = true; }
    if (ints.length <= cards.length) {
      // check of all of our ints uniquely match our cards
      const matchCards = cards.slice();
      const remaining = ints.filter((int) => {
        const matchCard = matchCards.indexOf(int);
        if (matchCard >= 0) { matchCards.splice(matchCard, 1); }
        return matchCard < 0;
      });

      // all ints matched, solution found
      if (remaining.length === 0) {
        const alreadyFound = solutions.some((solution) => {
          if (solution.ints.length !== ints.length) { return false; }
          return solution.ints.every((int, idx) => int === ints[idx]);
        });
        if (!alreadyFound) { solutions.push({ stack, ints }); }
        return;
      }
    }

    // check edge case of one number mismatch
    if (ints.length === 1) { return; }

    search++;

    // pull two numbers out, apply possible operations
    for (let i = 0; i < ints.length; i++) {
      const left = ints[i];
      const localInts = ints.slice();
      localInts.splice(i, 1);
      for (let j = i; j < localInts.length; j++) {
        const right = localInts.splice(j, 1)[0];

        for (const op of ops) {
          const opResult = op(left, right);
          step(stack.concat(opResult.str), localInts.concat(opResult.val));
        }
        localInts.unshift(right);
      }
      localInts.unshift(left);
    }
  };

  step([], numbers);
  // tslint:disable-next-line: no-console
  console.log(`Given cards [${cards}] ints [${numbers}], stepped ${called}, searched ${search} times`);
  return solutions;
};
