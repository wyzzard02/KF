import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail, AiOutlineWhatsApp } from "react-icons/ai";
import { MdOutlineMale, MdOutlineFemale } from "react-icons/md";
import axios from "axios";
import logo from "../assets/logo.png";


function ContentWritingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    gender: "",
    batchName: "",
    whatsappLink: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/settings")
      .then((response) => {
        if (response.data) {
          setFormData((formData) => ({
            ...formData,
            whatsappLink: response.data.whatsappLink || "",
          }));
        }
      })
      .catch((error) => {
        console.error("Failed to fetch links", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors when input changes
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.batchName.trim()) errors.batchName = "Batch Name is required";
    if (!formData.whatsapp.trim()) errors.whatsapp = "WhatsApp Link is required";
    return errors;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      axios.post("http://localhost:5000/api/register/content-writing", formData)
        .then(response => {
          setShowModal(true);
          console.log("Success:", response.data);
        })
        .catch(error => {
          console.error("Registration Failed", error.response ? error.response.data : "Server error");
          setFormErrors({ form: "Failed to submit registration." });
        });
    } else {
      setFormErrors(errors);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/content-writing");
  };

  function Modal({ message, onClose }) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="text-center font-semibold ">
            Submission Confirmation
          </h2>
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </div>
        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 1000;
          }
          .modal-content {
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            width: 300px;
          }
          button {
            margin-top: 10px;
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover {
            background-color: #0056b3;
          }
        `}</style>
      </div>
    );
  }

  function Dropdown({ label, name, options, onChange, value }) {
    return (
      <div>
        <label className="text-gray-700 font-medium">{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          required
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-300 via-cyan-100 to-cyan-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mt-16 mb-8">
        {showModal && (
          <Modal
            message="Registration Successful!"
            onClose={handleCloseModal}
          />
        )}
        <div className="text-center">
          <img src={logo} alt="" className="mx-auto h-20 w-auto" />
          <h1 className="text-2xl font-bold text-purple-800 my-4 mb-2 font-radio tracking-wide">
            Internship Registration Form
          </h1>
          <p className="text-rose-600 uppercase mt-4 font font-radio mb-8 font-semibold">
          Content Writing & Marketing 

          </p>
        </div>{" "}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            icon={<FaUser />}
            name="name"
            label="Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
          <InputField
            icon={<AiOutlineMail />}
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            icon={<FaPhone />}
            name="phone"
            label="Phone"
            placeholder="Enter your Calling number"
            value={formData.phone}
            onChange={handleChange}
          />
          <InputField
            icon={<AiOutlineWhatsApp />}
            name="whatsapp"
            label="WhatsApp"
            placeholder="Enter your WhatsApp number"
            value={formData.whatsapp}
            onChange={handleChange}
          />
          <GenderSelection gender={formData.gender} onChange={handleChange} />
          <div className="space-y-3">
            <InputField
              icon={null}
              name="batchName"
              label="Batch Name"
              placeholder="Enter your batch name"
              value={formData.batchName}
              onChange={handleChange}
            />
            <p className="text-gray-700 font-radio font-medium mb-2">
              Please join the WhatsApp group, for easy flow and connectivity
              during internship:
            </p>
            <p>Whatsapp Link</p>
            <a
              href={formData.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700"
            >
              {formData.whatsappLink}
            </a>
            <div className="space-y-2">
              <Dropdown
                label="Have you joined the WhatsApp Group?"
                name="joinedWhatsAppGroup"
                value={formData.joinedWhatsAppGroup}
                onChange={handleChange}
                options={[
                  { label: "Select", value: "" },
                  { label: "Yes, I have joined", value: "yes" },
                  { label: "No, I haven't joined", value: "no" },
                ]}
              />
            </div>
            
          </div>
          <RadioButtonQuestion
            question="I understand this is an unpaid internship and the duration is one month."
            options={["Yes", "No"]}
            name="understandUnpaid"
            selectedOption={formData.understandUnpaid}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="btn bg-purple-700 hover:bg-purple-800 w-full rounded-full text-white py-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ icon, name, label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-gray-700 font-radio font-medium">{label}</label>
      <div className="flex items-center bg-gray-100 rounded-full pl-4 pr-2 py-2 mt-2">
        {icon && <span className="text-lg text-gray-500 mr-2">{icon}</span>}
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          className="input flex-1 bg-transparent outline-none"
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
}

function GenderSelection({ gender, onChange }) {
  return (
    <div>
      <label className="text-gray-700 block font-radio font-medium">
        Gender
      </label>
      <div className="flex items-center justify-between bg-gray-100 rounded-full pl-4 pr-2 py-2 mt-2">
        <div className="flex space-x-4">
          <GenderOption
            icon={<MdOutlineMale />}
            label="Male"
            name="gender"
            value="Male"
            checked={gender === "Male"}
            onChange={onChange}
          />
          <GenderOption
            icon={<MdOutlineFemale />}
            label="Female"
            name="gender"
            value="Female"
            checked={gender === "Female"}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}

function GenderOption({ icon, label, name, value, checked, onChange }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        className="radio radio-primary"
        checked={checked}
        onChange={onChange}
        required
      />
      {icon && <span className="text-lg text-gray-500">{icon}</span>}
      <span className="label-text">{label}</span>
    </label>
  );
}

function RadioButtonQuestion({
  question,
  options,
  name,
  selectedOption,
  onChange,
}) {
  return (
    <div>
      <p className="text-gray-700 mb-2 font-radio font-medium">{question}</p>
      <div className="flex items-center justify-between bg-gray-100 rounded-full pl-4 pr-2 py-2 mt-2">
        {options.map((option) => (
          <label
            className="flex items-center space-x-2 cursor-pointer"
            key={option}
          >
            <span className="label-text">{option}</span>
            <input
              type="radio"
              name={name}
              value={option}
              className="radio radio-primary"
              checked={selectedOption === option}
              onChange={onChange}
              required
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export default ContentWritingForm;
