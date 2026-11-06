import { Fragment, useRef } from "react";
import CourseCard from "./CourseCard";
import PrerequisiteArrows from "./PrerequisiteArrows";
import { hasAllPrerequisitesApproved } from "../curriculumGraph";

const LICENCIATURA_SEMESTER = 8;

function MilestoneColumn({ shortName, fullName, isReached }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        title={fullName}
        className={`grid h-14 w-full place-items-center border-2 font-extrabold ${
          isReached
            ? "border-ink bg-ink text-paper"
            : "border-dashed border-ink bg-[repeating-linear-gradient(135deg,var(--color-white)_0_6px,var(--color-hatch)_6px_8px)] text-muted"
        }`}
      >
        {shortName}
      </div>
      <span
        className={`flex-1 ${isReached ? "border-l-4 border-ink" : "border-l-2 border-dashed border-ink"}`}
      />
    </div>
  );
}

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
  areAllPicked,
  onToggleColumnPicks,
}) {
  const boardRef = useRef(null);
  const lastSemesterNumber = Math.max(
    ...courses.map((course) => course.semester),
  );
  const semesterNumbers = Array.from(
    { length: lastSemesterNumber },
    (_, index) => index + 1,
  );
  const columnTemplate = semesterNumbers
    .map((semesterNumber) =>
      semesterNumber === LICENCIATURA_SEMESTER ||
      semesterNumber === lastSemesterNumber
        ? "minmax(9rem, 1fr) 6.5rem"
        : "minmax(9rem, 1fr)",
    )
    .join(" ");

  return (
    <div className="snap-x snap-mandatory overflow-x-auto px-1 pt-1 pb-3">
      <div
        ref={boardRef}
        className="relative grid gap-4"
        style={{ gridTemplateColumns: columnTemplate }}
      >
        <PrerequisiteArrows
          boardRef={boardRef}
          arrows={isPlanning ? [] : arrows}
        />
        {semesterNumbers.map((semesterNumber) => {
          const coursesInSemester = courses.filter(
            (course) => course.semester === semesterNumber,
          );
          const isColumnOpen = !isPlanning || columnOpens(semesterNumber);
          const creditsInSemester = coursesInSemester.reduce(
            (total, course) => total + course.sct,
            0,
          );
          const pickableIdsInColumn = isPlanning
            ? coursesInSemester
                .filter(
                  (course) =>
                    !approvedIds.has(course.id) &&
                    hasAllPrerequisitesApproved(
                      course.id,
                      courseById,
                      approvedIds,
                    ) &&
                    opensThisSemester(course.id),
                )
                .map((course) => course.id)
            : [];
          const headerStateClasses = !isPlanning
            ? "border-ink bg-ink text-paper"
            : isColumnOpen
              ? "border-ink border-b-[6px] border-b-blue bg-ink text-paper"
              : "border-muted bg-transparent text-muted";
          return (
            <Fragment key={semesterNumber}>
              <section className="flex min-w-0 snap-start flex-col gap-3">
                <header
                  className={`flex h-14 items-center justify-between border-2 px-2.5 font-extrabold transition-[background-color,color,border-color] duration-250 motion-reduce:transition-none ${headerStateClasses}`}
                >
                  <span className="flex flex-col justify-center leading-tight whitespace-nowrap">
                    <span>Semestre {semesterNumber}</span>
                    {!isPlanning && (
                      <span className="text-[0.7rem] font-semibold tracking-wide opacity-80">
                        {creditsInSemester} créditos
                      </span>
                    )}
                    {isPlanning && !isColumnOpen && (
                      <span className="text-[0.7rem] font-semibold tracking-wide">
                        no se dicta
                      </span>
                    )}
                  </span>
                  <span className="flex size-5 shrink-0 items-center justify-center">
                    {!isPlanning && (
                      <input
                        type="checkbox"
                        checked={isSemesterFullyApproved(semesterNumber)}
                        onChange={() => onToggleSemester(semesterNumber)}
                        aria-label={`Aprobado todo hasta el semestre ${semesterNumber}`}
                        className="grid size-5 cursor-pointer appearance-none place-items-center border-2 border-current after:h-1.5 after:w-[11px] after:-translate-y-[2px] after:-rotate-45 after:border-b-[3px] after:border-l-[3px] after:border-transparent after:content-[''] checked:border-green checked:bg-green checked:after:border-white"
                      />
                    )}
                    {isPlanning && pickableIdsInColumn.length > 0 && (
                      <input
                        type="checkbox"
                        checked={areAllPicked(pickableIdsInColumn)}
                        onChange={() =>
                          onToggleColumnPicks(pickableIdsInColumn)
                        }
                        aria-label={`Tomar todo el semestre ${semesterNumber}`}
                        className="grid size-5 cursor-pointer appearance-none place-items-center border-2 border-current after:h-1.5 after:w-[11px] after:-translate-y-[2px] after:-rotate-45 after:border-b-[3px] after:border-l-[3px] after:border-transparent after:content-[''] checked:border-blue checked:bg-blue checked:after:border-white"
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
                      isClosedInOpenColumn={
                        isClosedThisSemester && isColumnOpen
                      }
                      isYearRound={
                        isPlanning && !isApproved && course.offered === "A"
                      }
                      isPlanned={pickedIds.has(course.id)}
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
              {semesterNumber === LICENCIATURA_SEMESTER && (
                <MilestoneColumn
                  shortName="Licenciatura"
                  fullName="Licenciatura en Ciencias de la Ingeniería"
                  isReached={isSemesterFullyApproved(LICENCIATURA_SEMESTER)}
                />
              )}
              {semesterNumber === lastSemesterNumber && (
                <MilestoneColumn
                  shortName="Título"
                  fullName="Título de Ingeniería Civil en Informática"
                  isReached={isSemesterFullyApproved(lastSemesterNumber)}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
