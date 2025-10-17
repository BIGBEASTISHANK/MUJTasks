import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/db/mongoose";
import EmployeeDetails from "@/lib/models/EmployeeDetails";
import { isDisabled } from "@@/data/GlobalVar";

export async function GET(req: NextRequest) {
    try {
        // Checking if is disabled
        if (isDisabled)
            return NextResponse.json(
                { error: "API is disabled by owner" },
                { status: 401 }
            );

        // Check if JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Get token from cookies
        const token = req.cookies.get("rootAdminToken")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
            isRootAdmin: boolean;
        };

        // Validate user ID
        if (!decoded.isRootAdmin) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find employee and exclude password
        const employeeDetails = await EmployeeDetails.find();

        // Check if employee exists
        if (!employeeDetails) {
            return NextResponse.json(
                { error: "No employee found" },
                { status: 401 }
            );
        }

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: "Admin verified successfully",
                employeeData: employeeDetails,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Auth verification error:", error);

        let statusCode = 500;
        let message = "Internal server error";

        // Handle JWT specific errors
        if (error instanceof jwt.JsonWebTokenError) {
            statusCode = 401;
            message = "Invalid token";
        } else if (error instanceof jwt.TokenExpiredError) {
            statusCode = 401;
            message = "Token expired";
        }

        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
