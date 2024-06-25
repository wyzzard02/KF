import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai"; // Importing a heart icon

function VolunteeringFormStartPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-gradient-to-b from-cyan-300 via-cyan-100 to-cyan-50 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        {Array.from({ length: 15 }).map((_, index) => (
          <AiOutlineHeart
            key={index}
            className="absolute text-sky-500"
            style={{
              fontSize: `${Math.random() * (120 - 20) + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
              animation: `float 5s ease-in-out infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      <div className="text-center z-10">
        <img
          src="logo.png"
          alt="Kshitiksha Foundation Logo"
          className="w-32 h-32 mb-4 mx-auto"
        />
        <h1 className="text-black text-3xl md:text-5xl font-radio font-bold mb-2">
          Internship Registration Form
        </h1>
        <p className="text-black text-lg mb-6 mt-4 font-inter font-medium ">Kshitiksha Foundation</p>
        <button
          className="bg-gradient-to-r from-purple-500 to-purple-800 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:from-purple-700 hover:to-purple-900 transition duration-300"
          onClick={() => navigate("/volunteering/register")}
        >
          START
        </button>
      </div>
    </div>
  );
}

export default VolunteeringFormStartPage;
