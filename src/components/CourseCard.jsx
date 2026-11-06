import areas from "../data/areas.json";

const focusClasses = {
  origin: "-translate-x-0.5 -translate-y-0.5 shadow-brutal",
  needs: "",
  opens: "",
  dimmed: "opacity-25",
};

const SQUARE_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
const CORNER_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 100%)";

export default function CourseCard({
  course,
  isApproved,
  isLocked,
  isPlanning,
  isClosedThisSemester,
  isClosedInOpenColumn,
  isYearRoundInClosedColumn,
  isPlanned,
  focusRole,
  isPinned,
  onToggleApproved,
  onTogglePick,
  onSelect,
  onHover,
  onHoverEnd,
}) {
  const stateClasses = isApproved
    ? "bg-approved"
    : isLocked
      ? "border-dashed [border-left-style:solid] bg-white text-muted shadow-brutal-sm"
      : isClosedThisSemester
        ? "bg-[repeating-linear-gradient(135deg,var(--color-white)_0_6px,var(--color-hatch)_6px_8px)] text-muted"
        : isPlanning && isPlanned
          ? "border-blue bg-white shadow-[3px_3px_0_0_var(--color-blue)]"
          : "bg-white shadow-brutal-sm";
  const focusStateClasses = isPinned
    ? "-translate-x-[3px] -translate-y-[3px] shadow-[6px_6px_0_0_var(--color-ink)]"
    : (focusClasses[focusRole] ?? "");
  const showsPickCheckbox = isPlanning && !isApproved;
  const isPickable = !isLocked && !isClosedThisSemester;
  const plannedMarkStyle = isPlanning
    ? {
        clipPath: SQUARE_CLIP,
        transition:
          "clip-path 320ms, top 320ms 320ms, right 320ms 320ms, width 320ms 320ms, height 320ms 320ms",
      }
    : {
        clipPath: CORNER_CLIP,
        transition:
          "top 320ms, right 320ms, width 320ms, height 320ms, clip-path 320ms 320ms",
      };

  return (
    <article
      data-course-id={course.id}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      className={`relative flex min-w-0 cursor-pointer flex-col gap-2 border-2 border-l-8 border-ink px-3 py-2.5 transition-[opacity,transform,box-shadow,background-color,color] duration-250 motion-reduce:transition-none ${stateClasses} ${focusStateClasses}`}
      style={{ borderLeftColor: areas[course.area].color }}
    >
      {isPlanned && (
        <span
          aria-hidden="true"
          style={plannedMarkStyle}
          className={`pointer-events-none absolute grid place-items-center bg-blue motion-reduce:transition-none! after:h-1.5 after:w-[11px] after:-translate-y-[2px] after:-rotate-45 after:border-b-[3px] after:border-l-[3px] after:border-white after:transition-opacity after:duration-320 after:content-[''] ${isPlanning ? "top-2 right-2 size-5 after:opacity-100" : "-top-0.5 -right-0.5 size-[22px] after:opacity-0"}`}
        />
      )}
      {!isPlanning && (
        <input
          type="checkbox"
          checked={isApproved}
          onChange={onToggleApproved}
          onClick={(event) => event.stopPropagation()}
          aria-label={`Aprobado: ${course.name}`}
          className="absolute top-2 right-2 grid size-5 cursor-pointer appearance-none place-items-center border-2 border-current after:h-1.5 after:w-[11px] after:-translate-y-[2px] after:-rotate-45 after:border-b-[3px] after:border-l-[3px] after:border-transparent after:content-[''] checked:border-green checked:bg-green checked:after:border-white"
        />
      )}
      {showsPickCheckbox && (
        <input
          type="checkbox"
          checked={isPlanned}
          disabled={!isPickable}
          onChange={onTogglePick}
          onClick={(event) => event.stopPropagation()}
          aria-label={`Lo tomo: ${course.name}`}
          className="absolute top-2 right-2 size-5 cursor-pointer appearance-none border-2 border-current checked:border-transparent disabled:cursor-not-allowed disabled:opacity-40"
        />
      )}
      <p
        className={`pr-7 font-semibold leading-tight ${isApproved ? "line-through decoration-2" : ""}`}
      >
        {course.name}
      </p>
      <p className="flex items-baseline gap-1 tabular-nums">
        <span className="text-xl font-extrabold leading-none">
          {course.sct}
        </span>
        <span className="text-xs tracking-wide opacity-70">créditos</span>
      </p>
      {isYearRoundInClosedColumn && (
        <p className="text-xs font-semibold tracking-wide text-blue">
          todo el año
        </p>
      )}
      {isClosedInOpenColumn && (
        <p className="text-xs font-semibold tracking-wide">
          no se abre este semestre
        </p>
      )}
    </article>
  );
}
