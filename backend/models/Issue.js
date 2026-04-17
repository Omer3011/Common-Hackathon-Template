const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["electrical", "plumbing", "cleanliness", "internet", "furniture", "general"],
      default: "general",
    },
    department: {
      type: String,
      enum: ["Maintenance", "Electrical Team", "Housekeeping", "IT Support", "Carpentry", "Admin Office"],
      default: "Admin Office"
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "Accepted", "Resolved", "Overdue"],
      default: "Pending",
    },
    assignedTo: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    duplicateCount: {
      type: Number,
      default: 1,
    },
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    invitedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    block: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    timeline: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    assignedAt: { type: Date },
    acceptedAt: { type: Date },
    resolvedAt: { type: Date },
    deadline: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
