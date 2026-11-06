import { CREDIT_LIMIT_PER_SEMESTER } from "../usePlanner";

export default function PlannerBar({
  semesterNumber,
  onChooseSemester,
  pickedCredits,
}) {
  const isOverBudget = pickedCredits > CREDIT_LIMIT_PER_SEMESTER;
  const creditsOver = pickedCredits - CREDIT_LIMIT_PER_SEMESTER;
  const usedPercent = Math.min(
    100,
    (pickedCredits / CREDIT_LIMIT_PER_SEMESTER) * 100,
  );

  return (
    <section className="mb-6 flex flex-wrap items-center gap-8 border-2 border-blue bg-white px-4 py-3.5">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-extrabold">
            Mi próximo semestre en la carrera
          </span>
          <span className="text-xs text-muted">contando los repetidos</span>
        </div>
        <span className="flex border-2 border-ink bg-white shadow-brutal-sm">
          <button
            type="button"
            onClick={() => onChooseSemester(semesterNumber - 1)}
            aria-label="Un semestre menos"
            className="w-9 border-r-2 border-ink text-lg font-extrabold"
          >
            −
          </button>
          <input
            key={semesterNumber}
            type="number"
            min="1"
            defaultValue={semesterNumber}
            aria-label="Mi próximo semestre en la carrera"
            onFocus={(event) => event.target.select()}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.target.blur();
            }}
            onBlur={(event) => {
              onChooseSemester(Number(event.target.value));
              event.target.value = semesterNumber;
            }}
            className="w-13 border-0 bg-transparent text-center text-2xl font-extrabold tabular-nums [appearance:textfield] focus:outline-3 focus:-outline-offset-3 focus:outline-blue [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => onChooseSemester(semesterNumber + 1)}
            aria-label="Un semestre más"
            className="w-9 border-l-2 border-ink text-lg font-extrabold"
          >
            +
          </button>
        </span>
      </div>
      <div className="ml-auto flex min-w-65 flex-col gap-1.5">
        <p
          className={`text-2xl font-extrabold tabular-nums ${isOverBudget ? "text-red" : ""}`}
        >
          {pickedCredits}{" "}
          <span className="text-sm font-normal opacity-75">
            de {CREDIT_LIMIT_PER_SEMESTER} créditos
            {isOverBudget && ` · ${creditsOver} de más`}
          </span>
        </p>
        <div className="h-3 border-2 border-ink bg-white">
          <div
            className={`h-full transition-[width] duration-250 motion-reduce:transition-none ${isOverBudget ? "bg-red" : "bg-blue"}`}
            style={{ width: `${usedPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
