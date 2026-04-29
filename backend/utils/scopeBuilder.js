const User = require("../models/User");

function normalize(value) {
  return value?.toString().trim().toUpperCase();
}

async function buildScope(req, res, next) {
  try {
    const team = req.body;

    if (!team || !team.type) {
      throw new Error("Team type is required");
    }

    //  COURSE
    if (team.type === "COURSE") {
      const { course_code, teacher, slot } = team.course || {};

      if (!course_code || !teacher || !slot) {
        throw new Error("Invalid course data for scope");
      }

      req.body.scope = `COURSE:${normalize(course_code)}:${normalize(
        teacher,
      )}:${normalize(slot)}`;
    }

    //  CAPSTONE
    else if (team.type === "CAPSTONE") {
      let specialization = req.userInfo?.specialization;

      // fallback if not attached earlier
      if (!specialization) {
        const userId = req.userInfo?.id;

        if (!userId) {
          throw new Error("User not authenticated");
        }

        const user = await User.findById(userId).select("specialization");

        specialization = user?.specialization;
      }

      if (!specialization) {
        throw new Error("User specialization not found");
      }

      req.body.scope = `CAPSTONE:${normalize(specialization)}`;
    }

    // ECS1 & ECS2
    else {
      req.body.scope = normalize(team.type);
    }

    console.log("Final Scope:", req.body.scope);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = buildScope;
