const isSameProject = (teamA, teamB) => {
  if (teamA.type !== teamB.type) return false;

  if (teamA.type === "COURSE") {
    return (
      teamA.course_id.toString() === teamB.course_id.toString() &&
      teamA.slot === teamB.slot &&
      teamA.teacher === teamB.teacher
    );
  }

  if (teamA.type === "CAPSTONE") {
    return (
      teamA.school === teamB.school &&
      teamA.specialization === teamB.specialization
    );
  }

  if (teamA.type === "ECS") {
    return true; // all ECS same category
  }

  return false;
};

module.exports = isSameProject;
