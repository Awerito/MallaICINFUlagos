import { useState } from "react";
import { CURRICULUM_VERSIONS } from "./data/curriculumVersions";
import { useApprovedCourses } from "./useApprovedCourses";
import { useCourseFocus } from "./useCourseFocus";
import { usePlanner, CREDIT_LIMIT_PER_SEMESTER } from "./usePlanner";
import CurriculumGrid from "./components/CurriculumGrid";
import PlannerBar from "./components/PlannerBar";
import Legend from "./components/Legend";

export default function App() {
  const [selectedVersionId, setSelectedVersionId] = useState(
    CURRICULUM_VERSIONS[0].id,
  );
  const selectedVersion = CURRICULUM_VERSIONS.find(
    (version) => version.id === selectedVersionId,
  );
  const {
    approvedIds,
    courseById,
    coursesOpenedBy,
    toggleCourse,
    isSemesterFullyApproved,
    toggleSemester,
  } = useApprovedCourses(selectedVersionId, selectedVersion.courses);
  const {
    pinnedCourseIds,
    arrows,
    focusRoleOf,
    hoverCourse,
    selectCourse,
    clearPinnedCourses,
  } = useCourseFocus(courseById, coursesOpenedBy);
  const {
    isPlanning,
    togglePlanning,
    semesterNumber,
    chooseSemester,
    opensThisSemester,
    columnOpens,
    pickedIds,
    plannedCount,
    togglePick,
    areAllPicked,
    toggleColumnPicks,
    pickedCredits,
  } = usePlanner(courseById, selectedVersionId, approvedIds);

  return (
    <main
      className="min-h-screen bg-paper px-4 py-8 font-sans text-ink sm:px-8"
      onClick={clearPinnedCourses}
    >
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
        <div>
          <h1 className="text-3xl font-extrabold leading-none tracking-tight sm:text-4xl">
            Ingeniería Civil en Informática
          </h1>
          <p className="mt-2 text-muted">Universidad de Los Lagos</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              clearPinnedCourses();
              togglePlanning();
            }}
            className={
              "relative flex flex-col items-start gap-1 border-2 px-3.5 py-2 font-semibold " +
              (isPlanning
                ? "translate-x-[3px] translate-y-[3px] border-blue bg-blue text-white"
                : "border-ink bg-white shadow-brutal-sm hover:bg-paper")
            }
          >
            {!isPlanning && plannedCount > 0 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-0.5 -right-0.5 size-7 bg-blue [clip-path:polygon(0_0,100%_0,100%_100%,100%_100%)]"
              />
            )}
            <span>
              {isPlanning
                ? "Salir del planificador ›"
                : "Planificar mi próximo semestre ›"}
            </span>
            {!isPlanning && plannedCount > 0 && (
              <>
                <span className="text-xs font-normal opacity-80">
                  {semesterNumber}° semestre · {plannedCount} ramos ·{" "}
                  {pickedCredits} de {CREDIT_LIMIT_PER_SEMESTER} créditos
                </span>
                <span className="h-1.5 w-40 border border-current">
                  <span
                    className={`block h-full ${pickedCredits > CREDIT_LIMIT_PER_SEMESTER ? "bg-red" : "bg-blue"}`}
                    style={{
                      width: `${Math.min(100, (pickedCredits / CREDIT_LIMIT_PER_SEMESTER) * 100)}%`,
                    }}
                  />
                </span>
              </>
            )}
          </button>
          {CURRICULUM_VERSIONS.map((version) => {
            const isSelected = version.id === selectedVersionId;
            return (
              <button
                key={version.id}
                type="button"
                onClick={() => setSelectedVersionId(version.id)}
                className={
                  "border-2 border-ink px-3.5 py-2 font-semibold " +
                  (isSelected
                    ? "translate-x-[3px] translate-y-[3px] bg-ink text-paper"
                    : "bg-white shadow-brutal-sm hover:bg-paper")
                }
              >
                {version.label}
              </button>
            );
          })}
        </div>
      </header>
      {isPlanning && (
        <PlannerBar
          semesterNumber={semesterNumber}
          onChooseSemester={chooseSemester}
          pickedCredits={pickedCredits}
        />
      )}
      <CurriculumGrid
        courses={selectedVersion.courses}
        courseById={courseById}
        approvedIds={approvedIds}
        onToggleApproved={toggleCourse}
        isSemesterFullyApproved={isSemesterFullyApproved}
        onToggleSemester={toggleSemester}
        focusRoleOf={focusRoleOf}
        pinnedCourseIds={pinnedCourseIds}
        arrows={arrows}
        onSelectCourse={selectCourse}
        onHoverCourse={hoverCourse}
        isPlanning={isPlanning}
        opensThisSemester={opensThisSemester}
        columnOpens={columnOpens}
        pickedIds={pickedIds}
        onTogglePick={togglePick}
        areAllPicked={areAllPicked}
        onToggleColumnPicks={toggleColumnPicks}
      />
      <footer className="mt-8">
        <Legend />
      </footer>
    </main>
  );
}
