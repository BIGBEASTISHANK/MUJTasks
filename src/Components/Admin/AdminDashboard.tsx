"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetTaskDisplayName } from "@/Utility/TaskTypes";
import VerifyingDB from "@/Utility/VerifyingDB";

export default function AdminDashboardComponent() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  // Employee data
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

  // Available tabs
  const availableTabs = [
    { id: 1, apiEndpoint: "/api/AssignmentFormSubmission/" },
    { id: 2, apiEndpoint: "/api/ProjectsSubmission/" },
  ];

  // Filter tabs based on assigned tasks
  const visibleTabs = availableTabs.filter((tab) =>
    employeeData.tasks.includes(tab.id)
  );

  // Logout function
  const handleLogout = async () => {
    setIsVerifying(true);
    try {
      await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    router.push("/admin");
  };

  // Verify employee on component mount
  useEffect(() => {
    async function verifyEmployee() {
      try {
        const response = await fetch("/api/auth/verifyEmployee", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/admin");
          return;
        }

        const data = await response.json();

        setEmployeeData({
          id: data.employeeData._id,
          name: data.employeeData.name,
          email: data.employeeData.email,
          mobile: data.employeeData.mobile,
          tasks: data.employeeData.task,
        });

        // Set first available task as active tab
        if (data.employeeData.task?.length > 0) {
          setActiveTab(data.employeeData.task[0]);
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Verification failed:", error);
        router.push("/admin");
      } finally {
        setIsVerifying(false);
      }
    }

    verifyEmployee();
  }, [router]);

  // Show loading screen
  if (isVerifying || !isAuthenticated) {
    return <VerifyingDB />;
  }

  return (
    <div className="pt-28 min-h-screen px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Employee Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-[#232930] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[#1793D1] mb-4 text-center select-none">
                Employee Details
              </h2>

              {/* Employee ID */}
              <div className="space-y-3 text-sm">
                <div className="border-b border-gray-700 pb-2">
                  <span className="text-gray-400 text-xs select-none">ID</span>
                  <p className="text-white font-medium">{employeeData.id}</p>
                </div>

                {/* Employee Name */}
                <div className="border-b border-gray-700 pb-2">
                  <span className="text-gray-400 text-xs select-none">
                    Name
                  </span>
                  <p className="text-white font-medium">{employeeData.name}</p>
                </div>

                {/* Employee Email */}
                <div className="border-b border-gray-700 pb-2">
                  <span className="text-gray-400 text-xs select-none">
                    Email
                  </span>
                  <p className="text-white font-medium break-all">
                    {employeeData.email}
                  </p>
                </div>

                {/* Employee Mobile */}
                <div className="border-b border-gray-700 pb-2">
                  <span className="text-gray-400 text-xs select-none">
                    Mobile
                  </span>
                  <p className="text-white font-medium">
                    {employeeData.mobile}
                  </p>
                </div>

                {/* Assigned Tasks */}
                <div className="mb-4">
                  <span className="text-gray-400 text-xs select-none">
                    Assigned Tasks
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1 select-none">
                    {employeeData.tasks?.length > 0 ? (
                      employeeData.tasks.map((taskNumber, index) => (
                        <span
                          key={index}
                          className="bg-[#1793D1]/20 text-[#1793D1] px-2 py-1 rounded text-xs"
                        >
                          {GetTaskDisplayName(taskNumber)}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No tasks assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout button */}
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

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs Navigation */}
            {visibleTabs.length > 0 && (
              <div className="mb-6">
                <div className="bg-[#232930] p-1 rounded-lg w-fit">
                  <div className="flex space-x-1">
                    {visibleTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 select-none cursor-pointer ${
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

            {/* Tab Content */}
            <div className="bg-[#232930] rounded-xl p-6">
              {visibleTabs.length > 0 ? (
                <ContentSection
                  activeTab={activeTab}
                  apiEndpoint={
                    visibleTabs.find((tab) => tab.id === activeTab)?.apiEndpoint
                  }
                />
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400">No tasks assigned to you</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Single content component that handles all tabs
function ContentSection({ activeTab, apiEndpoint }: any) {
  // Variables
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetching all the Assignment data from the API
  useEffect(() => {
    // Resetting data
    setData(null);

    // Fetching fresh data
    async function fetchData() {
      if (!apiEndpoint) return;

      setLoading(true);
      try {
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
    }

    fetchData();
  }, [activeTab]);

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4 select-none">
        {GetTaskDisplayName(activeTab)} Management
      </h3>

      <div className="space-y-4">
        <div className="bg-[#1A1E23] p-4 rounded-lg">
          {loading ? (
            // <p className="text-gray-300">Loading...</p>
            <VerifyingDB
              headerText="Fetching Data & Verifying Access"
              subHeaderText={`Please wait while we fetch ${GetTaskDisplayName(
                activeTab
              )} data...`}
              fullScreen={false}
            />
          ) : (
            <div>
              <p className="text-gray-300">
                {GetTaskDisplayName(activeTab)} content and management tools
                will go here.
              </p>
              {/* Add your dynamic content based on data here */}
              {data && (
                <pre className="text-sm text-gray-400 mt-2">
                  {JSON.stringify(data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
