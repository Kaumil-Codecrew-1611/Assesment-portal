import React, { useEffect, useRef, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";
import DefaultImage from "../../assets/images/images.png";

const UserProfile = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [userRoleName, setUserRoleName] = useState("");
  const [userImage, setUserImage] = useState("");
  const imageUrl = import.meta.env.VITE_IMAGE_KEY;

  const logout = () => {
    try {
      dispatch(logoutUser());
      navigate("/auth/login");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setUserName(user?.user?.userdata?.firstname);
    setUserRoleName(user?.user?.roleData?.role_name);
    setUserImage(imageUrl + user?.user?.userdata?.photo);
  }, [user]);

  return (
    <>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 dark:bg-gray-800 relative z-10">
        <div className="flex flex-wrap justify-end items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              id="dropdownDefaultButton"
              data-dropdown-toggle="dropdown"
              className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:outline-none"
              type="button"
              onClick={handleToggleDropdown}
            >
              <div className="flex items-center gap-3">
                <div className="overflow-hidden rounded-full">
                  <img
                    className="w-14 h-14 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                    src={
                      userImage.match(/\.(jpeg|jpg|gif|png)$/) != null
                        ? userImage
                        : DefaultImage
                    }
                    alt="User Profil"
                  />
                </div>
                <div>
                  <div className="flex flex-col items-start">
                    <h4 className="capitalize text-base">{userName || ""}</h4>
                    <span className="text-xs text-gray-300">
                      {userRoleName || ""}
                    </span>
                  </div>
                </div>
              </div>
            </button>
            {dropdownOpen && (
              <div
                id="dropdown"
                className="z-10 absolute top-16 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    <div
                      onClick={logout}
                      className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 cursor-pointer flex items-center gap-2 "
                    >
                      <span>Log out</span>
                      <div className="text-white">
                        <IoIosLogOut size={20} />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default UserProfile;
