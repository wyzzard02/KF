import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try{
    const response = await axios.post("http://localhost:3000/adminLogout")
    console.log(response.data.message)
    navigate("/");
    }
    catch(e)
    {
      console.log('logout failed with error ', e)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 text-sm"
          >
            Logout
          </button>
        </div>
        <div className="text-center mb-8">
          <img src="logo.png" alt="Foundation Logo" className="mx-auto h-20 w-auto" />
          <h1 className="text-4xl font-extrabold mt-4 text-gray-800">Kshitisha Foundation Admin Portal</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/admin/provide-certificate")}
            className="bg-green-500 text-white py-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Provide Certificate
          </button>
          <button
            onClick={() => navigate("/admin/link-update")}
            className="bg-yellow-500 text-white py-4 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
          >
            Link Update
          </button>
          <button
            onClick={() => navigate("/admin/show-database")}
            className="bg-red-500 text-white py-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          >
            Show Database
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
