// utils/departmentMapper.js

const DEPARTMENT_MAP = {
  plumbing: "Maintenance",
  electrical: "Electrical Team",
  cleanliness: "Housekeeping",
  internet: "IT Support",
  furniture: "Carpentry",
  general: "Admin Office"
};

function getDepartment(issueType = "") {
  return DEPARTMENT_MAP[issueType] || "Admin Office";
}

module.exports = getDepartment;
