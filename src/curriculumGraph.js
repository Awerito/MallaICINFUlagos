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
