const Issue = require("../models/Issue");
const User = require("../models/User");
const classifyIssue = require("../utils/classifyIssue");
const getPriority = require("../utils/priorityEngine");
const getDepartment = require("../utils/departmentMapper");
const weightedSimilarity = require("../utils/similarityChecker");

// Threshold above which two issues are considered duplicates
const SIMILARITY_THRESHOLD = 0.5;

const createIssue = async (req, res) => {
  try {
    const { title, description, imageUrl, block, invitedEmails } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (description.trim().length > 500) {
      return res.status(400).json({ message: "Description must be under 500 characters" });
    }
    if (!block || !block.trim()) {
      return res.status(400).json({ message: "Block / Location is required" });
    }

    // Rate-limit: max 3 issues per user per day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayCount = await Issue.countDocuments({
      createdBy: req.user._id,
      createdAt: { $gte: startOfDay }
    });

    if (todayCount >= 3) {
      return res.status(429).json({ message: "Limit exceeded: Max 3 issues per day per user" });
    }

    // Classify the issue using the new utils
    const category = classifyIssue(description);
    const priority = getPriority(category, description);
    const department = getDepartment(category);

    // Duplicate / similarity detection using weightedSimilarity
    const existingIssues = await Issue.find({
      status: { $in: ["Pending", "Assigned", "Accepted"] }
    });

    let duplicate = null;
    for (const issue of existingIssues) {
      const score = weightedSimilarity(
        { location: block, category, description },
        { location: issue.block, category: issue.category, description: issue.description }
      );
      if (score >= SIMILARITY_THRESHOLD) {
        duplicate = issue;
        break;
      }
    }

    if (duplicate) {
      if (!duplicate.reportedBy.includes(req.user._id)) {
        duplicate.reportedBy.push(req.user._id);
        duplicate.duplicateCount += 1;
        await duplicate.save();
      }
      return res.status(200).json({
        message: "Issue merged with existing duplicate",
        issue: duplicate
      });
    }

    // Resolve invited student IDs from emails
    let invitedStudents = [];
    if (invitedEmails && Array.isArray(invitedEmails) && invitedEmails.length > 0) {
      const users = await User.find({ email: { $in: invitedEmails } });
      invitedStudents = users.map((u) => u._id);
    }

    const issue = await Issue.create({
      title,
      description,
      imageUrl: imageUrl || "",
      block: block || "",
      category,
      department,
      priority,
      createdBy: req.user._id,
      reportedBy: [req.user._id],
      invitedStudents,
      timeline: [{ status: "Pending", timestamp: new Date() }]
    });

    return res.status(201).json(issue);
  } catch (error) {
    console.error("createIssue error:", error);
    return res.status(500).json({ message: "Failed to create issue" });
  }
};

const getIssues = async (req, res) => {
  try {
    let issues = [];
    if (req.user.role === "admin") {
      issues = await Issue.find().populate("createdBy", "name email role");
    } else if (req.user.role === "staff") {
      issues = await Issue.find({ department: req.user.department }).populate(
        "createdBy",
        "name email role"
      );
    } else {
      issues = await Issue.find({
        $or: [
          { createdBy: req.user._id },
          { groupMembers: req.user._id },
          { reportedBy: req.user._id },
          { invitedStudents: req.user._id }
        ]
      }).populate("createdBy", "name email role");
    }
    return res.json(issues);
  } catch (error) {
    console.error("getIssues error:", error);
    return res.status(500).json({ message: "Failed to fetch issues" });
  }
};

const joinIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (!issue.invitedStudents.includes(req.user._id)) {
      return res.status(403).json({ message: "You are not invited to join this issue" });
    }

    if (
      !issue.groupMembers.includes(req.user._id) &&
      !issue.reportedBy.includes(req.user._id)
    ) {
      issue.groupMembers.push(req.user._id);
      issue.duplicateCount += 1;
      await issue.save();
    }
    return res.json(issue);
  } catch (err) {
    console.error("joinIssue error:", err);
    return res.status(500).json({ message: "Failed to join issue" });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { status, deadline } = req.body;
    const validStatuses = ["Pending", "Assigned", "Accepted", "Resolved", "Overdue"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (
      req.user.role !== "admin" &&
      req.user.role !== "staff" &&
      issue.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to update this issue" });
    }

    if (status && issue.status !== status) {
      issue.status = status;
      issue.timeline.push({ status, timestamp: new Date() });

      if (status === "Assigned") {
        issue.assignedAt = new Date();
        if (deadline) issue.deadline = deadline;
      } else if (status === "Accepted") {
        issue.acceptedAt = new Date();
      } else if (status === "Resolved") {
        issue.resolvedAt = new Date();
      }
    }

    await issue.save();
    return res.json(issue);
  } catch (error) {
    console.error("updateIssueStatus error:", error);
    return res.status(500).json({ message: "Failed to update issue status" });
  }
};

module.exports = { createIssue, getIssues, updateIssueStatus, joinIssue };
