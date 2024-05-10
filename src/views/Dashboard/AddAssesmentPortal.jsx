import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../axios/axiosInstance";
import "../../assets/customDatePickerWidth.css";
const AddAssesmentPortal = ({ setAddModalOpen, user, assignData }) => {
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

  const addAssesment = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await axiosInstance.post(`/assignments`, {
        assigned_to: assignTo,
        assigned_by: userDataForAssign,
        due_date: selectedDate,
      });
      setAddModalOpen(false);
      assignData();
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

  return (
    <>
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
              <form onSubmit={addAssesment}>
                <div className="p-3 w-full bg-white border border-gray-200 rounded-lg shadow sm:p-8">
                  <h2 className="font-semibold text-2xl text-start">
                    Add assignment
                  </h2>
                  <div>
                    <div className="mt-2">
                      <span>Assign to</span>
                      <select
                        id="countries"
                        className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        defaultValue=""
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
                      <div className="flex relative w-full customDatePickerWidth">
                        <div className="absolute z-10 right-4 h-full flex items-center">
                          <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                          </svg>
                        </div>
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          minDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          className="border border-gray-300 text-sm rounded-lg p-2.5 w-full dark:focus:border-blue-500"
                          placeholderText="Select date"
                        />
                      </div>
                    </div>
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="me-2 mt-4">
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                    >
                      Add assignment
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddModalOpen(false)}
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
    </>
  );
};

export default AddAssesmentPortal;
