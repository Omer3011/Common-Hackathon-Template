// utils/validationUtils.js

function validateComplaint(data = {}) {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!data.location || data.location.trim() === "") {
    errors.push("Location is required");
  }

  if (!data.description || data.description.trim() === "") {
    errors.push("Description is required");
  }

  if (
    data.description &&
    data.description.trim().length > 500
  ) {
    errors.push("Description must be under 500 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = validateComplaint;
