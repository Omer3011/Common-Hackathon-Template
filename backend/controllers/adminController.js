const Issue = require("../models/Issue");

const assignIssue = async (req, res) => {
  try {
    const { assignedTo, deadline } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ message: "assignedTo is required" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.assignedTo = assignedTo;
    issue.status = "Assigned";
    issue.assignedAt = new Date();
    if (deadline) {
      issue.deadline = deadline;
    }
    issue.timeline.push({ status: "Assigned", timestamp: new Date() });
    
    await issue.save();

    return res.json(issue);
  } catch (error) {
    return res.status(500).json({ message: "Failed to assign issue" });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const issues = await Issue.find();

    const depts = {};
    const blocksMap = {};
    let totalIssues = issues.length;

    issues.forEach(iss => {
      // blocks
      if (iss.block) {
        blocksMap[iss.block] = (blocksMap[iss.block] || 0) + 1;
      }
      
      // depts
      const d = iss.department || "Other";
      if (!depts[d]) {
        depts[d] = { count: 0, respTimeSum: 0, respTimeItems: 0, resTimeSum: 0, resTimeItems: 0 };
      }
      depts[d].count++;

      if (iss.assignedAt && iss.acceptedAt) {
        depts[d].respTimeSum += (iss.acceptedAt - iss.assignedAt);
        depts[d].respTimeItems++;
      }
      if (iss.assignedAt && iss.resolvedAt) {
        depts[d].resTimeSum += (iss.resolvedAt - iss.assignedAt);
        depts[d].resTimeItems++;
      }
    });

    const departmentStats = Object.keys(depts).map(d => {
      const stats = depts[d];
      return {
        department: d,
        count: stats.count,
        avgResponseHours: stats.respTimeItems ? (stats.respTimeSum / stats.respTimeItems) / (1000 * 60 * 60) : 0,
        avgResolutionHours: stats.resTimeItems ? (stats.resTimeSum / stats.resTimeItems) / (1000 * 60 * 60) : 0,
      }
    });

    return res.json({
      totalIssues,
      departmentStats,
      blocks: Object.keys(blocksMap).map(k => ({ block: k, count: blocksMap[k] }))
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load analytics" });
  }
}

module.exports = { assignIssue, getAnalytics };
