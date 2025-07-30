import { NextRequest, NextResponse } from "next/server";
import EmployeeDetails from "@/lib/models/EmployeeDetails";
import { dbConnect } from "@/lib/db/mongoose";
import mongoose from "mongoose";

export async function PUT(req: NextRequest) {
  try {
    // Verify root admin authentication
    const cookies = req.cookies.toString();

    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/rootadmin/verify`,
      {
        method: "GET",
        headers: {
          Cookie: cookies,
          "Content-Type": "application/json",
        },
      }
    );

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      return NextResponse.json(
        { error: errorData.error },
        { status: verifyResponse.status }
      );
    }

    // Parse request body
    const { id, name, email, mobile, password, task } = await req.json();

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: "All fields (name, email, mobile, password) are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: "Password must be between 8 and 128 characters long" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid employee ID" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if employee exists
    const existingEmployee = await EmployeeDetails.findById(id);
    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Check if email is being changed and if new email already exists
    if (email.toLowerCase() !== existingEmployee.email) {
      const emailExists = await EmployeeDetails.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id }, // Exclude current employee
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Employee with this email already exists" },
          { status: 409 }
        );
      }
    }

    // Update employee (password stored as plain text as requested)
    const updatedEmployee = await EmployeeDetails.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        mobile: mobile.trim(),
        password: password,
        task: task || [],
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run mongoose validators
      }
    );

    return NextResponse.json(
      {
        message: "Employee updated successfully",
        employee: {
          _id: updatedEmployee._id,
          name: updatedEmployee.name,
          email: updatedEmployee.email,
          mobile: updatedEmployee.mobile,
          password: updatedEmployee.password,
          task: updatedEmployee.task,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update employee error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: validationErrors.join(", ") },
        { status: 400 }
      );
    }

    // Handle duplicate key error (email)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Employee with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
