import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LinkUpdate = () => {
  const [formData, setFormData] = useState({
    internshipType: "",
    batchName: "",
    whatsappLink: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/link-update", formData);
      setMessage("Link updated successfully!");
    } catch (error) {
      setMessage("Failed to update link.");
    }
  };

  const internshipOptions = [
    "Content Writing & Marketing",
    "Volunteering / Social Work",
    "Social Media Marketing",
    "Product & Online Marketing",
  ];

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
        <div className="absolute top-4 right-4">
        <button
            onClick={handleLogout}
            className="bg-red-400 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 text-xs"
          >
            Logout
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">Link Update</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Internship Type</label>
            <select
              name="internshipType"
              value={formData.internshipType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            >
              <option value="">Select Internship</option>
              {internshipOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Batch Name</label>
            <input
              type="text"
              name="batchName"
              value={formData.batchName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">WhatsApp Link</label>
            <input
              type="text"
              name="whatsappLink"
              value={formData.whatsappLink}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white p-2 rounded mt-4 hover:bg-yellow-600"
          >
            Update Link
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default LinkUpdate;
