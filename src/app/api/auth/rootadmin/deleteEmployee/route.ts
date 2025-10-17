import { NextRequest, NextResponse } from "next/server";
import EmployeeDetails from "@/lib/models/EmployeeDetails";
import { dbConnect } from "@/lib/db/mongoose";
import mongoose from "mongoose";
import { isDisabled } from "@@/data/GlobalVar";

export async function DELETE(req: NextRequest) {
    try {
        // Checking if is disabled
        if (isDisabled)
            return NextResponse.json(
                { error: "API is disabled by owner" },
                { status: 401 }
            );

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
        const { id } = await req.json();

        // Validate required fields
        if (!id) {
            return NextResponse.json(
                { error: "Employee ID is required" },
                { status: 400 }
            );
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid employee ID" },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Check if employee exists
        const existingEmployee = await EmployeeDetails.findById(id);
        if (!existingEmployee) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        // Delete employee
        const deletedEmployee = await EmployeeDetails.findByIdAndDelete(id);

        return NextResponse.json(
            {
                message: "Employee fired successfully",
                employee: {
                    _id: deletedEmployee._id,
                    name: deletedEmployee.name,
                    email: deletedEmployee.email,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete employee error:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
