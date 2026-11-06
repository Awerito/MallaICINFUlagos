import { CREDIT_LIMIT_PER_SEMESTER } from "../usePlanner";

export default function PlannerBar({
  semesterNumber,
  onStepSemester,
  pickedCredits,
}) {
  const creditsLeft = CREDIT_LIMIT_PER_SEMESTER - pickedCredits;
  const isOverBudget = creditsLeft < 0;
  const usedPercent = Math.min(
    100,
    (pickedCredits / CREDIT_LIMIT_PER_SEMESTER) * 100,
  );

  return (
    <section className="mb-6 flex flex-wrap items-center gap-6 border-2 border-blue bg-white px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className="font-extrabold">
          Mi próximo semestre en la carrera
        </span>
        <span className="flex border-2 border-ink bg-white shadow-brutal-sm">
          <button
            type="button"
            onClick={() => onStepSemester(-1)}
            aria-label="Un semestre menos"
            className="w-9 border-r-2 border-ink text-lg font-extrabold"
          >
            −
          </button>
          <output className="grid min-w-13 place-items-center text-2xl font-extrabold tabular-nums">
            {semesterNumber}
          </output>
          <button
            type="button"
            onClick={() => onStepSemester(1)}
            aria-label="Un semestre más"
            className="w-9 border-l-2 border-ink text-lg font-extrabold"
          >
            +
          </button>
        </span>
        <span className="text-xs text-muted">contando los repetidos</span>
      </div>
      <div className="ml-auto flex min-w-65 flex-col gap-1.5">
        <p
          className={`text-2xl font-extrabold tabular-nums ${isOverBudget ? "text-red" : ""}`}
        >
          {creditsLeft}{" "}
          <span className="text-sm font-normal opacity-75">
            de {CREDIT_LIMIT_PER_SEMESTER} créditos disponibles
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
