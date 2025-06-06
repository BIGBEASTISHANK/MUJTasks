import { NextResponse } from "next/server";
import { google } from "googleapis";
import mime from "mime";
import { Readable } from "stream";
import { dbConnect } from "@/lib/db/mongoose";
import AssignmentFormSubmission from "@/lib/models/AssignmentFormSubmission";
import { isDisabled } from "@@/data/GlobalVar";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    console.log("API route handler started");

    // Checking if is disabled
    if (isDisabled)
      return NextResponse.json(
        { error: "API is disabled by owner" },
        { status: 401 }
      );

    // Connect to MongoDB
    await dbConnect();
    console.log("Connected to database");

    const formData = await req.formData();
    console.log("Form data received");

    // Log received fields for debugging
    const formFields = Object.fromEntries(formData.entries());
    console.log("Form fields:", {
      ...formFields,
      file: formData.get("file") ? "File received" : "No file received",
    });

    // Get form fields
    const name = formData.get("name") as string;
    const branch = formData.get("branch") as string;
    const mobile = formData.get("mobile") as string;
    const estimatedPages = formData.get("estimatedPages") as string;
    const subject = formData.get("subject") as string;
    const deadline = formData.get("deadline") as string;
    const file = formData.get("file") as File;

    // Validate required fields
    if (!name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!branch)
      return NextResponse.json(
        { error: "Branch is required" },
        { status: 400 }
      );
    if (!mobile)
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      );
    if (!estimatedPages)
      return NextResponse.json(
        { error: "Estimated pages is required" },
        { status: 400 }
      );
    if (!subject)
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 }
      );
    if (!deadline)
      return NextResponse.json(
        { error: "Deadline is required" },
        { status: 400 }
      );
    if (!file)
      return NextResponse.json({ error: "File is required" }, { status: 400 });

    // Get folder ID from environment variables
    const folderId = process.env.ASSIGNMENTFORM_GDRIVE_SHARED_DRIVE_ID;
    if (!folderId) {
      console.error("Google Drive folder ID not configured");
      return NextResponse.json(
        {
          error:
            "Server configuration error: Google Drive folder ID not configured",
        },
        { status: 500 }
      );
    }

    console.log("Uploading file to Google Drive");

    // Upload file to Google Drive
    const fileLink = await uploadFileToDrive(folderId, file);
    console.log("File uploaded successfully:", fileLink);

    // Create data object to save
    const submissionData = {
      name,
      branch,
      mobile,
      estimatedPages: parseInt(estimatedPages, 10),
      subject,
      deadline,
      fileLink: fileLink.webViewLink,
    };

    console.log("Saving submission to database:", submissionData);

    // Create new submission record in MongoDB
    const submission = await AssignmentFormSubmission.create(submissionData);
    console.log("Submission saved with ID:", submission._id);

    return NextResponse.json({
      status: 200,
      message: "Submission saved successfully",
      fileLink: fileLink.webViewLink,
      submissionId: submission._id,
    });
  } catch (error) {
    console.error("Error processing submission:", error);
    return NextResponse.json(
      {
        error: "Failed to process submission",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Google Drive authentication function
const authenticateGoogle = () => {
  const privateKey = process.env.GDRIVE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.GDRIVE_CLIENT_EMAIL;
  const serviceAccountClientId = process.env.GDRIVE_SERVICE_ACCOUNT_CLIENT_ID;

  if (!privateKey || !clientEmail || !serviceAccountClientId) {
    throw new Error("Missing Google Drive API credentials");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      private_key: privateKey,
      client_email: clientEmail,
      client_id: serviceAccountClientId,
    },
    scopes: "https://www.googleapis.com/auth/drive",
  });

  return auth;
};

// Upload file to Google Drive function
const uploadFileToDrive = async (folderId: string, file: File) => {
  const auth = authenticateGoogle();
  const drive = google.drive({ version: "v3", auth });

  // Convert File to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const mimeType = file.type || mime.getType(file.name) || "application/pdf";

  const fileMetadata = {
    name: file.name,
    parents: [folderId],
  };

  console.log("Creating file in Google Drive:", {
    fileName: file.name,
    mimeType,
    folderId,
  });

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: mimeType,
      body: Readable.from(buffer),
    },
    fields: "id",
  });

  console.log("File created with ID:", response.data.id);

  // Get file link
  const fileLink = await drive.files.get({
    fileId: response.data.id!,
    fields: "webViewLink",
  });

  return fileLink.data;
};
