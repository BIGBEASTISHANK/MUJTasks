import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { isDisabled } from "@@/data/GlobalVar";

export async function POST(req: NextRequest) {
    try {
        // Checking if is disabled
        if (isDisabled)
            return NextResponse.json(
                { error: "API is disabled by owner" },
                { status: 401 }
            );

        // Variables
        let email: string;
        let password: string;

        // Parse request body with error handling
        try {
            const body = await req.json();
            email = body.email;
            password = body.password;
        } catch (parseError) {
            return NextResponse.json(
                { error: "Invalid JSON in request body" },
                { status: 400 }
            );
        }

        const rootAdminEmail = process.env.ROOT_ADMIN_EMAIL as string;
        const rootAdminPassword = process.env.ROOT_ADMIN_PASS as string;
        const jwtSecret = process.env.JWT_SECRET as string;

        // Check if environment variables are set
        if (!rootAdminEmail || !rootAdminPassword || !jwtSecret) {
            console.error("Missing required environment variables");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Check if email and password are provided
        if (!email || !password) {
            return NextResponse.json(
                { error: "Please provide email and password" },
                { status: 400 }
            );
        }

        // Validate input types
        if (typeof email !== "string" || typeof password !== "string") {
            return NextResponse.json(
                { error: "Email and password must be strings" },
                { status: 400 }
            );
        }

        // Check if email and password match
        if (email !== rootAdminEmail || password !== rootAdminPassword) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Sign the token with error handling
        let token: string;
        try {
            token = jwt.sign({ isRootAdmin: true }, jwtSecret, {
                expiresIn: "30d",
            });
        } catch (jwtError) {
            console.error("JWT signing error:", jwtError);
            return NextResponse.json(
                { error: "Failed to generate authentication token" },
                { status: 500 }
            );
        }

        // Create response
        const returnResponse = NextResponse.json(
            { success: "Login successful" },
            { status: 200 }
        );

        // Set cookie with error handling
        try {
            returnResponse.cookies.set("rootAdminToken", token, {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 30,
            });
        } catch (cookieError) {
            console.error("Cookie setting error:", cookieError);
            return NextResponse.json(
                { error: "Failed to set authentication cookie" },
                { status: 500 }
            );
        }

        return returnResponse;
    } catch (error) {
        // Catch any unexpected errors
        console.error("Unexpected error in login route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
