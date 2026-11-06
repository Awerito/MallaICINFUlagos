import { useState } from "react";
import { allPrerequisitesOf, isDirectlyConnected } from "./curriculumGraph";

export function useCourseFocus(courseById, coursesOpenedBy) {
  const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const [pinnedCourseIds, setPinnedCourseIds] = useState([]);

  const originIds =
    hoveredCourseId && !pinnedCourseIds.includes(hoveredCourseId)
      ? [...pinnedCourseIds, hoveredCourseId]
      : pinnedCourseIds;

  const neededIds = new Set();
  const openedIds = new Set();
  originIds.forEach((originId) => {
    allPrerequisitesOf(originId, courseById).forEach((prerequisiteId) =>
      neededIds.add(prerequisiteId),
    );
    coursesOpenedBy[originId].forEach((openedId) => openedIds.add(openedId));
  });

  const arrows = originIds.flatMap((originId) =>
    coursesOpenedBy[originId].map((openedId) => ({
      fromId: originId,
      toId: openedId,
      isPreview: !pinnedCourseIds.includes(originId),
    })),
  );

  function focusRoleOf(courseId) {
    if (originIds.length === 0) return null;
    if (originIds.includes(courseId)) return "origin";
    if (neededIds.has(courseId)) return "needs";
    if (openedIds.has(courseId)) return "opens";
    return "dimmed";
  }

  function selectCourse(courseId) {
    if (pinnedCourseIds.includes(courseId)) {
      setPinnedCourseIds(pinnedCourseIds.filter((id) => id !== courseId));
    } else if (
      pinnedCourseIds.length === 0 ||
      isDirectlyConnected(
        courseId,
        pinnedCourseIds,
        courseById,
        coursesOpenedBy,
      )
    ) {
      setPinnedCourseIds([...pinnedCourseIds, courseId]);
    } else {
      setPinnedCourseIds([courseId]);
    }
  }

  function clearPinnedCourses() {
    setPinnedCourseIds([]);
  }

  return {
    pinnedCourseIds,
    arrows,
    focusRoleOf,
    hoverCourse: setHoveredCourseId,
    selectCourse,
    clearPinnedCourses,
  };
}
