import { dbConnect } from "@/lib/db/mongoose";
import EmployeeDetails from "@/lib/models/EmployeeDetails";
import { GetTaskDisplayName, TaskType } from "@/Utility/TaskTypes";
import { MailtrapClient } from "mailtrap";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { type, TOKEN } = await req.json();

        // Validate input type
        if (typeof type !== "number" || ![1, 2].includes(type)) {
            return NextResponse.json(
                { error: "Invalid or missing task type" },
                { status: 400 }
            );
        }

        if (!TOKEN || TOKEN != (process.env.MAILTRAP_TOKEN as string)) {
            console.error("Unauthorized access to NotifyEmployee API");
            return NextResponse.json(
                { error: "Unauthorized access to NotifyEmployee API" },
                { status: 401 }
            );
        }

        const client = new MailtrapClient({ token: TOKEN });
        const sender = {
            email: "mujtasks@bigbeastishank.com",
            name: "MUJTasks",
        };

        // Connect to DB and get emails
        await dbConnect();

        const employeeEmail = await EmployeeDetails.find(
            { task: type },
            { email: 1, _id: 0 }
        );

        if (!employeeEmail.length) {
            console.warn("No employees found for task type:", type);
            return NextResponse.json(
                { message: "No employees found to notify" },
                { status: 200 }
            );
        }

        const recipients = employeeEmail.map((emp) => ({
            email: emp.email,
        }));

        // Send email with async await and error handling
        try {
            const result = await client.send({
                from: sender,
                to: [{ email: sender.email }],
                bcc: recipients,
                subject: `New ${GetTaskDisplayName(type)} just submitted`,
                html: `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                          <h2 style="color: #0070f3;">New ${GetTaskDisplayName(
                              type
                          )} Submission Received!</h2>
                          <p>Hello,</p>
                          <p>We have received a new <strong>${GetTaskDisplayName(
                              type
                          )}</strong> submission.</p>
                          <p>
                            Please visit
                            <a href="https://mujtasks.vercel.app/employee" style="color: #0070f3; text-decoration: none;">
                              MUJTasks Employee Portal
                            </a>
                            to review the submission.
                          </p>
                          <br />
                          <p>Thank you,<br/>MUJTasks Team</p>
                          <hr />
                          <small style="color: #999;">
                            This is an automated notification email, please do not reply.
                          </small>
                        </div>
                      `,
            });
            console.log("Email sent successfully:", result);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            return NextResponse.json(
                { error: "Failed to send notification email" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Notification email sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("API POST error:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
