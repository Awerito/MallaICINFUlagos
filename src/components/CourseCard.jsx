import areas from "../data/areas.json";

const focusClasses = {
  origin: "-translate-x-0.5 -translate-y-0.5 shadow-brutal",
  needs: "",
  opens: "",
  dimmed: "opacity-25",
};

export default function CourseCard({
  course,
  isApproved,
  isLocked,
  focusRole,
  isPinned,
  onToggleApproved,
  onSelect,
  onHover,
  onHoverEnd,
}) {
  const stateClasses = isApproved
    ? "bg-approved"
    : isLocked
      ? "border-dashed [border-left-style:solid] bg-white text-muted shadow-brutal-sm"
      : "bg-white shadow-brutal-sm";

  return (
    <article
      data-course-id={course.id}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      className={`relative flex min-w-0 cursor-pointer flex-col gap-2 border-2 border-l-8 border-ink px-3 py-2.5 transition-[opacity,transform,box-shadow] duration-120 motion-reduce:transition-none ${stateClasses} ${focusClasses[focusRole] ?? ""} ${isPinned ? "outline-3 outline-offset-3 outline-ink" : ""}`}
      style={{ borderLeftColor: areas[course.area].color }}
    >
      <input
        type="checkbox"
        checked={isApproved}
        onChange={onToggleApproved}
        onClick={(event) => event.stopPropagation()}
        aria-label={`Aprobado: ${course.name}`}
        className="absolute top-2 right-2 grid size-5 cursor-pointer appearance-none place-items-center border-2 border-current after:h-1.5 after:w-[11px] after:-translate-y-[2px] after:-rotate-45 after:border-b-[3px] after:border-l-[3px] after:border-transparent after:content-[''] checked:border-green checked:bg-green checked:after:border-white"
      />
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
    </article>
  );
}
