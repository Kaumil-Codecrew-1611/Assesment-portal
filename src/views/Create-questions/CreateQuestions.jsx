import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../axios/axiosInstance";
import DeleteModal from "../../plugin/DeleteModal";
import AddQuestionsModal from "./AddQuestionsModal";
import EditQuestionsModal from "./EditQuestionsModal";
import ReactPaginate from "react-paginate";
import "../../../src/index.css";

const CreateQuestions = ({ user }) => {
  const [allQuestionsListing, setAllQuestionsListing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [addQuestionsModal, setAddQuestionsModal] = useState(false);
  const [editQuestionsModal, setEditQuestionsModal] = useState(false);
  const [permission, setPermission] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entry] = useState(10);
  const [dataperPage, setDataperPage] = useState(entry);

  const getAllQuestions = () => {
    axiosInstance
      .get(`/questions?page=${page}&limit=${dataperPage}`)
      .then((response) => {
        console.log("This is a very important", response);
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

  const PageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const setPerPage = (value) => {
    setDataperPage(value);
    setPage(1);
  };

  useEffect(() => {
    if (user) {
      setPermission(user.user.permissions);
    }
  }, []);

  useEffect(() => {
    getAllQuestions();
  }, [page, dataperPage]);

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-lg">
          <div className="w-full text-center ">
            <div className="p-4 items-center border rounded-lg mb-5">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">Questions</span>
                {permission.includes("Add Question") ? (
                  <div className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm p-1 text-center ">
                    <button
                      className="focus:outline-none p-2 text-sm"
                      onClick={() => setAddQuestionsModal(true)}
                    >
                      Add Question
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div
                id="user-list-table_length"
                className="w-[10%] flex gap-2 items-center"
              >
                <div>
                  <label>Show :-</label>
                </div>
                <div>
                  <select
                    name="user-list-table_length"
                    aria-controls="user-list-table"
                    className="border rounded-lg p-1 bg-slate-100"
                    onChange={(e) => setPerPage(e.target.value)}
                    defaultValue={entry}
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
                {allQuestionsListing &&
                  allQuestionsListing.map((items, index) => {
                    return (
                      <tr
                        key={items._id}
                        className="text-black border-bgray-700"
                      >
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 text-base">
                          {items.question}
                        </td>
                        <td className="flex items-center gap-2 mt-2">
                          {permission?.length > 0 &&
                            permission.includes("Update Question") && (
                              <div
                                className="bg-[#91868636] p-1 rounded hover:ring-1 hover:ring-slate-800"
                                onClick={() => {
                                  setEditId(items._id);
                                  setEditQuestionsModal(true);
                                }}
                              >
                                <FaRegEdit
                                  size={20}
                                  className="text-slate-600"
                                />
                              </div>
                            )}
                          {permission?.length > 0 &&
                            permission.includes("Delete Question") && (
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
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <hr />
            <div className="flex justify-end">
              <div className="">
                <ReactPaginate
                  previousLabel="Previous"
                  nextLabel="Next"
                  pageCount={totalPages}
                  onPageChange={PageChange}
                  containerClassName="pagination"
                  previousLinkClassName="pagination__link"
                  nextLinkClassName="pagination__link"
                  disabledClassName="pagination__link--disabled"
                  activeClassName="pagination__link--active"
                />
              </div>
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
