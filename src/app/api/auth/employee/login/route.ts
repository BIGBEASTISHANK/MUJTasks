import EmployeeDetails from "@/lib/models/EmployeeDetails";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/db/mongoose";
import { isDisabled } from "@@/data/GlobalVar";

export async function POST(req: NextRequest) {
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

        // Get request body
        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find employee by email
        const employee = await EmployeeDetails.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!employee) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Compare plain text password
        const isPasswordValid = password === employee.password;

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: employee._id.toString(),
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: "Login successful",
                user: {
                    id: employee._id,
                    email: employee.email,
                    name: employee.name,
                    role: employee.role,
                },
            },
            { status: 200 }
        );

        // Set secure HTTP-only cookie
        response.cookies.set("employeeToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
