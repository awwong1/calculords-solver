import React, { ChangeEventHandler, FormEventHandler, MouseEventHandler, useState } from "react";
import "./App.css";
import { findSolutions, ISolution } from "./Solver";

const toNumberList = (rawValues: string): number[] => (
  rawValues.trim().split(/[\s,]+/).map(Number)
);
const add = (l: number, r: number) => l + r;

interface ISolProps {
  sol: ISolution;
  rawCards: string;
  setRawCards: React.Dispatch<React.SetStateAction<string>>;
  setRawNumbers: React.Dispatch<React.SetStateAction<string>>;
  setSolutions: React.Dispatch<React.SetStateAction<ISolution[]>>;
}
const SolutionItem: React.FC<ISolProps> = ({ sol, rawCards, setRawCards, setRawNumbers, setSolutions }: ISolProps) => {
  const applySolution: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    // apply the difference
    const ogCards = toNumberList(rawCards);
    const diff = sol.ints.slice();
    const remain = ogCards.filter((i) => {
      const match = diff.indexOf(i);
      if (match >= 0) {
        diff.splice(match, 1);
      }
      return match < 0;
    });
    setRawCards(remain.join(", "));

    setSolutions([sol]);
    setRawNumbers("");
  };

  const key = JSON.stringify(sol.ints);
  return <div key={key}>
    <h3>{key} <button onClick={applySolution}>apply</button></h3>
    <ul>
      {sol.stack.map((step) => <li key={step}>{step}</li>)}
    </ul>
  </div>;
};

const App: React.FC = () => {
  const [rawCards, setRawCards] = useState("17, 6, 2, 35, 50");
  const [rawNumbers, setRawNumbers] = useState("3, 4, 2, 7, 8, 4, 1");
  const [solutions, setSolutions] = useState<ISolution[]>([]);

  const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "cards":
        setRawCards(value);
        break;
      case "numbers":
        setRawNumbers(value);
        break;
      default:
        break;
    }
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const sols = findSolutions(toNumberList(rawCards), toNumberList(rawNumbers));
    sols.sort((a, b) => {
      const l = b.ints.length - a.ints.length;
      if (l === 0) {
        return b.ints.reduce(add) - a.ints.reduce(add);
      }
      return l;
    });
    if (sols.length === 0) {
      sols.push({
        ints: [NaN],
        stack: ["impossible"],
      });
    }
    setSolutions(sols);
  };

  return (
    <>
      <header>
        <h1>Calculords Solver</h1>
        <ul>
          <li>
            <a style={{ color: "#ffffff" }} href="http://calculords.com/">Calculords</a>
          </li>
        </ul>
      </header>
      <form className="form" onSubmit={onSubmit}>
        <label className="label">
          Cards:
          <input type="text" name="cards" value={rawCards} onChange={onChangeInput} />
          {rawCards ? <code>{JSON.stringify(toNumberList(rawCards))}</code> : <code>nil</code>}
        </label>
        <label className="label">
          Numbers:
          <input type="text" name="numbers" value={rawNumbers} onChange={onChangeInput} />
          {rawNumbers ? <code>{JSON.stringify(toNumberList(rawNumbers))}</code> : <code>nil</code>}
        </label>
        <input type="submit" value="solve" />
      </form>
      {solutions.length > 0 && <div>
        <h2>Results ({solutions.length})</h2>
        {solutions.map((sol) => SolutionItem({ sol, rawCards, setRawCards, setRawNumbers, setSolutions }))}
      </div>
      }
    </>
  );
};

export default App;
