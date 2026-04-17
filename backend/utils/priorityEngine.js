// utils/priorityEngine.js

function getPriority(issueType = "", description = "") {
  const text = description.toLowerCase();

  const urgentWords = [
    "fire",
    "shock",
    "sparking",
    "flood",
    "smoke",
    "danger",
    "burst",
    "emergency"
  ];

  for (const word of urgentWords) {
    if (text.includes(word)) {
      return "High";
    }
  }

  if (
    issueType === "electrical" ||
    issueType === "plumbing" ||
    issueType === "internet"
  ) {
    return "Medium";
  }

  return "Low";
}

module.exports = getPriority;
