import { useRef } from "react";
import CourseCard from "./CourseCard";
import PrerequisiteArrows from "./PrerequisiteArrows";
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
  arrows,
  onSelectCourse,
  onHoverCourse,
  isPlanning,
  opensThisSemester,
  columnOpens,
  pickedIds,
  onTogglePick,
}) {
  const boardRef = useRef(null);
  const lastSemesterNumber = Math.max(
    ...courses.map((course) => course.semester),
  );
  const semesterNumbers = Array.from(
    { length: lastSemesterNumber },
    (_, index) => index + 1,
  );

  return (
    <div className="snap-x snap-mandatory overflow-x-auto px-1 pt-1 pb-3">
      <div
        ref={boardRef}
        className="relative grid w-max auto-cols-[13rem] grid-flow-col gap-4"
      >
        <PrerequisiteArrows
          boardRef={boardRef}
          arrows={isPlanning ? [] : arrows}
        />
        {semesterNumbers.map((semesterNumber) => {
          const coursesInSemester = courses.filter(
            (course) => course.semester === semesterNumber,
          );
          const sctInSemester = coursesInSemester.reduce(
            (total, course) => total + course.sct,
            0,
          );
          const isColumnOpen = !isPlanning || columnOpens(semesterNumber);
          const headerStateClasses = !isPlanning
            ? "border-ink bg-ink text-paper"
            : isColumnOpen
              ? "border-ink border-b-[6px] border-b-blue bg-ink text-paper"
              : "border-muted bg-transparent text-muted";
          return (
            <section
              key={semesterNumber}
              className="flex snap-start flex-col gap-3"
            >
              <header
                className={`flex items-baseline justify-between border-2 px-2.5 py-2 font-extrabold transition-[background-color,color,border-color] duration-250 motion-reduce:transition-none ${headerStateClasses}`}
              >
                <span className="whitespace-nowrap">
                  Semestre {semesterNumber}
                  {isPlanning && (
                    <span className="ml-1.5 text-[0.7rem] font-semibold tracking-wide">
                      {isColumnOpen
                        ? "· se abre"
                        : "· no se abre este semestre"}
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-2.5">
                  {isColumnOpen && (
                    <span className="text-xs font-normal whitespace-nowrap tabular-nums opacity-85">
                      {sctInSemester} créditos
                    </span>
                  )}
                  {!isPlanning && (
                    <input
                      type="checkbox"
                      checked={isSemesterFullyApproved(semesterNumber)}
                      onChange={() => onToggleSemester(semesterNumber)}
                      aria-label={`Aprobado todo hasta el semestre ${semesterNumber}`}
                      className="grid size-5 cursor-pointer appearance-none place-items-center border-2 border-current after:h-1.5 after:w-[11px] after:-translate-y-[2px] after:-rotate-45 after:border-b-[3px] after:border-l-[3px] after:border-transparent after:content-[''] checked:border-green checked:bg-green checked:after:border-white"
                    />
                  )}
                </span>
              </header>
              {coursesInSemester.map((course) => {
                const isApproved = approvedIds.has(course.id);
                const isLocked = !hasAllPrerequisitesApproved(
                  course.id,
                  courseById,
                  approvedIds,
                );
                const isClosedThisSemester =
                  isPlanning &&
                  !isApproved &&
                  !isLocked &&
                  !opensThisSemester(course.id);
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isApproved={isApproved}
                    isLocked={isLocked}
                    isPlanning={isPlanning}
                    isClosedThisSemester={isClosedThisSemester}
                    isClosedInOpenColumn={isClosedThisSemester && isColumnOpen}
                    isYearRoundInClosedColumn={
                      isPlanning &&
                      !isColumnOpen &&
                      !isApproved &&
                      !isLocked &&
                      course.offered === "A"
                    }
                    isPicked={isPlanning && pickedIds.has(course.id)}
                    onTogglePick={() => onTogglePick(course.id)}
                    focusRole={isPlanning ? null : focusRoleOf(course.id)}
                    isPinned={
                      !isPlanning && pinnedCourseIds.includes(course.id)
                    }
                    onToggleApproved={() => onToggleApproved(course.id)}
                    onSelect={(event) => {
                      event.stopPropagation();
                      if (!isPlanning) onSelectCourse(course.id);
                    }}
                    onHover={() => {
                      if (!isPlanning) onHoverCourse(course.id);
                    }}
                    onHoverEnd={() => onHoverCourse(null)}
                  />
                );
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
}
