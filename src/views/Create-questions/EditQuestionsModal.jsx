import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";

const EditQuestionsModal = ({
  setEditQuestionsModal,
  editId,
  getAllQuestions,
}) => {
  const [question, setQuestions] = useState();

  const handleEditQuestions = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/question/${editId}`, {
        question: question,
      });
      setEditQuestionsModal(false);
      getAllQuestions();
    } catch (error) {
      console.log("error", error);
    }
  };

  const getEditQuestionsData = () => {
    axiosInstance
      .get(`/question/${editId}`)
      .then((response) => {
        setQuestions(response.data.question);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getEditQuestionsData();
    return () => {
      setQuestions(null);
    };
  }, []);

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
            <form onSubmit={handleEditQuestions}>
              <div className="p-3 w-full bg-white border border-gray-200 rounded-lg shadow sm:p-8">
                <h2 className="font-semibold text-2xl text-start mb-2">
                  Edit Questions
                </h2>
                <div>
                  <div className="mb-5">
                    <label
                      htmlFor="base-input"
                      className="block text-sm font-medium text-black"
                    >
                      Question
                    </label>
                    <textarea
                      type="text"
                      id="base-input"
                      rows={3}
                      defaultValue={question}
                      onChange={(e) => setQuestions(e.target.value)}
                      className="border text-sm rounded-lg block w-full p-2.5"
                    />
                  </div>
                </div>
                <div className="me-2 mt-4">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                  >
                    Edit Question
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditQuestionsModal(false)}
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

export default EditQuestionsModal;
