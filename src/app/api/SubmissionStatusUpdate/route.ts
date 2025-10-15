import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/mongoose";
import ProjectAssistanceFormSubmission from "@/lib/models/ProjectAssistanceFormSubmission";
import AssignmentFormSubmission from "@/lib/models/AssignmentFormSubmission";
import EmployeeDetails from "@/lib/models/EmployeeDetails";

export async function PUT(req: NextRequest) {
  try {
    // Verify employee authentication using existing endpoint
    const cookies = req.cookies.toString();

    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/employee/verify`,
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

    const data = await req.json();
    console.log("AssignSubmission request received:", data);

    const { submissionId, employeeId, chargedPrice, action } = data;

    // Validate required fields
    if (!submissionId) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    if (chargedPrice < 1 || chargedPrice == null) {
      return NextResponse.json(
        { error: "Charged Price is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the employee to get their name
    const employee = await EmployeeDetails.findById(employeeId).select("name");
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Determine which model to use and what status to set
    let SubmissionModel: any;
    let updateData: any = {};
    let successMessage = "";

    // Try to find the submission in both collections
    let submission = await AssignmentFormSubmission.findById(submissionId);
    if (submission) {
      SubmissionModel = AssignmentFormSubmission;
    } else {
      submission = await ProjectAssistanceFormSubmission.findById(submissionId);
      if (submission) {
        SubmissionModel = ProjectAssistanceFormSubmission;
      }
    }

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found in any collection" },
        { status: 404 }
      );
    }

    // Handle different actions
    switch (action) {
      case "accept":
        updateData = {
          assignedToId: employeeId,
          assignedTo: employee.name,
          status: "accepted",
          acceptedOn: new Date(), // Set accepted date
        };
        successMessage = "Submission assigned and accepted successfully";
        break;

      case "complete":
        // Check if the submission is assigned to the current employee
        if (submission.assignedToId !== employeeId) {
          return NextResponse.json(
            { error: "You can only complete submissions assigned to you" },
            { status: 403 }
          );
        }
        updateData = {
          status: "completed",
          chargedPrice: chargedPrice,
          completedOn: new Date(), // Set completed date
        };
        successMessage = "Submission marked as completed successfully";
        break;

      default:
        // Default behavior (for backward compatibility)
        updateData = {
          assignedToId: employeeId,
          assignedTo: employee.name,
          status: "accepted",
          acceptedOn: new Date(), // Set accepted date
        };
        successMessage = "Submission assigned and accepted successfully";
    }

    // Update the submission
    const updatedSubmission = await SubmissionModel.findByIdAndUpdate(
      submissionId,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validations
      }
    );

    if (!updatedSubmission) {
      return NextResponse.json(
        { error: "Failed to update submission" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
        submission: updatedSubmission,
        assignedEmployee: {
          id: employeeId,
          name: employee.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing submission:", error);
    return NextResponse.json(
      {
        error: "Failed to process submission",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
