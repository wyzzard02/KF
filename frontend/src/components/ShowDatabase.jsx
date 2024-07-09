import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowDatabase = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const [selectedDatabase, setSelectedDatabase] = useState("donations");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (selectedDatabase === "donations") {
          response = await axios.get("http://localhost:3000/getDonations");
        } else if (selectedDatabase === "registrations") {
          response = await axios.get("http://localhost:3000/getRegistrations");
        }
        console.log(response.data);
        setData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };

    fetchData();
  }, [selectedDatabase]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDatabaseChange = (e) => {
    setSelectedDatabase(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = data
    .filter((entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((entry) => {
      if (filter === "all") return true;
      if (filter === "recent") {
        const date = new Date(entry.created_at);
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        return date >= lastWeek;
      }
      return false;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 text-xs"
          >
            Logout
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">Show Database</h1>
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
          <select
            className="p-2 border border-gray-300 rounded mb-2 md:mb-0 md:mr-2"
            onChange={handleFilterChange}
            value={filter}
          >
            <option value="all">All</option>
            <option value="recent">Recent</option>
          </select>
          
          <select
            className="p-2 border border-gray-300 rounded mb-2 md:mb-0 md:mr-2 ml-28 font-extrabold tracking-wide"
            onChange={handleDatabaseChange}
            value={selectedDatabase}
          >
            <option value="donations">Donations</option>
            <option value="registrations">Registrations</option>
          </select>

          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded mb-2 md:mb-0"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">
                  {selectedDatabase === "donations" ? "City" : "Phone"}
                </th>
                <th className="py-2 px-4 border">
                  {selectedDatabase === "donations" ? "Amount" : "Course"}
                </th>
                {selectedDatabase === "donations" ? (
                  <th className="py-2 px-4 border">Receipt</th>
                ) : null}
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((entry) => (
                <tr key={entry.id}>
                  <td className="py-2 px-4 border">{entry.name}</td>
                  <td className="py-2 px-4 border">{entry.email}</td>
                  <td className="py-2 px-4 border">
                    {selectedDatabase === "donations"
                      ? entry.city
                      : entry.phone}
                  </td>
                  <td className="py-2 px-4 border">
                    {selectedDatabase === "donations"
                      ? entry.amount
                      : entry.course}
                  </td>
                  {selectedDatabase === "donations" ? (
                    <td className="py-2 px-4 border">
                      <a
                        href={`http://localhost:5000/uploads/${entry.receipt}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        View Receipt
                      </a>
                    </td>
                  ) : null}
                  <td className="py-2 px-4 border">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          {[...Array(Math.ceil(filteredData.length / itemsPerPage)).keys()].map(
            (number) => (
              <button
                key={number}
                onClick={() => paginate(number + 1)}
                className={`px-4 py-2 mx-1 ${
                  currentPage === number + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {number + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowDatabase;
