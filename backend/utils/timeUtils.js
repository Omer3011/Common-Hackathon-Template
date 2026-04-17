// utils/timeUtils.js

function formatDate(date = new Date()) {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function minutesAgo(oldDate) {
  const now = new Date();
  const previous = new Date(oldDate);
  const diff = now - previous;

  return Math.floor(diff / 60000);
}

function hoursAgo(oldDate) {
  const now = new Date();
  const previous = new Date(oldDate);
  const diff = now - previous;

  return Math.floor(diff / 3600000);
}

module.exports = {
  formatDate,
  minutesAgo,
  hoursAgo
};
