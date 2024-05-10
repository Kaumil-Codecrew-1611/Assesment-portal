import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";

const EditUserReview = () => {
  const [ratings, setRatings] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [reason, setReason] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const allQuestionsListing = async () => {
    try {
      const response = await axiosInstance.get(`/responses/${id}`);
      const initialRatings = response.data.responses.map(
        (item) => item.response
      );
      const allQuestions = response.data.responses.map(
        (item) => item.questionnaire_id
      );
      const allReasons = response.data.responses.map((item) =>
        item.reason ? item.reason : null
      );
      setAllQuestions(allQuestions);
      setRatings(initialRatings);
      setReason(allReasons);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleStarClick = (selectedRating, questionIndex) => {
    setRatings((prevRatings) => {
      const newRatings = [...prevRatings];
      newRatings[questionIndex] =
        prevRatings[questionIndex] === selectedRating ? 0 : selectedRating;
      return newRatings;
    });
  };

  const handleReasonChange = (index, value) => {
    setReason((prevReason) => {
      const newReason = [...prevReason];
      newReason[index] = value;
      return newReason;
    });
  };

  const handleReSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const data = allQuestions.map((question, index) => {
        return {
          questionnaire_id: question._id,
          reason:
            ratings[index] === 1 || ratings[index] === 5 ? reason[index] : "",
          response: ratings[index],
        };
      });
      await axiosInstance.put(`/responses/${id}`, { data });
      navigate("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    allQuestionsListing();
  }, []);

  return (
    <div className="p-4">
      <div className="w-full p-4 pt-0">
        <div>
          <span className="text-2xl">Assignment</span>
        </div>
        <form onSubmit={handleReSubmitReview}>
          <div className="mt-3">
            {allQuestions.map((question, index) => {
              return (
                <div
                  key={index}
                  className="border rounded bg-white p-4 shadow-lg my-2"
                >
                  <div>
                    <span className="me-2 text-lg">{index + 1}.</span>
                    <span className="text-lg">{question.question}</span>
                  </div>
                  <div className="mt-2">
                    <strong>User Review</strong>
                  </div>
                  <div className="flex items-center my-2">
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <svg
                        key={starIndex}
                        className={`w-6 h-6 ${
                          starIndex <= ratings[index]
                            ? "text-yellow-300"
                            : "text-gray-300 dark:text-gray-500"
                        } ms-1`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                        onClick={() => handleStarClick(starIndex, index)}
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                  </div>
                  <div>
                    {ratings[index] === 1 || ratings[index] === 5 ? (
                      <div className="mb-6">
                        <div className="mt-2">
                          <label htmlFor={`reason-${index}`}>
                            Employee's reason:
                          </label>
                        </div>
                        <input
                          type="text"
                          id={`reason-${index}`}
                          placeholder="type reason"
                          className="block w-full p-2 border rounded-lg bg-white text-base"
                          defaultValue={reason[index]}
                          onChange={(e) =>
                            handleReasonChange(index, e.target.value)
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-3 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
              >
                Re-Submit Form
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserReview;
