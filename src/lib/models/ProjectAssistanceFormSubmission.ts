import mongoose from "mongoose";

const ProjectAssistanceFormSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    branch: { type: String, required: [true, "Branch is required"] },
    mobile: { type: String, required: [true, "Mobile Number is required"] },
    projectTitle: {
      type: String,
      required: [true, "Project Title is required"],
    },
    projectType: { type: String, required: [true, "Project Type is required"] },
    deadline: { type: Date, required: [true, "Deadline is required"] },
    fileLink: { type: String, required: [true, "File link is required"] },
    assignedTo: {
      type: String,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["pending", "completed", "accepted"],
      default: "pending",
    },
    assignedToId: {
      type: String,
    },
    acceptedOn: {
      type: Date,
      default: null,
    },
    completedOn: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "ProjectAssistanceFormSubmissions",
  }
);

const ProjectAssistanceFormSubmission =
  mongoose.models.ProjectAssistanceFormSubmissions ||
  mongoose.model(
    "ProjectAssistanceFormSubmissions",
    ProjectAssistanceFormSubmissionSchema
  );

export default ProjectAssistanceFormSubmission;
