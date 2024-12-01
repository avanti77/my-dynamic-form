import React, { useState } from "react";
import "./App.css"; // Add your responsive CSS styles here.

const App = () => {
  // Simulated API responses
  const apiResponses = {
    userInfo: {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    addressInfo: {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        { name: "state", type: "dropdown", label: "State", options: ["California", "Texas", "New York","India"], required: true },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    paymentInfo: {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };

  const [formType, setFormType] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [submittedData, setSubmittedData] = useState([]);

  const handleFormTypeChange = (event) => {
    const selectedType = event.target.value;
    setFormType(selectedType);
    setFormFields(apiResponses[selectedType]?.fields || []);
    setFormData({});
    setFormErrors({});
    setProgress(0);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    // Update progress
    const filledFields = Object.keys(updatedData).filter(
      (key) => updatedData[key] !== "" && formFields.find((field) => field.name === key)?.required
    ).length;
    const totalRequiredFields = formFields.filter((field) => field.required).length;
    setProgress((filledFields / totalRequiredFields) * 100);
  };

  const validateForm = () => {
    const errors = {};
    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} is required`;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      setSubmittedData([...submittedData, { ...formData, id: Date.now() }]);
      alert("Form submitted successfully!");
      setFormData({});
      setProgress(0);
    }
  };

  const handleEdit = (id) => {
    const dataToEdit = submittedData.find((data) => data.id === id);
    setFormData(dataToEdit);
    setFormType(formType); // Retain the same form type.
    setSubmittedData(submittedData.filter((data) => data.id !== id));
  };

  const handleDelete = (id) => {
    setSubmittedData(submittedData.filter((data) => data.id !== id));
    alert("Entry deleted successfully!");
  };

  return (
    <div className="app">
      <header>
        <h1>Dynamic Form</h1>
      </header>
      <main>
        <div className="form-type-selector">
          <label htmlFor="formType">Select Form Type:</label>
          <select id="formType" value={formType} onChange={handleFormTypeChange}>
            <option value="">-- Select --</option>
            <option value="userInfo">User Information</option>
            <option value="addressInfo">Address Information</option>
            <option value="paymentInfo">Payment Information</option>
          </select>
        </div>

        {formFields.length > 0 && (
          <form onSubmit={handleFormSubmit}>
            {formFields.map((field) => (
              <div key={field.name} className="form-field">
                <label htmlFor={field.name}>{field.label}:</label>
                {field.type === "dropdown" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select --</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                  />
                )}
                {formErrors[field.name] && <p className="error">{formErrors[field.name]}</p>}
              </div>
            ))}

            <div className="progress-bar">
              <div style={{ width: `${progress}%` }} className="progress" />
            </div>

            <button type="submit">Submit</button>
          </form>
        )}

        {submittedData.length > 0 && (
          <div className="submitted-data">
            <h2>Submitted Data</h2>
            <table>
              <thead>
                <tr>
                  {Object.keys(submittedData[0]).map((key) => (
                    key !== "id" && <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedData.map((data) => (
                  <tr key={data.id}>
                    {Object.entries(data).map(
                      ([key, value]) => key !== "id" && <td key={key}>{value}</td>
                    )}
                    <td>
                      <button onClick={() => handleEdit(data.id)}>Edit</button>
                      <button onClick={() => handleDelete(data.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <footer>
        <p>&copy; 2024 Dynamic Form App</p>
      </footer>
    </div>
  );
};

export default App;
