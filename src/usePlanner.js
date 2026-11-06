import { useEffect, useState } from "react";
import {
  columnOpensInSemester,
  hasAllPrerequisitesApproved,
  opensInSemester,
} from "./curriculumGraph";

export const CREDIT_LIMIT_PER_SEMESTER = 33;

const storageKeyFor = (versionId) => `icinf-curriculum/planner/${versionId}`;

function readStoredPlan(versionId) {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKeyFor(versionId)));
    return {
      semesterNumber: stored?.semesterNumber ?? 1,
      pickedIds: new Set(stored?.pickedIds ?? []),
    };
  } catch {
    return { semesterNumber: 1, pickedIds: new Set() };
  }
}

function storePlan(versionId, semesterNumber, pickedIds) {
  try {
    localStorage.setItem(
      storageKeyFor(versionId),
      JSON.stringify({ semesterNumber, pickedIds: [...pickedIds] }),
    );
  } catch {
    // storage unavailable: the plan still lives in memory for this session
  }
}

export function usePlanner(courseById, versionId, approvedIds) {
  const [isPlanning, setIsPlanning] = useState(false);
  const [semesterNumber, setSemesterNumber] = useState(
    () => readStoredPlan(versionId).semesterNumber,
  );
  const [storedPickedIds, setStoredPickedIds] = useState(
    () => readStoredPlan(versionId).pickedIds,
  );

  useEffect(() => {
    const stored = readStoredPlan(versionId);
    setSemesterNumber(stored.semesterNumber);
    setStoredPickedIds(stored.pickedIds);
  }, [versionId]);

  const pickedIds = new Set(
    [...storedPickedIds].filter(
      (courseId) =>
        courseById[courseId] &&
        !approvedIds.has(courseId) &&
        hasAllPrerequisitesApproved(courseId, courseById, approvedIds),
    ),
  );

  function opensInSemesterNumber(courseId, candidateSemesterNumber) {
    return opensInSemester(courseById[courseId], candidateSemesterNumber);
  }

  function savePlan(nextSemesterNumber, nextPickedIds) {
    setSemesterNumber(nextSemesterNumber);
    setStoredPickedIds(nextPickedIds);
    storePlan(versionId, nextSemesterNumber, nextPickedIds);
  }

  function togglePlanning() {
    setIsPlanning(!isPlanning);
  }

  function chooseSemester(nextSemesterNumber) {
    if (!Number.isInteger(nextSemesterNumber) || nextSemesterNumber < 1) return;
    const nextPickedIds = new Set(
      [...pickedIds].filter((courseId) =>
        opensInSemesterNumber(courseId, nextSemesterNumber),
      ),
    );
    savePlan(nextSemesterNumber, nextPickedIds);
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
    savePlan(semesterNumber, next);
  }

  function areAllPicked(courseIds) {
    return courseIds.every((courseId) => pickedIds.has(courseId));
  }

  function toggleColumnPicks(courseIds) {
    const next = new Set(pickedIds);
    if (areAllPicked(courseIds)) courseIds.forEach((id) => next.delete(id));
    else courseIds.forEach((id) => next.add(id));
    savePlan(semesterNumber, next);
  }

  const pickedCredits = [...pickedIds].reduce(
    (total, courseId) => total + courseById[courseId].sct,
    0,
  );

  return {
    isPlanning,
    togglePlanning,
    semesterNumber,
    chooseSemester,
    opensThisSemester,
    columnOpens,
    pickedIds,
    plannedCount: pickedIds.size,
    togglePick,
    areAllPicked,
    toggleColumnPicks,
    pickedCredits,
  };
}
