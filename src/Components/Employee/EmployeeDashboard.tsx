"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { GetTaskDisplayName } from "@/Utility/TaskTypes";
import VerifyingDB from "@/Utility/VerifyingDB";

export default function EmployeeDashboardComponent() {
    // variables
    const router = useRouter();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState(1);

    const [employeeData, setEmployeeData] = useState<{
        id: string | null;
        name: string | null;
        email: string | null;
        mobile: string | null;
        tasks: number[];
    }>({
        id: null,
        name: null,
        email: null,
        mobile: null,
        tasks: [],
    });

    // Dynamic api
    const availableTabs = [
        { id: 1, apiEndpoint: "/api/AssignmentFormSubmission" },
        { id: 2, apiEndpoint: "/api/ProjectsSubmission" },
    ];

    const visibleTabs = availableTabs.filter((tab) =>
        employeeData.tasks.includes(tab.id)
    );

    // logout function
    const handleLogout = async () => {
        setIsVerifying(true);
        try {
            await fetch("/api/auth/employee/logout", {
                method: "GET",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
        router.push("/employee");
    };

    useEffect(() => {
        // verify employee authentication and fetch data on mount
        async function verify() {
            try {
                const response = await fetch("/api/auth/employee/verify", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    router.push("/employee");
                    return;
                }

                const data = await response.json(); // Getting response

                setEmployeeData({
                    id: data.employeeData._id,
                    name: data.employeeData.name,
                    email: data.employeeData.email,
                    mobile: data.employeeData.mobile,
                    tasks: data.employeeData.task,
                });

                if (data.employeeData.task?.length > 0)
                    setActiveTab(data.employeeData.task[0]);

                setIsAuthenticated(true);
            } catch (error) {
                console.error("Verification failed:", error);
            } finally {
                setIsVerifying(false);
            }
        }

        verify();
    }, [router]);

    // Verification loading screen
    if (isVerifying || !isAuthenticated) {
        return <VerifyingDB />;
    }

    return (
        <div className="pt-20 sm:pt-28 min-h-screen px-2 sm:px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
                    <div className="xl:col-span-1 order-1">
                        {/* Employee Details section */}
                        <div className="xl:sticky xl:top-32 bg-[#232930] rounded-xl p-4 sm:p-6">
                            {/* Header */}
                            <h2 className="text-base sm:text-lg font-bold text-[#1793D1] mb-4 text-center select-none">
                                Employee Details
                            </h2>

                            <div className="space-y-3 text-sm">
                                {/* Employee Id */}
                                <div className="border-b border-gray-700 pb-2">
                                    <span className="text-gray-400 text-xs select-none">
                                        ID
                                    </span>
                                    <p className="text-white font-medium text-xs sm:text-sm break-all">
                                        {employeeData.id}
                                    </p>
                                </div>

                                {/* Employee Name */}
                                <div className="border-b border-gray-700 pb-2">
                                    <span className="text-gray-400 text-xs select-none">
                                        Name
                                    </span>
                                    <p className="text-white font-medium text-xs sm:text-sm">
                                        {employeeData.name}
                                    </p>
                                </div>

                                {/* Employee Email */}
                                <div className="border-b border-gray-700 pb-2">
                                    <span className="text-gray-400 text-xs select-none">
                                        Email
                                    </span>
                                    <p className="text-white font-medium text-xs sm:text-sm break-all">
                                        {employeeData.email}
                                    </p>
                                </div>

                                {/* Employee Mobile */}
                                <div className="border-b border-gray-700 pb-2">
                                    <span className="text-gray-400 text-xs select-none">
                                        Mobile
                                    </span>
                                    <p className="text-white font-medium text-xs sm:text-sm">
                                        {employeeData.mobile}
                                    </p>
                                </div>

                                {/* Employee Assigned Tasks */}
                                <div className="mb-4">
                                    {/* Title */}
                                    <span className="text-gray-400 text-xs select-none">
                                        Assigned Tasks
                                    </span>

                                    {/* Tasks */}
                                    <div className="flex flex-wrap gap-1 mt-1 select-none">
                                        {employeeData.tasks?.length > 0 ? (
                                            employeeData.tasks.map(
                                                (taskNumber, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-[#1793D1]/20 text-[#1793D1] px-2 py-1 rounded text-xs"
                                                    >
                                                        {GetTaskDisplayName(
                                                            taskNumber
                                                        )}
                                                    </span>
                                                )
                                            )
                                        ) : (
                                            <span className="text-gray-400 text-xs">
                                                No tasks assigned
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <div className="mt-6 pt-4 border-t border-gray-700">
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm select-none cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tasks tab selector */}
                    <div className="xl:col-span-3 order-2">
                        {visibleTabs.length > 0 && (
                            <div className="mb-4 sm:mb-6">
                                <div className="bg-[#232930] p-1 rounded-lg w-full overflow-x-auto">
                                    <div className="flex space-x-1 min-w-max">
                                        {visibleTabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() =>
                                                    setActiveTab(tab.id)
                                                }
                                                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 select-none cursor-pointer whitespace-nowrap ${
                                                    activeTab === tab.id
                                                        ? "bg-[#1793D1] text-white"
                                                        : "text-gray-400 hover:text-white hover:bg-[#1A1E23]"
                                                }`}
                                            >
                                                {GetTaskDisplayName(tab.id)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Task content section */}
                        <div className="bg-[#232930] rounded-xl p-4 sm:p-6">
                            {visibleTabs.length > 0 ? (
                                <ContentSection
                                    activeTab={activeTab}
                                    apiEndpoint={
                                        visibleTabs.find(
                                            (tab) => tab.id === activeTab
                                        )?.apiEndpoint
                                    }
                                    employeeId={employeeData.id}
                                />
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-400">
                                        No tasks assigned to you
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Content section function
function ContentSection({ activeTab, apiEndpoint, employeeId }: any) {
    // Variables
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<
        "pending" | "accepted" | "completed"
    >("pending");
    const [actionLoading, setActionLoading] = useState<{
        [key: string]: boolean;
    }>({});

    // Fetching data from db
    const fetchData = async () => {
        if (!apiEndpoint) return;

        setLoading(true);
        try {
            // Calling api
            const response = await fetch(apiEndpoint, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Change Data on tab change
    useEffect(() => {
        setData(null);
        fetchData();
    }, [activeTab, apiEndpoint]);

    // Refresh handling
    const handleRefresh = () => {
        fetchData();
    };

    // Accept submission handling
    const handleAcceptSubmission = async (submissionId: string) => {
        setActionLoading((prev) => ({ ...prev, [submissionId]: true }));
        try {
            const response = await fetch(`/api/SubmissionStatusUpdate`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    submissionId: submissionId,
                    employeeId: employeeId,
                    action: "accept",
                }),
            });

            if (response.ok) {
                fetchData();
            } else {
                const errorData = await response.json();
                console.log("Failed to accept submission:", errorData.error);
            }
        } catch (error) {
            console.log("Failed to accept submission:", error);
        } finally {
            setActionLoading((prev) => ({ ...prev, [submissionId]: false }));
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-500/20 text-green-400";
            case "accepted":
                return "bg-blue-500/20 text-blue-400";
            case "pending":
                return "bg-yellow-500/20 text-yellow-400";
            default:
                return "bg-gray-500/20 text-gray-400";
        }
    };

    // Filter submissions
    const getFilteredSubmissions = () => {
        if (!data?.submissions) return [];

        let filtered = [...data.submissions];

        if (statusFilter === "pending") {
            filtered = filtered.filter(
                (sub) => sub.status?.toLowerCase() === "pending"
            );
        } else if (statusFilter === "accepted") {
            filtered = filtered.filter(
                (sub) => sub.status?.toLowerCase() === "accepted"
            );
        } else if (statusFilter === "completed") {
            filtered = filtered.filter(
                (sub) => sub.status?.toLowerCase() === "completed"
            );
        }

        filtered.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );

        return filtered;
    };

    // Get action button type and text
    const getButtonAction = (submission: any) => {
        const status = submission.status?.toLowerCase();
        const isAssignedToCurrentEmployee =
            submission.assignedToId === employeeId;

        if (status === "completed") {
            return { type: "completed", text: "Completed", disabled: true };
        } else if (status === "accepted" && isAssignedToCurrentEmployee) {
            return {
                type: "markCompleted",
                text: "Mark as Completed",
                disabled: false,
            };
        } else if (status === "pending") {
            return {
                type: "accept",
                text: "Accept Submission",
                disabled: false,
            };
        } else {
            return { type: "disabled", text: "Not Available", disabled: true };
        }
    };

    // Filtered submissions
    const filteredSubmissions = getFilteredSubmissions();

    // Input charged price
    const [chargedPriceError, setChargedPriceError] = useState(false);
    const [chargedPrice, setChargedPrice] = useState<number | null>(null);

    const handleChargedPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? null : parseFloat(e.target.value);
        setChargedPrice(value);
    };

    // Mark as completed handling
    const handleMarkAsCompleted = async (submissionId: string) => {
        setActionLoading((prev) => ({ ...prev, [submissionId]: true }));
        try {
            const response = await fetch(`/api/SubmissionStatusUpdate`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    submissionId: submissionId,
                    employeeId: employeeId,
                    chargedPrice: chargedPrice,
                    action: "complete",
                }),
            });

            if (response.ok) {
                fetchData();
            } else {
                const errorData = await response.json();
                console.log("Failed to mark as completed:", errorData.error);
            }
        } catch (error) {
            console.log("Failed to mark as completed:", error);
        } finally {
            setActionLoading((prev) => ({ ...prev, [submissionId]: false }));
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                {/* Heading */}
                <h3 className="text-lg sm:text-xl font-bold text-white select-none">
                    {GetTaskDisplayName(activeTab)} Management
                </h3>

                {/* Refresh button */}
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#1793D1] hover:bg-[#1793D1]/80 disabled:bg-[#1793D1]/50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 select-none cursor-pointer"
                >
                    {/* Spin button */}
                    <svg
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            loading ? "animate-spin" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* Loading screen && Content type selection */}
            {loading ? (
                // Loading screen
                <VerifyingDB
                    headerText="Fetching Data & Verifying Access"
                    subHeaderText={`Please wait while we fetch ${GetTaskDisplayName(
                        activeTab
                    )} data...`}
                    fullScreen={false}
                />
            ) : (
                // Content type selection
                <div className="space-y-4">
                    {data?.submissions?.length > 0 ? (
                        <>
                            <div className="mb-4 sm:mb-6">
                                <div className="bg-[#1A1E23] p-1 rounded-lg w-full overflow-x-auto">
                                    <div className="flex space-x-1 min-w-max">
                                        {/* Pending */}
                                        <button
                                            onClick={() =>
                                                setStatusFilter("pending")
                                            }
                                            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 select-none cursor-pointer whitespace-nowrap ${
                                                statusFilter === "pending"
                                                    ? "bg-[#1793D1] text-white"
                                                    : "text-gray-400 hover:text-white hover:bg-[#232930]"
                                            }`}
                                        >
                                            Pending (
                                            {
                                                data.submissions.filter(
                                                    (sub: any) =>
                                                        sub.status === "pending"
                                                ).length
                                            }
                                            )
                                        </button>

                                        {/* Accepted */}
                                        <button
                                            onClick={() =>
                                                setStatusFilter("accepted")
                                            }
                                            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 select-none cursor-pointer whitespace-nowrap ${
                                                statusFilter === "accepted"
                                                    ? "bg-[#1793D1] text-white"
                                                    : "text-gray-400 hover:text-white hover:bg-[#232930]"
                                            }`}
                                        >
                                            Accepted (
                                            {
                                                data.submissions.filter(
                                                    (sub: any) =>
                                                        sub.status ===
                                                        "accepted"
                                                ).length
                                            }
                                            )
                                        </button>

                                        {/* Completed */}
                                        <button
                                            onClick={() =>
                                                setStatusFilter("completed")
                                            }
                                            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 select-none cursor-pointer whitespace-nowrap ${
                                                statusFilter === "completed"
                                                    ? "bg-[#1793D1] text-white"
                                                    : "text-gray-400 hover:text-white hover:bg-[#232930]"
                                            }`}
                                        >
                                            Completed (
                                            {
                                                data.submissions.filter(
                                                    (sub: any) =>
                                                        sub.status ===
                                                        "completed"
                                                ).length
                                            }
                                            )
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                                {filteredSubmissions.length > 0 ? (
                                    filteredSubmissions.map(
                                        (submission: any) => (
                                            <div
                                                key={submission._id}
                                                className="bg-[#1A1E23] p-4 sm:p-6 rounded-lg border border-gray-700 hover:border-[#1793D1]/50 transition-all duration-200"
                                            >
                                                <div className="flex flex-col xs:flex-row justify-between items-start mb-4 gap-2 xs:gap-0">
                                                    <div className="flex-1 min-w-0">
                                                        {/* Client name */}
                                                        <h4 className="text-base sm:text-lg font-semibold text-white mb-1 break-words">
                                                            {submission.name}
                                                        </h4>

                                                        {/* Client Branch */}
                                                        <p className="text-xs sm:text-sm text-gray-400">
                                                            {submission.branch}{" "}
                                                            Branch
                                                        </p>
                                                    </div>

                                                    {/* Submission status */}
                                                    <span
                                                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium shrink-0 ${getStatusColor(
                                                            submission.status
                                                        )}`}
                                                    >
                                                        {submission.status
                                                            ?.charAt(0)
                                                            .toUpperCase() +
                                                            submission.status?.slice(
                                                                1
                                                            )}
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                                                        {/* Subject || Project title */}
                                                        <div className="min-w-0">
                                                            <span className="text-xs text-gray-400 select-none block mb-1">
                                                                {activeTab === 1
                                                                    ? "Subject"
                                                                    : "Project Title"}
                                                            </span>
                                                            <p className="text-xs sm:text-sm text-white font-medium break-words">
                                                                {submission.subject ||
                                                                    submission.projectTitle}
                                                            </p>
                                                        </div>

                                                        {/* Pages || Project type */}
                                                        <div>
                                                            <span className="text-xs text-gray-400 select-none block mb-1">
                                                                {activeTab === 1
                                                                    ? "Pages"
                                                                    : "Project Type"}
                                                            </span>
                                                            <p className="text-xs sm:text-sm text-white font-medium">
                                                                {submission.estimatedPages ||
                                                                    submission.projectType}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Mobile */}
                                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                                                        <div>
                                                            <span className="text-xs text-gray-400 select-none block mb-1">
                                                                Mobile
                                                            </span>
                                                            <p className="text-xs sm:text-sm text-white font-medium">
                                                                {
                                                                    submission.mobile
                                                                }
                                                            </p>
                                                        </div>

                                                        {/* Deadline */}
                                                        <div>
                                                            <span className="text-xs text-gray-400 select-none block mb-1">
                                                                Deadline
                                                            </span>
                                                            <p className="text-xs sm:text-sm text-white font-medium">
                                                                {formatDate(
                                                                    submission.deadline
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Assigned to */}
                                                    {submission.assignedTo && (
                                                        <div>
                                                            <span className="text-xs text-gray-400 select-none block mb-1">
                                                                Assigned To
                                                            </span>
                                                            <p className="text-xs sm:text-sm text-[#1793D1] font-medium break-words">
                                                                {
                                                                    submission.assignedTo
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Charged price */}
                                                    {submission.chargedPrice && (
                                                        <div>
                                                            <span className="text-xs text-gray-400 select-none block mb-1">
                                                                Charged Price
                                                                (Gross)
                                                            </span>
                                                            <p className="text-xs sm:text-sm font-medium break-words">
                                                                {
                                                                    submission.chargedPrice
                                                                }{" "}
                                                                ₹
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Platform fee paid */}
                                                    {submission.chargedPrice && (
                                                        <div>
                                                            <span className="text-xs text-gray-400 select-none block mb-1">
                                                                Platform fee
                                                                (10%)
                                                            </span>
                                                            <p className="text-xs sm:text-sm font-medium break-words">
                                                                {(submission.chargedPrice /
                                                                    100) *
                                                                    10}{" "}
                                                                ₹
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Submitted on */}
                                                    <div>
                                                        <span className="text-xs text-gray-400 select-none block mb-1">
                                                            Submitted On
                                                        </span>
                                                        <p className="text-xs sm:text-sm text-white">
                                                            {formatDate(
                                                                submission.createdAt
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Accepted on */}
                                                    {submission.acceptedOn && (
                                                        <div>
                                                            <span className="text-xs text-gray-400 select-none block mb-1">
                                                                Accepted On
                                                            </span>
                                                            <p className="text-xs sm:text-sm text-blue-400">
                                                                {formatDate(
                                                                    submission.acceptedOn
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Completed on */}
                                                    {submission.completedOn && (
                                                        <div>
                                                            <span className="text-xs text-gray-400 select-none block mb-1">
                                                                Completed On
                                                            </span>
                                                            <p className="text-xs sm:text-sm text-green-400">
                                                                {formatDate(
                                                                    submission.completedOn
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* View file button */}
                                                <div className="mt-4 pt-4 border-t border-gray-700 flex flex-col xs:flex-row gap-2">
                                                    {submission.fileLink && (
                                                        <a
                                                            href={
                                                                submission.fileLink
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 bg-[#1793D1] hover:bg-[#1793D1]/80 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 text-center select-none cursor-pointer"
                                                        >
                                                            View File
                                                        </a>
                                                    )}
                                                    {(() => {
                                                        const buttonAction =
                                                            getButtonAction(
                                                                submission
                                                            );
                                                        const isLoading =
                                                            actionLoading[
                                                                submission._id
                                                            ];

                                                        // Disabled button
                                                        if (
                                                            buttonAction.disabled
                                                        ) {
                                                            return (
                                                                <button
                                                                    disabled
                                                                    className="flex-1 bg-gray-500 text-gray-300 text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg cursor-not-allowed select-none opacity-60"
                                                                >
                                                                    {
                                                                        buttonAction.text
                                                                    }
                                                                </button>
                                                            );
                                                        }

                                                        // Accept button
                                                        if (
                                                            buttonAction.type ===
                                                            "accept"
                                                        ) {
                                                            return (
                                                                <button
                                                                    onClick={() =>
                                                                        handleAcceptSubmission(
                                                                            submission._id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                    className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 select-none cursor-pointer flex items-center justify-center gap-2"
                                                                >
                                                                    {isLoading && (
                                                                        <svg
                                                                            className="w-3 h-3 animate-spin"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={
                                                                                    2
                                                                                }
                                                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                                            />
                                                                        </svg>
                                                                    )}
                                                                    {isLoading
                                                                        ? "Accepting..."
                                                                        : buttonAction.text}
                                                                </button>
                                                            );
                                                        }

                                                        // Mark as completed button
                                                        if (
                                                            buttonAction.type ===
                                                            "markCompleted"
                                                        ) {
                                                            return (
                                                                <>
                                                                    {/* Enter  charge price */}
                                                                    <input
                                                                        type="number"
                                                                        value={
                                                                            chargedPrice ??
                                                                            ""
                                                                        }
                                                                        onChange={
                                                                            handleChargedPriceChange
                                                                        }
                                                                        disabled={
                                                                            isLoading
                                                                        }
                                                                        placeholder="Enter charge price"
                                                                        className="w-full bg-[#1A1E23] outline-none rounded-lg disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 transition-all"
                                                                        style={{
                                                                            border: chargedPriceError
                                                                                ? "1px solid red"
                                                                                : "1px solid #364153",
                                                                        }}
                                                                    />

                                                                    {/* Mark as complete */}
                                                                    <button
                                                                        onClick={() => {
                                                                            if (
                                                                                chargedPrice !=
                                                                                    null &&
                                                                                chargedPrice >
                                                                                    0
                                                                            ) {
                                                                                handleMarkAsCompleted(
                                                                                    submission._id
                                                                                );
                                                                            } else {
                                                                                setChargedPriceError(
                                                                                    true
                                                                                );
                                                                            }
                                                                        }}
                                                                        disabled={
                                                                            isLoading
                                                                        }
                                                                        className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 select-none cursor-pointer flex items-center justify-center gap-2"
                                                                    >
                                                                        {isLoading && (
                                                                            <svg
                                                                                className="w-3 h-3 animate-spin"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={
                                                                                        2
                                                                                    }
                                                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                                                />
                                                                            </svg>
                                                                        )}
                                                                        {isLoading
                                                                            ? "Completing..."
                                                                            : buttonAction.text}
                                                                    </button>
                                                                </>
                                                            );
                                                        }

                                                        return null;
                                                    })()}
                                                </div>
                                            </div>
                                        )
                                    )
                                ) : (
                                    // No submissions found
                                    <div className="col-span-full text-center py-8">
                                        <p className="text-gray-400 text-sm">
                                            No {statusFilter} submissions found.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // No submissions found
                        <div className="text-center py-8 sm:py-12 bg-[#1A1E23] rounded-lg border border-gray-700">
                            <div className="text-gray-400 mb-2">
                                <svg
                                    className="mx-auto h-8 w-8 sm:h-12 sm:w-12 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-base sm:text-lg font-medium text-white mb-2">
                                No {GetTaskDisplayName(activeTab)} Found
                            </h3>
                            <p className="text-gray-400 text-sm">
                                There are no submissions available at the
                                moment.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
