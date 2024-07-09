import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProvideCertificate = () => {
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/claims");
        setClaims(response.data);
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };
    fetchClaims();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSendCertificate = async (id, certType) => {
    try {
      await axios.post("http://localhost:5000/api/send-certificate", {
        id,
        certificateType: certType,
      });
      setMessage("Certificate sent successfully!");
      const response = await axios.get("http://localhost:5000/api/claims");
      setClaims(response.data);
    } catch (error) {
      setMessage("Failed to send certificate.");
    }
  };

  const handleMarkAsDone = async (id) => {
    try {
      await axios.post("http://localhost:5000/api/mark-done", { id });
      const response = await axios.get("http://localhost:5000/api/claims");
      setClaims(response.data);
    } catch (error) {
      console.error("Failed to mark as done:", error);
    }
  };

  const filteredClaims = claims.filter((claim) =>
    claim.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClaims.slice(indexOfFirstItem, indexOfLastItem);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 text-xs"
          >
            Logout
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">
          Provide Certificate
        </h1>
        {message && (
          <p className="text-center text-green-500 mb-4">{message}</p>
        )}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Gender</th>
                <th className="py-2 px-4 border">Batch Name</th>
                <th className="py-2 px-4 border">Certificate Wants</th>
                <th className="py-2 px-4 border">Claimed At</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((claim) => (
                <tr key={claim.id}>
                  <td className="py-2 px-4 border">{claim.name}</td>
                  <td className="py-2 px-4 border">{claim.email}</td>
                  <td className="py-2 px-4 border">{claim.gender}</td>
                  <td className="py-2 px-4 border">{claim.batchName}</td>
                  <td className="py-2 px-4 border">
                    {claim.certificateWanted
                      ? claim.certificateWanted.split(", ").map((certType) => (
                          <div key={certType} className="mb-2">
                            <Link
                              to={`/send-certificate/${claim.id}/${certType}`}
                              target="_blank"
                            >
                              <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 w-full mb-1">
                                Send {certType}
                              </button>
                            </Link>
                          </div>
                        ))
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border">{claim.claimed_at}</td>
                  <td className="py-2 px-4 border">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 w-full"
                      onClick={() => handleMarkAsDone(claim.id)}
                    >
                      Mark as Done
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {[
              ...Array(Math.ceil(filteredClaims.length / itemsPerPage)).keys(),
            ].map((number) => (
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
            ))}
          </div>
        </div>
        <div className="text-center mt-4">
          <Link
            to="/admin/sent-certificates"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            View Sent Certificates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProvideCertificate;
