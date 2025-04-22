import { NextResponse } from "next/server";
import { google } from "googleapis";
import mime from "mime";
import { Readable } from "stream";
import { dbConnect } from "@/lib/db/mongoose";
import ProjectAssistanceFormSubmission from "@/lib/models/ProjectAssistanceFormSubmission";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const branch = formData.get("branch") as string;
    const mobile = formData.get("mobile") as string;
    const projectTitle = formData.get("projectTitle") as string;
    const projectType = formData.get("projectType") as string;
    const deadline = formData.get("deadline") as string;
    const file = formData.get("file") as File;

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!branch) return NextResponse.json({ error: "Branch is required" }, { status: 400 });
    if (!mobile) return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
    if (!projectTitle) return NextResponse.json({ error: "Project Title is required" }, { status: 400 });
    if (!projectType) return NextResponse.json({ error: "Project Type is required" }, { status: 400 });
    if (!deadline) return NextResponse.json({ error: "Deadline is required" }, { status: 400 });
    if (!file) return NextResponse.json({ error: "File is required" }, { status: 400 });

    const folderId = process.env.PROJECTASSISTANCE_GDRIVE_SHARED_DRIVE_ID;
    if (!folderId) {
      return NextResponse.json(
        { error: "Server configuration error: Google Drive folder ID not configured" },
        { status: 500 }
      );
    }

    const fileLink = await uploadFileToDrive(folderId, file);

    const submissionData = {
      name,
      branch,
      mobile,
      projectTitle,
      projectType,
      deadline,
      fileLink: fileLink.webViewLink,
    };

    const submission = await ProjectAssistanceFormSubmission.create(submissionData);

    return NextResponse.json({
      status: 200,
      message: "Submission saved successfully",
      fileLink: fileLink.webViewLink,
      submissionId: submission._id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process submission",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

const authenticateGoogle = () => {
  const privateKey = process.env.GDRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n');
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

const uploadFileToDrive = async (folderId: string, file: File) => {
  const auth = authenticateGoogle();
  const drive = google.drive({ version: "v3", auth });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = file.type || mime.getType(file.name) || 'application/pdf';

  const fileMetadata = {
    name: file.name,
    parents: [folderId],
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: mimeType,
      body: Readable.from(buffer),
    },
    fields: "id",
  });

  const fileLink = await drive.files.get({
    fileId: response.data.id!,
    fields: "webViewLink",
  });

  return fileLink.data;
};
