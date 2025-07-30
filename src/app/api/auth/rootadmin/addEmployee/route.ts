import { NextRequest, NextResponse } from "next/server";
import EmployeeDetails from "@/lib/models/EmployeeDetails";
import { dbConnect } from "@/lib/db/mongoose";

export async function POST(req: NextRequest) {
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
    const { name, email, mobile, password, task } = await req.json();

    // Validate required fields
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

    // Connect to database
    await dbConnect();

    // Check if employee with this email already exists
    const existingEmployee = await EmployeeDetails.findOne({
      email: email.toLowerCase(),
    });
    if (existingEmployee) {
      return NextResponse.json(
        { error: "Employee with this email already exists" },
        { status: 409 }
      );
    }

    // Create new employee (password stored as plain text as requested)
    const newEmployee = new EmployeeDetails({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password: password, // Storing password as plain text
      task: task || [],
    });

    // Save to database
    const savedEmployee = await newEmployee.save();

    return NextResponse.json(
      {
        message: "Employee added successfully",
        employee: {
          _id: savedEmployee._id,
          name: savedEmployee.name,
          email: savedEmployee.email,
          mobile: savedEmployee.mobile,
          password: savedEmployee.password,
          task: savedEmployee.task,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Add employee error:", error);

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
