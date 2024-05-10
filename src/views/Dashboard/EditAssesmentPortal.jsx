import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../axios/axiosInstance";

const EditAssesmentPortal = ({ setEditModalOpen, user, editId }) => {
  const [userListing, setUserListing] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [assignTo, setAssignTo] = useState("");
  const [error, setError] = useState(null);
  let userDataForAssign = user.user.userdata._id;

  const allUserListing = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUserListing(response.data.users);
    } catch (error) {
      console.log("error", error);
    }
  };

  const editAssesment = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await axiosInstance.put(`/assignment/${editId}`, {
        assigned_to: assignTo,
        assigned_by: userDataForAssign,
        due_date: selectedDate,
      });
      setEditModalOpen(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const editGetDataAssesment = async () => {
    try {
      const response = await axiosInstance.get(`/assignment/${editId}`);
      setAssignTo(response.data.assignment.assigned_to);
      setSelectedDate(response.data.assignment.due_date);
    } catch (error) {
      console.log("error", error);
    }
  };

  const validateForm = () => {
    if (!selectedDate) {
      setError("Please select a due date.");
      return false;
    }
    if (!assignTo) {
      setError("Please select an employee to assign the assessment.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    allUserListing();
  }, []);

  useEffect(() => {
    editGetDataAssesment();
    return () => {
      setAssignTo(null);
      setSelectedDate(null);
    };
  }, [editId]);

  return (
    <>
      <div className="absolute h-full top-0 w-full overflow-hidden bg-gray-500 bg-opacity-50"></div>
      <div
        id="authentication-modal"
        tabIndex={-1}
        aria-hidden="true"
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-30 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="absolute top-[30%] right-[35%] w-full max-w-md max-h-full">
          <div className="p-2">
            <form onSubmit={editAssesment}>
              <div className="p-3 w-full bg-white border border-gray-200 rounded-lg shadow sm:p-8">
                <h2 className="font-semibold text-2xl text-start">
                  Edit assessment portal
                </h2>
                <div>
                  <div className="mt-2">
                    <span>Assign to:</span>
                    <select
                      id="countries"
                      className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={assignTo}
                      onChange={(e) => setAssignTo(e.target.value)}
                    >
                      <option value="" disabled>
                        Select an Employee
                      </option>
                      {userListing &&
                        userListing.map((item, index) => (
                          <option key={index} value={item._id}>
                            {item.firstname}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mt-2">
                    <span>Due Date</span>
                    <div className="flex items-center gap-3 max-w-sm">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className="border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:focus:border-blue-500"
                        placeholderText="Select date"
                      />
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div className="me-2 mt-2">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                  >
                    Edit Assessment
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAssesmentPortal;
