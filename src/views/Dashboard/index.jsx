import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaRegEdit, FaRegEye } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { MdAssignment, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import DeleteModal from "../../plugin/DeleteModal";
import AddAssesmentPortal from "./AddAssesmentPortal";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [assessmentPortalData, setAssessmentPortalData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [permission, setPermission] = useState([]);
  const [userListing, setUserListing] = useState([]);
  const [statusOfUser, setStatusOfUser] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entry, setEntry] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [sortDueDateAscending, setSortDueDateAscending] = useState(true);

  const sortAssessmentData = (data) => {
    const sortedData = [...data];
    if (sortBy === "dueDate") {
      sortedData.sort((a, b) => {
        const dateA = moment(a.due_date);
        const dateB = moment(b.due_date);
        return sortDueDateAscending ? dateA - dateB : dateB - dateA; // Changed here
      });
    } else if (sortBy === "employeeName") {
      sortedData.sort((a, b) => {
        const nameA = `${a.assigned_to.firstname} ${a.assigned_to.last_name}`;
        const nameB = `${b.assigned_to.firstname} ${b.assigned_to.last_name}`;
        return sortAscending
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    }
    return sortedData;
  };

  const assignData = () => {
    axiosInstance
      .get(
        `/assignments?status=${statusOfUser}&employee_id=${employeeId}&page=${page}&limit=${entry}`
      )
      .then((response) => {
        setAssessmentPortalData(response?.data?.assignments);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleDeleteAssesment = async () => {
    try {
      await axiosInstance.delete(`/assignment/${deleteId}`);
      setModalOpen(false);
      setDeleteId(null);
      assignData();
    } catch (error) {
      console.log("error", error);
    }
  };

  const allUserListing = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUserListing(response.data.users);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getStatusBadgeClassName = (status) => {
    switch (status) {
      case "assigned":
        return "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10";
      case "submitted":
        return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10";
      case "overdue":
        return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10";
      case "completed":
        return "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20";
      default:
        return "gray";
    }
  };

  const dueDate = (item) => {
    const date = item.due_date
      ? moment(item.due_date).format("DD/MM/YYYY")
      : "";
    const isToday =
      item.status == "overdue" &&
      moment(item.due_date).isSameOrBefore(moment(), "day");
    return { date, isToday };
  };

  useEffect(() => {
    if (user) {
      setPermission(user?.user?.permissions);
    }
  }, []);

  const handleStatusQuery = (e) => {
    setStatusOfUser(e.target.value);
  };

  const handleNameQuery = (e) => {
    setEmployeeId(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage != page) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    assignData();
  }, [statusOfUser, employeeId]);

  useEffect(() => {
    allUserListing();
  }, []);

  useEffect(() => {
    assignData();
  }, [page, entry]);

  const handleSortByEmployeeName = () => {
    setSortBy("employeeName");
    setSortAscending(!sortAscending);
  };

  const handleSortByDueDate = () => {
    setSortBy("dueDate");
    setSortDueDateAscending((prevAscending) => !prevAscending);
  };

  return (
    <>
      <div className="p-6">
        <div className="w-full text-center bg-white rounded-lg">
          <div className="border rounded-lg mb-5">
            <div className="flex justify-between items-center p-2">
              <span className="text-2xl font-bold">Assignments</span>
              {permission.includes("Add Assignment") && (
                <div
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm p-1 text-center"
                  onClick={() => setAddModalOpen(true)}
                >
                  <button className="focus:outline-none p-2 text-sm">
                    Add assignment
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-2 p-2">
              <div className="w-[10%] flex gap-2 items-center">
                <div>
                  <label>Show :-</label>
                </div>
                <div>
                  <select
                    name="user-list-table_length"
                    aria-controls="user-list-table"
                    className="border rounded-lg p-1 bg-slate-100"
                    onChange={(e) => setEntry(e.target.value)}
                    value={entry}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>
              <div className="w-[15%]">
                <select
                  id="status"
                  className="border border-black bg-gray-100 text-base rounded-lg block w-full p-1"
                  defaultValue=""
                  onChange={handleStatusQuery}
                >
                  <option value="">All status</option>
                  <option value="assigned">Assigned</option>
                  <option value="overdue">Overdue</option>
                  <option value="completed">Completed</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>
              {permission.includes("Add Assignment") && (
                <div className="w-[15%]">
                  <select
                    id="employeeName"
                    className="border border-black bg-gray-100 text-base rounded-lg block w-full p-1"
                    defaultValue=""
                    onChange={handleNameQuery}
                  >
                    <option value="">All Employee</option>
                    {userListing &&
                      userListing.map((item, index) => (
                        <option key={index} value={item._id}>
                          {item.firstname} {item.last_name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="relative overflow-x-auto rounded-lg shadow-md">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Index
                  </th>

                  <th
                    onClick={handleSortByEmployeeName}
                    scope="col"
                    className="px-6 py-3 flex items-center text-center"
                  >
                    <span>Employee Name</span>
                    <button className="focus:outline-none">
                      {sortBy === "employeeName" ? (
                        sortAscending ? (
                          <span className="text-2xl">&uarr;</span>
                        ) : (
                          <span className="text-2xl">&darr;</span>
                        )
                      ) : (
                        <>
                          <span className="text-2xl">&darr;</span>
                          <span className="text-2xl">&uarr;</span>
                        </>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Assigned By
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th
                    onClick={handleSortByDueDate}
                    scope="col"
                    className="px-6 py-3"
                  >
                    <button className="focus:outline-none flex items-center text-center">
                      <span>Due Date</span>
                      {sortBy === "dueDate" ? (
                        sortDueDateAscending ? (
                          <span className="text-2xl">&uarr;</span>
                        ) : (
                          <span className="text-2xl">&darr;</span>
                        )
                      ) : (
                        <>
                          <span className="text-2xl">&darr;</span>
                          <span className="text-2xl">&uarr;</span>
                        </>
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortAssessmentData(assessmentPortalData).length > 0 ? (
                  sortAssessmentData(assessmentPortalData).map(
                    (items, index) => {
                      return (
                        <tr
                          key={items._id + "itemsDiv"}
                          className="text-black border-bgray-700"
                        >
                          <td className="px-6 py-4">{items.index}</td>
                          <td className="px-6 py-4">
                            {items.assigned_to.firstname}
                            {items.assigned_to.last_name}
                          </td>
                          <td className="px-6 py-4">
                            {items.assigned_by.firstname}
                            {items.assigned_by.last_name}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-md ${getStatusBadgeClassName(
                                items.status
                              )} px-2 py-1 font-medium  ring-1 ring-inset ring-gray-600 capitalize text-sm`}
                            >
                              {items.status}
                            </span>
                          </td>
                          <td
                            className={`px-6 py-4 ${
                              dueDate(items).isToday
                                ? "text-red-500 font-bold"
                                : ""
                            }`}
                          >
                            {dueDate(items).date}
                          </td>
                          <td className="flex justify-start gap-2 mt-2 items-center">
                            {permission?.length > 0 &&
                              permission.includes("Delete Assignment") && (
                                <button
                                  className="bg-red-100 p-[2px] rounded hover:ring-1 hover:ring-red-800 focus:outline-red-300"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Delete"
                                  onClick={() => {
                                    setDeleteId(items._id);
                                    setModalOpen(true);
                                  }}
                                >
                                  <MdDelete
                                    size={24}
                                    className="text-[#f35f5f] hover:text-red-600"
                                  />
                                </button>
                              )}
                            {user.user.userdata._id === items.assigned_to._id &&
                              (items.status == "assigned" ||
                                items.status == "overdue") && (
                                <button
                                  className="focus:outline-none bg-blue-500 hover:bg-blue-600 p-1"
                                  onClick={() => {
                                    navigate(`assignment/${items._id}`);
                                  }}
                                >
                                  <FaPlus
                                    title="assignment paper"
                                    size={24}
                                    color="white"
                                  />
                                </button>
                              )}

                            {(items.status == "completed" ||
                              items.status == "submitted") && (
                              <button
                                className="focus:outline-none bg-blue-500 hover:bg-blue-600 p-1"
                                title="View"
                                onClick={() => {
                                  navigate(`viewAssignment/${items._id}`);
                                }}
                              >
                                <FaRegEye size={24} color="white" />
                              </button>
                            )}

                            {items.assigned_to.reporting_user_id ===
                              user.user.userdata._id &&
                              items.status === "submitted" && (
                                <div>
                                  <button
                                    className="focus:outline-none bg-blue-500 hover:bg-blue-600 p-1"
                                    title="Reporting User Review"
                                    onClick={() => {
                                      navigate(
                                        `reportingUserQuestions/${items._id}`
                                      );
                                    }}
                                  >
                                    <MdAssignment size={24} color="white" />
                                  </button>
                                </div>
                              )}

                            {items.status === "submitted" &&
                              items.assigned_to._id ===
                                user?.user?.userdata?._id && (
                                <div
                                  className="bg-[#91868636] rounded hover:ring-1 hover:ring-slate-800"
                                  style={{
                                    paddingBottom: "10px",
                                    paddingRight: "10px",
                                    paddingLeft: "10px",
                                    paddingTop: "8px",
                                  }}
                                  onClick={() => {
                                    navigate(`edit-user-review/${items._id}`);
                                  }}
                                >
                                  <FaRegEdit
                                    size={20}
                                    className="text-slate-600"
                                  />
                                </div>
                              )}
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <hr />
            <div className="flex justify-end m-2">
              <ul className="inline-flex -space-x-px text-sm">
                {page !== 1 && (
                  <li>
                    <a
                      href="#"
                      onClick={() => handlePageChange(page - 1)}
                      className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                      Previous
                    </a>
                  </li>
                )}

                {[...Array(totalPages).keys()].map((num) => (
                  <li key={num}>
                    <button
                      type="button"
                      onClick={() => handlePageChange(num + 1)}
                      className={`flex items-center justify-center px-4 h-10 text-black border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 focus:outline-none ${
                        page === num + 1
                          ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700"
                          : ""
                      }`}
                    >
                      {num + 1}
                    </button>
                  </li>
                ))}
                {page < totalPages && (
                  <li>
                    <a
                      href="#"
                      onClick={() => handlePageChange(page + 1)}
                      className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                      Next
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <DeleteModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          handleDeleteAssesment={handleDeleteAssesment}
        />
      )}
      {addModalOpen && (
        <AddAssesmentPortal
          setAddModalOpen={setAddModalOpen}
          addModalOpen={addModalOpen}
          user={user}
          assignData={assignData}
        />
      )}
    </>
  );
};

export default Dashboard;
