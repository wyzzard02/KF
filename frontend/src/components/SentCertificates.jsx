import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SentCertificates = () => {
  const [sentCertificates, setSentCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchSentCertificates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/sent-certificates"
        );
        setSentCertificates(response.data);
      } catch (error) {
        console.error("Error fetching sent certificates:", error);
      }
    };
    fetchSentCertificates();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCertificates = sentCertificates.filter((cert) =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCertificates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Sent Certificates
        </h1>
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
                <th className="py-2 px-4 border">Certificate Type</th>
                <th className="py-2 px-4 border">Sent At</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((cert) => (
                <tr key={cert.id}>
                  <td className="py-2 px-4 border">{cert.name}</td>
                  <td className="py-2 px-4 border">{cert.email}</td>
                  <td className="py-2 px-4 border">{cert.gender}</td>
                  <td className="py-2 px-4 border">{cert.batchName}</td>
                  <td className="py-2 px-4 border">{cert.certificateType}</td>
                  <td className="py-2 px-4 border">{cert.sent_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {[
              ...Array(
                Math.ceil(filteredCertificates.length / itemsPerPage)
              ).keys(),
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
            to="/admin/provide-certificate"
            className="mt-4 inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Claim Certificate section
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SentCertificates;
