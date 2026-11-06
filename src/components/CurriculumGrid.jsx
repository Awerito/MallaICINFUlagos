import CourseCard from "./CourseCard";
import { hasAllPrerequisitesApproved } from "../curriculumGraph";

export default function CurriculumGrid({
  courses,
  courseById,
  approvedIds,
  onToggleApproved,
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
                <span>Semestre {semesterNumber}</span>
                <span className="text-sm font-normal tabular-nums opacity-85">
                  {sctInSemester} créditos
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
                  onToggleApproved={() => onToggleApproved(course.id)}
                />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
