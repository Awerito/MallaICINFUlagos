import { useEffect, useMemo, useState } from "react";
import {
  indexCourses,
  approveWithPrerequisites,
  unapproveWithDependents,
  approveThroughSemester,
  unapproveFromSemester,
} from "./curriculumGraph";

const storageKeyFor = (versionId) => `icinf-curriculum/approved/${versionId}`;

function readStoredApprovedIds(versionId) {
  try {
    return new Set(
      JSON.parse(localStorage.getItem(storageKeyFor(versionId))) ?? [],
    );
  } catch {
    return new Set();
  }
}

function storeApprovedIds(versionId, approvedIds) {
  try {
    localStorage.setItem(
      storageKeyFor(versionId),
      JSON.stringify([...approvedIds]),
    );
  } catch {
    // storage unavailable: the state still lives in memory for this session
  }
}

export function useApprovedCourses(versionId, courses) {
  const [approvedIds, setApprovedIds] = useState(() =>
    readStoredApprovedIds(versionId),
  );
  const { courseById, coursesOpenedBy } = useMemo(
    () => indexCourses(courses),
    [courses],
  );

  useEffect(() => {
    setApprovedIds(readStoredApprovedIds(versionId));
  }, [versionId]);

  function toggleCourse(courseId) {
    const next = approvedIds.has(courseId)
      ? unapproveWithDependents(approvedIds, courseId, coursesOpenedBy)
      : approveWithPrerequisites(approvedIds, courseId, courseById);
    setApprovedIds(next);
    storeApprovedIds(versionId, next);
  }

  function isSemesterFullyApproved(semesterNumber) {
    return courses
      .filter((course) => course.semester <= semesterNumber)
      .every((course) => approvedIds.has(course.id));
  }

  function toggleSemester(semesterNumber) {
    const next = isSemesterFullyApproved(semesterNumber)
      ? unapproveFromSemester(approvedIds, courses, semesterNumber)
      : approveThroughSemester(approvedIds, courses, semesterNumber);
    setApprovedIds(next);
    storeApprovedIds(versionId, next);
  }

  return {
    approvedIds,
    courseById,
    toggleCourse,
    isSemesterFullyApproved,
    toggleSemester,
  };
}
