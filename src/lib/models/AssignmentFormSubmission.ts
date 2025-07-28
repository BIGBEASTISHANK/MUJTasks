import mongoose from "mongoose";

// Define the schema
const AssignmentFormSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    branch: {
      type: String,
      required: [true, "Branch name is required"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile Number is required"],
    },
    estimatedPages: {
      type: Number,
      required: [true, "Estimated pages is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    fileLink: {
      type: String,
      required: [true, "File link is required"],
    },
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
    collection: "AssignmentFormSubmissions",
  }
);

// Check if model already exists to prevent model overwrite errors
const AssignmentFormSubmission = 
  mongoose.models.AssignmentFormSubmissions || 
  mongoose.model("AssignmentFormSubmissions", AssignmentFormSubmissionSchema);

export default AssignmentFormSubmission;
