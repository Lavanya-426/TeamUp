function normalize(value) {
  return value?.toString().trim().toUpperCase();
}

function buildScope(req, res, next) {
  const team = req.body;
  console.log(team);
  if (team.type === "COURSE") {
    const { course_code, teacher, slot } = team.course;

    if (!course_code || !teacher || !slot) {
      throw new Error("Invalid course data for scope");
    }

    req.body.scope = `COURSE:${normalize(course_code)}:${normalize(teacher)}:${normalize(slot)}`;
  }

  // ECS / CAPSTONE
  else req.body.scope = normalize(team.type);
  console.log(req.body);
  next();
}

module.exports = buildScope;
