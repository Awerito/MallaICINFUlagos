import CourseCard from "./CourseCard";
import { hasAllPrerequisitesApproved } from "../curriculumGraph";

export default function CurriculumGrid({
  courses,
  courseById,
  approvedIds,
  onToggleApproved,
  isSemesterFullyApproved,
  onToggleSemester,
  focusRoleOf,
  pinnedCourseIds,
  onSelectCourse,
  onHoverCourse,
}) {
  const lastSemesterNumber = Math.max(
    ...courses.map((course) => course.semester),
  );
  const semesterNumbers = Array.from(
    { length: lastSemesterNumber },
    (_, index) => index + 1,
  );

  return (
    <div className="snap-x snap-mandatory overflow-x-auto px-1 pt-1 pb-3">
      <div className="grid w-max auto-cols-[13rem] grid-flow-col gap-4">
        {semesterNumbers.map((semesterNumber) => {
          const coursesInSemester = courses.filter(
            (course) => course.semester === semesterNumber,
          );
          const sctInSemester = coursesInSemester.reduce(
            (total, course) => total + course.sct,
            0,
          );
          return (
            <section
              key={semesterNumber}
              className="flex snap-start flex-col gap-3"
            >
              <header className="flex items-baseline justify-between bg-ink px-2.5 py-2 font-extrabold text-paper">
                <span className="whitespace-nowrap">
                  Semestre {semesterNumber}
                </span>
                <span className="flex items-center gap-2.5">
                  <span className="text-xs font-normal whitespace-nowrap tabular-nums opacity-85">
                    {sctInSemester} créditos
                  </span>
                  <input
                    type="checkbox"
                    checked={isSemesterFullyApproved(semesterNumber)}
                    onChange={() => onToggleSemester(semesterNumber)}
                    aria-label={`Aprobado todo hasta el semestre ${semesterNumber}`}
                    className="grid size-5 cursor-pointer appearance-none place-items-center border-2 border-current after:h-1.5 after:w-[11px] after:-translate-y-[2px] after:-rotate-45 after:border-b-[3px] after:border-l-[3px] after:border-transparent after:content-[''] checked:border-green checked:bg-green checked:after:border-white"
                  />
                </span>
              </header>
              {coursesInSemester.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isApproved={approvedIds.has(course.id)}
                  isLocked={
                    !hasAllPrerequisitesApproved(
                      course.id,
                      courseById,
                      approvedIds,
                    )
                  }
                  focusRole={focusRoleOf(course.id)}
                  isPinned={pinnedCourseIds.includes(course.id)}
                  onToggleApproved={() => onToggleApproved(course.id)}
                  onSelect={(event) => {
                    event.stopPropagation();
                    onSelectCourse(course.id);
                  }}
                  onHover={() => onHoverCourse(course.id)}
                  onHoverEnd={() => onHoverCourse(null)}
                />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
