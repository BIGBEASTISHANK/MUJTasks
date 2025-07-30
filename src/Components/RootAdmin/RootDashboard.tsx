"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetTaskDisplayName } from "@/Utility/TaskTypes";
import VerifyingDB from "@/Utility/VerifyingDB";
import { 
  IoAdd, 
  IoLogOut, 
  IoSearch, 
  IoClose, 
  IoCheckmarkCircle, 
  IoWarning, 
  IoRefresh,
  IoPeople,
  IoPersonAdd
} from "react-icons/io5";

export default function RootDashboardComponent() {
  // State variables for component management
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeesData, setEmployeesData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form data states
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    tasks: ""
  });
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    tasks: ""
  });
  
  // Loading states
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [firingEmployee, setFiringEmployee] = useState<string | null>(null);
  
  // Error and success message states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-hide error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Auto-hide success messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Logout function
  const handleLogout = async () => {
    setIsVerifying(true);
    try {
      await fetch("/api/auth/rootadmin/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    router.push("/rootadmin");
  };

  // Handle edit employee - populate form with existing data
  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setEditFormData({
      name: employee.name || "",
      email: employee.email || "",
      mobile: employee.mobile || "",
      password: employee.password || "",
      tasks: employee.task ? employee.task.join(" ") : ""
    });
    setError(null);
    setSuccess(null);
  };

  // Handle cancel edit - reset form data
  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setEditFormData({
      name: "",
      email: "",
      mobile: "",
      password: "",
      tasks: ""
    });
    setError(null);
  };

  // Handle show add modal - reset form and show modal
  const handleShowAddModal = () => {
    setShowAddModal(true);
    setAddFormData({
      name: "",
      email: "",
      mobile: "",
      password: "",
      tasks: ""
    });
    setError(null);
    setSuccess(null);
  };

  // Handle cancel add - hide modal and reset form
  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddFormData({
      name: "",
      email: "",
      mobile: "",
      password: "",
      tasks: ""
    });
    setError(null);
  };

  // Handle form input change for edit modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  // Handle form input change for add modal
  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  // Handle save changes for editing employee
  const handleSaveChanges = async () => {
    if (!editingEmployee) return;

    setIsUpdating(true);
    setError(null);
    try {
      // Convert tasks string to array of numbers
      const tasksArray = editFormData.tasks
        .split(/\s+/)
        .filter(task => task.trim() !== "")
        .map(task => parseInt(task.trim()))
        .filter(task => !isNaN(task));

      const updateData = {
        id: editingEmployee._id,
        name: editFormData.name.trim(),
        email: editFormData.email.trim(),
        mobile: editFormData.mobile.trim(),
        password: editFormData.password.trim(),
        task: tasksArray
      };

      // Send update request to API
      const response = await fetch("/api/auth/rootadmin/updateEmployee", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        // Update local state with new employee data
        setEmployeesData(prev => 
          prev.map(emp => 
            emp._id === editingEmployee._id 
              ? { ...emp, ...updateData, _id: editingEmployee._id }
              : emp
          )
        );
        setSuccess("Employee updated successfully!");
        handleCancelEdit();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update employee");
      }
    } catch (error) {
      setError("An error occurred while updating the employee");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle add new employee
  const handleAddEmployee = async () => {
    setIsAdding(true);
    setError(null);
    try {
      // Convert tasks string to array of numbers
      const tasksArray = addFormData.tasks
        .split(/\s+/)
        .filter(task => task.trim() !== "")
        .map(task => parseInt(task.trim()))
        .filter(task => !isNaN(task));

      const newEmployeeData = {
        name: addFormData.name.trim(),
        email: addFormData.email.trim(),
        mobile: addFormData.mobile.trim(),
        password: addFormData.password.trim(),
        task: tasksArray
      };

      // Send add request to API
      const response = await fetch("/api/auth/rootadmin/addEmployee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newEmployeeData)
      });

      if (response.ok) {
        const responseData = await response.json();
        // Add new employee to local state
        setEmployeesData(prev => [...prev, responseData.employee]);
        setSuccess("Employee added successfully!");
        handleCancelAdd();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add employee");
      }
    } catch (error) {
      setError("An error occurred while adding the employee");
    } finally {
      setIsAdding(false);
    }
  };

  // Handle fire employee with confirmation
  const handleFireEmployee = async (employeeId: string) => {
    if (!confirm("Are you sure you want to fire this employee? This action cannot be undone.")) {
      return;
    }

    setFiringEmployee(employeeId);
    setError(null);
    try {
      // Send delete request to API
      const response = await fetch("/api/auth/rootadmin/deleteEmployee", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: employeeId })
      });

      if (response.ok) {
        // Remove employee from local state
        setEmployeesData(prev => prev.filter(emp => emp._id !== employeeId));
        setSuccess("Employee fired successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fire employee");
      }
    } catch (error) {
      setError("An error occurred while firing the employee");
    } finally {
      setFiringEmployee(null);
    }
  };

  useEffect(() => {
    // Verify root admin authentication and fetch employee data on mount
    async function verify() {
      try {
        const response = await fetch("/api/auth/rootadmin/verify", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/rootadmin");
          return;
        }

        const data = await response.json(); // Getting response
        setEmployeesData(data.employeeData || []);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Verification failed:", error);
        router.push("/rootadmin");
      } finally {
        setIsVerifying(false);
      }
    }

    verify();
  }, [router]);

  // Filter employees based on search term (name, email, mobile)
  const filteredEmployees = employeesData.filter((employee) =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.mobile?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Verification loading screen
  if (isVerifying || !isAuthenticated) {
    return <VerifyingDB isRoot={true} />;
  }

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Error/Success Messages */}
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] w-[calc(100%-24px)] max-w-md">
            <div className="bg-red-500/90 backdrop-blur-sm border border-red-400 text-white p-3 rounded-lg shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IoWarning className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-white hover:text-gray-200 ml-2"
              >
                <IoClose className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] w-[calc(100%-24px)] max-w-md">
            <div className="bg-green-500/90 backdrop-blur-sm border border-green-400 text-white p-3 rounded-lg shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IoCheckmarkCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{success}</span>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-white hover:text-gray-200 ml-2"
              >
                <IoClose className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
                Root Admin Dashboard
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Manage and view all employee details
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
              <button
                onClick={handleShowAddModal}
                className="w-fit bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 text-sm select-none cursor-pointer flex items-center justify-center gap-2"
              >
                <IoAdd className="w-4 h-4" />
                Add Employee
              </button>
              <button
                onClick={handleLogout}
                className="w-fit bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 text-sm select-none cursor-pointer flex items-center gap-2"
              >
                <IoLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Search and Stats Section */}
        <div className="bg-[#232930] rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Employee count display */}
            <div className="flex items-center">
              <div className="bg-[#DC2626]/20 text-[#DC2626] px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex items-center gap-2">
                <IoPeople className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  Total Employees: {employeesData.length}
                </span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 pl-9 sm:pl-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition-all"
              />
              <IoSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Add Employee Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
            <div className="bg-[#232930] rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <IoPersonAdd className="w-5 h-5" />
                Add New Employee
              </h2>
              
              {/* Error display in modal */}
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 flex items-start gap-2">
                  <IoWarning className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <div className="space-y-3 sm:space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={addFormData.name}
                    onChange={handleAddInputChange}
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    placeholder="Enter employee name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={addFormData.email}
                    onChange={handleAddInputChange}
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Mobile Field */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={addFormData.mobile}
                    onChange={handleAddInputChange}
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    placeholder="Enter mobile number"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Password *
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={addFormData.password}
                    onChange={handleAddInputChange}
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    placeholder="Enter password"
                  />
                </div>

                {/* Tasks Field */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Assigned Tasks
                  </label>
                  <input
                    type="text"
                    name="tasks"
                    value={addFormData.tasks}
                    onChange={handleAddInputChange}
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    placeholder="Enter task numbers (e.g., 1 2 3)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter numbers separated by spaces. Example: "1 2 3"
                  </p>
                </div>

                {/* Tasks preview */}
                {addFormData.tasks && (
                  <div>
                    <span className="block text-gray-400 text-sm mb-1">
                      Preview Tasks:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {addFormData.tasks
                        .split(/\s+/)
                        .filter(task => task.trim() !== "")
                        .map(task => parseInt(task.trim()))
                        .filter(task => !isNaN(task))
                        .map((taskNumber, index) => (
                          <span
                            key={index}
                            className="bg-[#DC2626]/20 text-[#DC2626] px-2 py-1 rounded text-xs font-medium"
                          >
                            {GetTaskDisplayName(taskNumber)}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 mt-6">
                <button
                  onClick={handleCancelAdd}
                  disabled={isAdding}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 select-none cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  disabled={isAdding || !addFormData.name.trim() || !addFormData.email.trim() || !addFormData.mobile.trim() || !addFormData.password.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 select-none cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  {isAdding && <IoRefresh className="w-4 h-4 animate-spin" />}
                  {isAdding ? "Adding..." : "Add Employee"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Employee Modal */}
        {editingEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
            <div className="bg-[#232930] rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                Edit Employee Details
              </h2>
              
              {/* Error display in modal */}
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 flex items-start gap-2">
                  <IoWarning className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <div className="space-y-3 sm:space-y-4">
                {/* Employee ID (Read-only) */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Employee ID (Read-only)
                  </label>
                  <input
                    type="text"
                    value={editingEmployee._id}
                    disabled
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed text-sm"
                  />
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    placeholder="Enter employee name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Mobile Field */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={editFormData.mobile}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    placeholder="Enter mobile number"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Password *
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={editFormData.password}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    placeholder="Enter password"
                  />
                </div>

                {/* Tasks Field */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Assigned Tasks
                  </label>
                  <input
                    type="text"
                    name="tasks"
                    value={editFormData.tasks}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    placeholder="Enter task numbers (e.g., 1 2 3)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter numbers separated by spaces. Example: "1 2 3"
                  </p>
                </div>

                {/* Tasks preview */}
                {editFormData.tasks && (
                  <div>
                    <span className="block text-gray-400 text-sm mb-1">
                      Preview Tasks:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {editFormData.tasks
                        .split(/\s+/)
                        .filter(task => task.trim() !== "")
                        .map(task => parseInt(task.trim()))
                        .filter(task => !isNaN(task))
                        .map((taskNumber, index) => (
                          <span
                            key={index}
                            className="bg-[#DC2626]/20 text-[#DC2626] px-2 py-1 rounded text-xs font-medium"
                          >
                            {GetTaskDisplayName(taskNumber)}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 select-none cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={isUpdating || !editFormData.name.trim() || !editFormData.email.trim() || !editFormData.mobile.trim() || !editFormData.password.trim()}
                  className="flex-1 bg-[#DC2626] hover:bg-[#DC2626]/80 disabled:bg-[#DC2626]/50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 select-none cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  {isUpdating && <IoRefresh className="w-4 h-4 animate-spin" />}
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <div
                key={employee._id}
                className="bg-[#232930] rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-700 hover:border-[#DC2626]/50 transition-all duration-200"
              >
                {/* Employee Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {/* Employee Avatar */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#DC2626] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-lg">
                        {employee.name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-lg font-semibold text-white break-words">
                        {employee.name || "N/A"}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-2 sm:px-3 rounded-lg transition-all duration-200 select-none cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleFireEmployee(employee._id)}
                      disabled={firingEmployee === employee._id}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white text-xs font-medium py-1 px-2 sm:px-3 rounded-lg transition-all duration-200 select-none cursor-pointer flex items-center gap-1"
                    >
                      {firingEmployee === employee._id ? (
                        <>
                          <IoRefresh className="w-3 h-3 animate-spin" />
                          <span className="hidden xs:inline">Firing...</span>
                        </>
                      ) : (
                        "Fire"
                      )}
                    </button>
                  </div>
                </div>

                {/* Employee Details */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Employee ID */}
                  <div className="border-b border-gray-700 pb-2">
                    <span className="text-gray-400 text-xs select-none block mb-1">
                      Employee ID
                    </span>
                    <p className="text-white font-medium text-xs sm:text-sm break-all">
                      {employee._id || "N/A"}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="border-b border-gray-700 pb-2">
                    <span className="text-gray-400 text-xs select-none block mb-1">
                      Email Address
                    </span>
                    <p className="text-white font-medium text-xs sm:text-sm break-all">
                      {employee.email || "N/A"}
                    </p>
                  </div>

                  {/* Mobile */}
                  <div className="border-b border-gray-700 pb-2">
                    <span className="text-gray-400 text-xs select-none block mb-1">
                      Mobile Number
                    </span>
                    <p className="text-white font-medium text-xs sm:text-sm">
                      {employee.mobile || "N/A"}
                    </p>
                  </div>

                  {/* Password */}
                  <div className="border-b border-gray-700 pb-2">
                    <span className="text-gray-400 text-xs select-none block mb-1">
                      Password
                    </span>
                    <p className="text-white font-medium text-xs sm:text-sm font-mono break-all">
                      {employee.password || "N/A"}
                    </p>
                  </div>

                  {/* Assigned Tasks */}
                  <div>
                    <span className="text-gray-400 text-xs select-none block mb-2">
                      Assigned Tasks ({employee.task?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {employee.task?.length > 0 ? (
                        employee.task.map((taskNumber: number, index: number) => (
                          <span
                            key={index}
                            className="bg-[#DC2626]/20 text-[#DC2626] px-2 py-1 rounded text-xs font-medium"
                          >
                            {GetTaskDisplayName(taskNumber)}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs bg-gray-500/10 px-2 py-1 rounded">
                          No tasks assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No employees found state
            <div className="col-span-full text-center py-8 sm:py-12 bg-[#232930] rounded-xl border border-gray-700">
              <div className="text-gray-400 mb-4">
                <IoPeople className="mx-auto h-8 w-8 sm:h-12 sm:w-12 mb-4" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">
                {searchTerm ? "No Matching Employees Found" : "No Employees Found"}
              </h3>
              <p className="text-gray-400 text-sm">
                {searchTerm 
                  ? `No employees match your search term "${searchTerm}"` 
                  : "There are no employees in the system yet."
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 bg-[#DC2626] hover:bg-[#DC2626]/80 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
