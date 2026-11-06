import { useState } from "react";
import { CURRICULUM_VERSIONS } from "./data/curriculumVersions";
import { useApprovedCourses } from "./useApprovedCourses";
import CurriculumGrid from "./components/CurriculumGrid";
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
    toggleCourse,
    isSemesterFullyApproved,
    toggleSemester,
  } = useApprovedCourses(selectedVersionId, selectedVersion.courses);

  return (
    <main className="min-h-screen bg-paper px-4 py-8 font-sans text-ink sm:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
        <div>
          <h1 className="text-3xl font-extrabold leading-none tracking-tight sm:text-4xl">
            Ingeniería Civil en Informática
          </h1>
          <p className="mt-2 text-muted">Universidad de Los Lagos</p>
        </div>
        <div className="flex gap-2.5">
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
      <CurriculumGrid
        courses={selectedVersion.courses}
        courseById={courseById}
        approvedIds={approvedIds}
        onToggleApproved={toggleCourse}
        isSemesterFullyApproved={isSemesterFullyApproved}
        onToggleSemester={toggleSemester}
      />
      <footer className="mt-8">
        <Legend />
      </footer>
    </main>
  );
}
