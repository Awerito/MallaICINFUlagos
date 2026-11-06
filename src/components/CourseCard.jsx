import areas from "../data/areas.json";

export default function CourseCard({ course }) {
  return (
    <article
      className="flex min-w-0 flex-col gap-2 border-2 border-l-8 border-ink bg-white px-3 py-2.5 shadow-brutal-sm"
      style={{ borderLeftColor: areas[course.area].color }}
    >
      <p className="font-semibold leading-tight">{course.name}</p>
      <p className="flex items-baseline gap-1 tabular-nums">
        <span className="text-xl font-extrabold leading-none">
          {course.sct}
        </span>
        <span className="text-xs tracking-wide text-muted">créditos</span>
      </p>
    </article>
  );
}
