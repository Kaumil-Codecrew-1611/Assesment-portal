import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const Questions = () => {
  const [ratings, setRatings] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [reason, setReason] = useState([]);
  const [ratingErrorMessage, setRatingErrorMessage] = useState(null);
  const [reasonError, setReasonError] = useState([]);
  const [firstUnansweredIndex, setFirstUnansweredIndex] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const allQuestionsListing = async () => {
    try {
      const response = await axiosInstance.get("/questions");
      const initialRatings = response.data.questions.map(() => 0);
      setAllQuestions(response.data.questions);
      setRatings(initialRatings);
      setReasonError(response.data.questions.map(() => false));
    } catch (error) {
      console.log("error", error);
    }
  };

  const addResponses = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const data = allQuestions.map((question, index) => {
        return {
          questionnaire_id: question._id,
          reason:
            ratings[index] === 1 || ratings[index] === 5 ? reason[index] : "",
          response: ratings[index],
        };
      });
      await axiosInstance.post(`/responses/${id}`, { data });
      navigate("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const index = ratings.findIndex((rating) => rating === 0);
    setFirstUnansweredIndex(index);
    if (index !== -1) {
      setRatingErrorMessage("Please give rating of this questions");
      isValid = false;
    } else {
      setRatingErrorMessage(null);
    }

    const reasonErrors = [];
    reason.forEach((r, index) => {
      if ((ratings[index] === 1 || ratings[index] === 5) && !r) {
        reasonErrors[index] = true;
        isValid = false;
      } else {
        reasonErrors[index] = false;
      }
    });
    setReasonError(reasonErrors);
    return isValid;
  };

  const handleStarClick = (selectedRating, questionIndex) => {
    setRatings((prevRatings) => {
      const newRatings = [...prevRatings];
      newRatings[questionIndex] =
        prevRatings[questionIndex] === selectedRating ? 0 : selectedRating;
      setRatingErrorMessage(null);
      return newRatings;
    });
  };

  const handleReasonChange = (index, value) => {
    setReason((prevReason) => {
      const newReason = [...prevReason];
      newReason[index] = value;
      return newReason;
    });
    if (value.trim() !== "") {
      setReasonError((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[index] = false;
        return newErrors;
      });
    }
  };

  const handleReasonBlur = (index) => {
    if (!reason[index]) {
      setReasonError((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[index] = true;
        return newErrors;
      });
    }
  };

  useEffect(() => {
    allQuestionsListing();
  }, []);

  return (
    <div className="p-4">
      <div className="w-full p-4">
        <div>
          <span className="text-2xl border-b-2">All questions</span>
        </div>
        <form>
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
                  <div className="flex items-center my-2">
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <svg
                        key={starIndex}
                        className={`w-6 h-6 ${
                          starIndex <= ratings[index]
                            ? "text-yellow-300"
                            : "text-gray-300 dark:text-gray-500"
                        } ms-1 cursor-pointer`}
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
                  {ratings[index] === 1 || ratings[index] === 5 ? (
                    <div className="mb-6">
                      <div className="mt-2">
                        <label htmlFor={`reason-${index}`}>
                          Give your reason:
                        </label>
                      </div>
                      <input
                        type="text"
                        id={`reason-${index}`}
                        placeholder="type reason"
                        className="block w-full p-2 border rounded-lg bg-white text-base"
                        value={reason[index] || ""}
                        onChange={(e) =>
                          handleReasonChange(index, e.target.value)
                        }
                        onBlur={() => handleReasonBlur(index)}
                      />
                      {reasonError[index] && (
                        <span className="text-red-600">
                          Please provide a reason.
                        </span>
                      )}
                    </div>
                  ) : (
                    index === firstUnansweredIndex && (
                      <span className="text-red-600">{ratingErrorMessage}</span>
                    )
                  )}
                </div>
              );
            })}
          </div>
          <div>
            <div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-3 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                onClick={addResponses}
              >
                Submit Form
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questions;
