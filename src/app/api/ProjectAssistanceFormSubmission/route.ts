import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import mime from "mime";
import { Readable } from "stream";
import { dbConnect } from "@/lib/db/mongoose";
import ProjectAssistanceFormSubmission from "@/lib/models/ProjectAssistanceFormSubmission";
import { isDisabled } from "@@/data/GlobalVar";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    console.log("API route handler started");

    // Checking if is disabled
    if (isDisabled)
      return NextResponse.json(
        { error: "API is disabled by owner" },
        { status: 401 },
      );

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const branch = formData.get("branch") as string;
    const mobile = formData.get("mobile") as string;
    const projectTitle = formData.get("projectTitle") as string;
    const projectType = formData.get("projectType") as string;
    const deadline = formData.get("deadline") as string;
    const fileLink = formData.get("fileLink") as string;

    if (!name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!branch)
      return NextResponse.json(
        { error: "Branch is required" },
        { status: 400 },
      );
    if (!mobile)
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 },
      );
    if (!projectTitle)
      return NextResponse.json(
        { error: "Project Title is required" },
        { status: 400 },
      );
    if (!projectType)
      return NextResponse.json(
        { error: "Project Type is required" },
        { status: 400 },
      );
    if (!deadline)
      return NextResponse.json(
        { error: "Deadline is required" },
        { status: 400 },
      );
    if (!fileLink)
      return NextResponse.json({ error: "File is required" }, { status: 400 });

    const submissionData = {
      name,
      branch,
      mobile,
      projectTitle,
      projectType,
      deadline,
      fileLink,
    };

    await dbConnect();
    const submission =
      await ProjectAssistanceFormSubmission.create(submissionData);

    // Notifying employees
    try {
      const NotifyEmployee = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/NotifyEmployee`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: 2,
            TOKEN: process.env.MAILTRAP_TOKEN as string,
          }),
        },
      );
      if (!NotifyEmployee.ok) {
        console.error("NotifyEmployee API failed", await NotifyEmployee.text());
      }
    } catch (error) {
      console.error("Fetch NotifyEmployee failed", error);
    }

    return NextResponse.json({
      status: 200,
      message: "Submission saved successfully",
      submissionId: submission._id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process submission",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verify employee authentication
    const cookies = req.cookies.toString();

    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/employee/verify`,
      {
        method: "GET",
        headers: {
          Cookie: cookies,
          "Content-Type": "application/json",
        },
      },
    );

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      return NextResponse.json(
        { error: errorData.error },
        { status: errorData.status },
      );
    }

    // Connect to database
    await dbConnect();

    // Fetch submissions
    const submissions = await ProjectAssistanceFormSubmission.find();

    if (!submissions)
      return NextResponse.json(
        { error: "No submissions found" },
        { status: 404 },
      );

    // Returning submission
    return NextResponse.json({ submissions: submissions }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
