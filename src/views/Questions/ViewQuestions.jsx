import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import { Link, useParams } from "react-router-dom";

const Questions = ({ user }) => {
  const [ratings, setRatings] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [reason, setReason] = useState([]);
  const [employee, setEmaloyee] = useState({});
  const [reportingUser, setReportingUser] = useState([]);
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
      const isReportingUser = response.data.responses.some(
        (item) => item.submitted
      );
      const allReportingResponse =
        isReportingUser &&
        response.data.responses.map((item) =>
          item.submitted ? item.submitted : null
        );
      setAllQuestions(allQuestions);
      setRatings(initialRatings);
      setReason(allReasons);
      setReportingUser(allReportingResponse || []);
      const employeeDetails = response.data.responses.find(
        (item) => item.employee_id
      );
      setEmaloyee(employeeDetails.employee_id);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    allQuestionsListing();
  }, []);

  return (
    <div className="p-4">
      <div className="m-4 mt-2 mb-6">
        <div className="mb-3">
          <span className="text-2xl">Employee details</span>
        </div>
        {employee && (
          <div className="grid grid-cols-2 grid-rows-2 p-4 bg-gray-50 border rounded">
            <div className="p-2">
              <h3 className="font-bold">Name</h3>
              <span className="capitalize">{`${employee.firstname} ${employee.last_name}`}</span>
            </div>
            <div className="p-2">
              <h3 className="font-bold">Employee code</h3>
              <span>{employee.emp_code}</span>
            </div>
            <div className="p-2">
              <h3 className="font-bold">Personal email</h3>
              <span>{employee.personal_email}</span>
            </div>
            <div className="p-2">
              <h3 className="font-bold">Company email</h3>
              <span>{employee.company_email}</span>
            </div>
          </div>
        )}
      </div>
      <div className="w-full p-4 pt-0">
        <div>
          <span className="text-2xl">Assignment</span>
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
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                  </div>
                  <div>
                    {(ratings[index] === 1 || ratings[index] === 5) &&
                    reason[index] ? (
                      <div className="mb-6">
                        <div className="mt-2">
                          <label htmlFor={`reason-${index}`}>
                            Employee's reason:
                          </label>
                        </div>
                        <span>{reason[index]}</span>
                      </div>
                    ) : null}
                  </div>
                  {reportingUser.length > 0 && (
                    <>
                      <hr className="my-4" />
                      <span>
                        <strong>Reporting user</strong>
                      </span>
                      <div className="flex items-center my-2">
                        {[1, 2, 3, 4, 5].map((starIndex) => (
                          <svg
                            key={starIndex}
                            className={`w-6 h-6 ${
                              starIndex <= reportingUser[index]?.response
                                ? "text-yellow-300"
                                : "text-gray-300 dark:text-gray-500"
                            } ms-1`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ))}
                      </div>
                      <div>
                        {reportingUser[index]?.reason ? (
                          <div className="mb-6">
                            <div className="mt-2">
                              <label htmlFor={`reason-${index}`}>
                                Reporting's reason:
                              </label>
                            </div>
                            <span>{reportingUser[index]?.reason}</span>
                          </div>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div>
            <div className="mt-5">
              <Link
                to="/"
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questions;
