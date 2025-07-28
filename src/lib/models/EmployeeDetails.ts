import mongoose from "mongoose";

const EmployeeDetailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile Number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [128, "Password must be less than 128 characters long"],
    },
    task: {
      type: [Number],
      required: true,
    },
  },
  {
    collection: "EmployeeDetails",
  }
);

const EmployeeDetails =
  mongoose.models.EmployeeDetails ||
  mongoose.model("EmployeeDetails", EmployeeDetailSchema);

export default EmployeeDetails;
