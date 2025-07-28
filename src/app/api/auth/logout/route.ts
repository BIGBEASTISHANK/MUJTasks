import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the token before logout (basic security)
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      // Token is invalid, but we'll still clear the cookie
      console.warn("Invalid token during logout:", error);
    }

    // Create response with success message
    const response = NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );

    // Clear the cookie properly with all security flags
    response.cookies.set("adminToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Immediately expire the cookie
      expires: new Date(0), // Set expiry to past date
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    
    // Still try to clear the cookie even if there's an error
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );

    response.cookies.set("adminToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  }
}
