import { useState } from "react";
import { columnOpensInSemester, opensInSemester } from "./curriculumGraph";

export const CREDIT_LIMIT_PER_SEMESTER = 33;

export function usePlanner(courseById) {
  const [isPlanning, setIsPlanning] = useState(false);
  const [semesterNumber, setSemesterNumber] = useState(1);
  const [pickedIds, setPickedIds] = useState(new Set());

  function opensInSemesterNumber(courseId, candidateSemesterNumber) {
    return opensInSemester(courseById[courseId], candidateSemesterNumber);
  }

  function togglePlanning() {
    setIsPlanning(!isPlanning);
  }

  function stepSemester(delta) {
    const nextSemesterNumber = Math.max(1, semesterNumber + delta);
    setSemesterNumber(nextSemesterNumber);
    setPickedIds(
      new Set(
        [...pickedIds].filter((courseId) =>
          opensInSemesterNumber(courseId, nextSemesterNumber),
        ),
      ),
    );
  }

  function opensThisSemester(courseId) {
    return opensInSemesterNumber(courseId, semesterNumber);
  }

  function columnOpens(columnNumber) {
    return columnOpensInSemester(columnNumber, semesterNumber);
  }

  function togglePick(courseId) {
    const next = new Set(pickedIds);
    if (next.has(courseId)) next.delete(courseId);
    else next.add(courseId);
    setPickedIds(next);
  }

  const pickedCredits = [...pickedIds].reduce(
    (total, courseId) => total + courseById[courseId].sct,
    0,
  );

  return {
    isPlanning,
    togglePlanning,
    semesterNumber,
    stepSemester,
    opensThisSemester,
    columnOpens,
    pickedIds,
    togglePick,
    pickedCredits,
  };
}
