import { useState } from "react";
import { CURRICULUM_VERSIONS } from "./data/curriculumVersions";
import { useApprovedCourses } from "./useApprovedCourses";
import { useCourseFocus } from "./useCourseFocus";
import { usePlanner, CREDIT_LIMIT_PER_SEMESTER } from "./usePlanner";
import CurriculumGrid from "./components/CurriculumGrid";
import PlannerBar from "./components/PlannerBar";
import Legend from "./components/Legend";

const VERSION_STORAGE_KEY = "icinf-curriculum/version";

function readStoredVersionId() {
  try {
    const stored = localStorage.getItem(VERSION_STORAGE_KEY);
    return CURRICULUM_VERSIONS.some((version) => version.id === stored)
      ? stored
      : CURRICULUM_VERSIONS[0].id;
  } catch {
    return CURRICULUM_VERSIONS[0].id;
  }
}

function storeVersionId(versionId) {
  try {
    localStorage.setItem(VERSION_STORAGE_KEY, versionId);
  } catch {
    // storage unavailable: the choice still lives in memory for this session
  }
}

const ROW_ALIGNMENT_STORAGE_KEY = "icinf-curriculum/aligned-rows";

function readStoredRowAlignment() {
  try {
    return localStorage.getItem(ROW_ALIGNMENT_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

function storeRowAlignment(isRowAligned) {
  try {
    localStorage.setItem(ROW_ALIGNMENT_STORAGE_KEY, String(isRowAligned));
  } catch {
    // storage unavailable: the choice still lives in memory for this session
  }
}

export default function App() {
  const [selectedVersionId, setSelectedVersionId] =
    useState(readStoredVersionId);
  const [isRowAligned, setIsRowAligned] = useState(readStoredRowAlignment);
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

  const sumCredits = (courses) =>
    courses.reduce((total, course) => total + course.sct, 0);
  const approvedCourses = selectedVersion.courses.filter((course) =>
    approvedIds.has(course.id),
  );
  const approvedCredits = sumCredits(approvedCourses);
  const totalCredits = sumCredits(selectedVersion.courses);
  const progressPercent = Math.round((approvedCredits / totalCredits) * 100);

  function selectVersion(versionId) {
    setSelectedVersionId(versionId);
    storeVersionId(versionId);
  }

  function toggleRowAlignment() {
    setIsRowAligned(!isRowAligned);
    storeRowAlignment(!isRowAligned);
  }

  return (
    <main
      className="min-h-screen bg-paper px-4 py-4 font-sans text-ink sm:px-8 sm:py-8"
      onClick={clearPinnedCourses}
    >
      <header className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-3 sm:mb-8 sm:pb-4">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 sm:flex sm:gap-4">
          <img
            src="/favicon.png"
            alt=""
            className="h-12 w-12 shrink-0 sm:h-16 sm:w-16 sm:-translate-y-1"
          />
          <div className="contents sm:block">
            <h1 className="text-3xl font-extrabold leading-none tracking-tight sm:text-4xl">
              Ingeniería Civil en Informática
            </h1>
            <p className="col-span-2 mt-2 text-muted tabular-nums">
              Universidad de Los Lagos ·{" "}
              {approvedCourses.length === 0 ? (
                <>
                  <span className="font-extrabold text-ink">
                    Marca (
                    <span
                      aria-hidden="true"
                      className="inline-grid size-5 -translate-y-1 place-items-center border-2 border-green bg-green align-baseline after:h-1.5 after:w-[11px] after:-translate-y-[2px] after:-rotate-45 after:border-b-[3px] after:border-l-[3px] after:border-white after:content-['']"
                    />
                    ) los ramos que ya aprobaste
                  </span>{" "}
                  y toca cualquiera para ver qué necesita y qué abre
                </>
              ) : (
                <>
                  <span className="font-extrabold text-ink">
                    {progressPercent} %
                  </span>{" "}
                  de la carrera · {approvedCourses.length} de{" "}
                  {selectedVersion.courses.length} ramos · {approvedCredits} de{" "}
                  {totalCredits} créditos
                </>
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            clearPinnedCourses();
            togglePlanning();
          }}
          className={
            "relative flex w-full flex-col items-start gap-1 border-2 px-3.5 py-2 font-semibold sm:w-auto " +
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
              <span className="h-1.5 w-full border border-current">
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
      </header>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${isPlanning ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div
          inert={!isPlanning}
          className={`min-h-0 overflow-hidden transition-opacity duration-300 motion-reduce:transition-none ${isPlanning ? "opacity-100" : "opacity-0"}`}
        >
          <PlannerBar
            semesterNumber={semesterNumber}
            onChooseSemester={chooseSemester}
            pickedCredits={pickedCredits}
          />
        </div>
      </div>
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
        isRowAligned={isRowAligned}
      />
      <footer className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Legend />
        <div className="flex shrink-0 flex-col items-end gap-3 self-end sm:self-auto">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
            Alinear filas
            <input
              type="checkbox"
              checked={isRowAligned}
              onChange={toggleRowAlignment}
              className="grid size-5 cursor-pointer appearance-none place-items-center border-2 border-ink bg-white after:h-1.5 after:w-[11px] after:-translate-y-[2px] after:-rotate-45 after:border-b-[3px] after:border-l-[3px] after:border-transparent after:content-[''] checked:bg-ink checked:after:border-white"
            />
          </label>
          <div className="inline-flex border-2 border-ink bg-white">
            {CURRICULUM_VERSIONS.map((version, index) => {
              const isSelected = version.id === selectedVersionId;
              return (
                <button
                  key={version.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => selectVersion(version.id)}
                  className={
                    "px-2.5 py-1 text-sm font-semibold " +
                    (index > 0 ? "border-l-2 border-ink " : "") +
                    (isSelected ? "bg-ink text-paper" : "hover:bg-paper")
                  }
                >
                  {version.label}
                </button>
              );
            })}
          </div>
          <p className="text-right text-xs text-muted">
            © 2026{" "}
            <a href="https://github.com/Awerito" className="underline">
              Awerito
            </a>{" "}
            ·{" "}
            <a
              href="https://github.com/Awerito/MallaICINFUlagos"
              className="underline"
            >
              Código en GitHub
            </a>{" "}
            ·{" "}
            <a
              href="https://github.com/Awerito/MallaICINFUlagos/blob/master/LICENSE"
              className="underline"
            >
              MIT
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
