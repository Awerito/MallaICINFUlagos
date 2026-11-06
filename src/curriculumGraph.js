export function indexCourses(courses) {
  const courseById = {};
  const coursesOpenedBy = {};
  courses.forEach((course) => {
    courseById[course.id] = course;
    coursesOpenedBy[course.id] = [];
  });
  courses.forEach((course) => {
    course.prereqs.forEach((prerequisiteId) => {
      coursesOpenedBy[prerequisiteId].push(course.id);
    });
  });
  return { courseById, coursesOpenedBy };
}

export function allPrerequisitesOf(courseId, courseById, found = new Set()) {
  courseById[courseId].prereqs.forEach((prerequisiteId) => {
    if (!found.has(prerequisiteId)) {
      found.add(prerequisiteId);
      allPrerequisitesOf(prerequisiteId, courseById, found);
    }
  });
  return found;
}

export function allDependentsOf(courseId, coursesOpenedBy, found = new Set()) {
  coursesOpenedBy[courseId].forEach((dependentId) => {
    if (!found.has(dependentId)) {
      found.add(dependentId);
      allDependentsOf(dependentId, coursesOpenedBy, found);
    }
  });
  return found;
}

export function hasAllPrerequisitesApproved(courseId, courseById, approvedIds) {
  return courseById[courseId].prereqs.every((prerequisiteId) =>
    approvedIds.has(prerequisiteId),
  );
}

export function approveWithPrerequisites(approvedIds, courseId, courseById) {
  const next = new Set(approvedIds);
  next.add(courseId);
  allPrerequisitesOf(courseId, courseById).forEach((prerequisiteId) =>
    next.add(prerequisiteId),
  );
  return next;
}

export function unapproveWithDependents(
  approvedIds,
  courseId,
  coursesOpenedBy,
) {
  const next = new Set(approvedIds);
  next.delete(courseId);
  allDependentsOf(courseId, coursesOpenedBy).forEach((dependentId) =>
    next.delete(dependentId),
  );
  return next;
}

export function approveThroughSemester(approvedIds, courses, semesterNumber) {
  const next = new Set(approvedIds);
  courses
    .filter((course) => course.semester <= semesterNumber)
    .forEach((course) => next.add(course.id));
  return next;
}

export function unapproveFromSemester(approvedIds, courses, semesterNumber) {
  const next = new Set(approvedIds);
  courses
    .filter((course) => course.semester >= semesterNumber)
    .forEach((course) => next.delete(course.id));
  return next;
}

export function isDirectlyConnected(
  courseId,
  pinnedIds,
  courseById,
  coursesOpenedBy,
) {
  return pinnedIds.some(
    (pinnedId) =>
      coursesOpenedBy[pinnedId].includes(courseId) ||
      courseById[courseId].prereqs.includes(pinnedId),
  );
}

export function columnOpensInSemester(columnNumber, semesterNumber) {
  return columnNumber % 2 === semesterNumber % 2;
}

export function opensInSemester(course, semesterNumber) {
  if (course.offered === "A") return true;
  const offeredInOddSemesters = course.offered === "I";
  return offeredInOddSemesters === (semesterNumber % 2 === 1);
}
