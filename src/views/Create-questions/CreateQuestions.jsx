import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../axios/axiosInstance";
import DeleteModal from "../../plugin/DeleteModal";
import AddQuestionsModal from "./AddQuestionsModal";
import EditQuestionsModal from "./EditQuestionsModal";

const CreateQuestions = ({ user }) => {
  const [allQuestionsListing, setAllQuestionsListing] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [addQuestionsModal, setAddQuestionsModal] = useState(false);
  const [editQuestionsModal, setEditQuestionsModal] = useState(false);
  const [permission, setPermission] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entry, setEntry] = useState(10);

  const getAllQuestions = () => {
    axiosInstance
      .get(`/questions?page=${page}&limit=${entry}`)
      .then((response) => {
        setAllQuestionsListing(response.data.questions);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleDeleteAssesment = async () => {
    try {
      await axiosInstance.delete(`/question/${deleteId}`);
      setModalOpen(false);
      setDeleteId(null);
      getAllQuestions();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage != page) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    if (user) {
      setPermission(user.user.permissions);
    }
  }, [user]);

  useEffect(() => {
    getAllQuestions();
  }, [page, entry]);

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-lg">
          <div className="w-full text-center ">
            <div className="p-4 items-center border rounded-lg mb-5">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">Questions</span>
                {permission.includes("Add Question") && (
                  <div className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm p-1 text-center ">
                    <button
                      className="focus:outline-none p-2 text-sm"
                      onClick={() => setAddQuestionsModal(true)}
                    >
                      Add Question
                    </button>
                  </div>
                )}
              </div>
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
            </div>
          </div>
          <div className="relative overflow-x-auto rounded-lg shadow-md">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Index
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Questions
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allQuestionsListing.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-base font-semibold text-center"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  allQuestionsListing.map((item, index) => (
                    <tr key={item._id} className="text-black border-b gray-700">
                      <td className="px-6 py-4">{item.index}</td>
                      <td className="px-6 py-4 text-base">{item.question}</td>
                      <td className="flex items-center gap-2 mt-2">
                        {permission.includes("Update Question") && (
                          <div
                            className="bg-[#91868636] p-1 rounded hover:ring-1 hover:ring-slate-800"
                            onClick={() => {
                              setEditId(item._id);
                              setEditQuestionsModal(true);
                            }}
                          >
                            <FaRegEdit size={20} className="text-slate-600" />
                          </div>
                        )}
                        {permission.includes("Delete Question") && (
                          <button
                            className="bg-red-100 p-[2px] rounded hover:ring-1 hover:ring-red-800 focus:outline-red-300"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Delete"
                            onClick={() => {
                              setDeleteId(item._id);
                              setModalOpen(true);
                            }}
                          >
                            <MdDelete
                              size={24}
                              className="text-[#f35f5f] hover:text-red-600"
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
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
                {page !== totalPages && (
                  <li>
                    <a
                      href="#"
                      onClick={() => handlePageChange(page + 1)}
                      className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 "
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
          setModalOpen={setModalOpen}
          handleDeleteAssesment={handleDeleteAssesment}
        />
      )}
      {addQuestionsModal && (
        <AddQuestionsModal
          setAddQuestionsModal={setAddQuestionsModal}
          getAllQuestions={getAllQuestions}
        />
      )}
      {editQuestionsModal && (
        <EditQuestionsModal
          setEditQuestionsModal={setEditQuestionsModal}
          editId={editId}
          getAllQuestions={getAllQuestions}
        />
      )}
    </>
  );
};

export default CreateQuestions;
