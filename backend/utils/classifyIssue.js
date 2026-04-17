// utils/classifyIssue.js

const KEYWORDS = {
  plumbing: [
    "water leak",
    "leakage",
    "tap broken",
    "pipe burst",
    "flush not working",
    "toilet issue",
    "washroom problem",
    "drain blocked"
  ],
  electrical: [
    "light not working",
    "fan not working",
    "power cut",
    "switch broken",
    "wire spark",
    "socket issue",
    "fuse blown",
    "short circuit"
  ],
  cleanliness: [
    "garbage",
    "dirty",
    "unclean",
    "bad smell",
    "dustbin full",
    "washroom dirty",
    "trash"
  ],
  internet: [
    "wifi down",
    "internet not working",
    "slow wifi",
    "router issue",
    "network problem",
    "no internet"
  ],
  furniture: [
    "chair broken",
    "desk broken",
    "bench damaged",
    "door broken",
    "window broken",
    "table broken"
  ]
};

function classifyIssue(text = "") {
  const message = text.toLowerCase();

  for (const category in KEYWORDS) {
    for (const keyword of KEYWORDS[category]) {
      if (message.includes(keyword)) {
        return category;
      }
    }
  }

  return "general";
}

module.exports = classifyIssue;
