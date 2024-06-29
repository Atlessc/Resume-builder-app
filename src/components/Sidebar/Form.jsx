import React, { useState } from 'react';
import './Form.css';

const Form = ({ type, entry, index, isNew, onSave }) => {
  const [formData, setFormData] = useState(entry);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(type, formData, index, isNew);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {type === 'personalInfo' && (
        <>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          <label>Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </>
      )}
      {type === 'workExperience' && (
        <>
          <label>Company</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} />
          <label>Role</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} />
          <label>Start Date</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          <label>End Date</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </>
      )}
      {type === 'education' && (
        <>
          <label>Institution</label>
          <input type="text" name="institution" value={formData.institution} onChange={handleChange} />
          <label>Degree</label>
          <input type="text" name="degree" value={formData.degree} onChange={handleChange} />
          <label>Start Date</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          <label>End Date</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </>
      )}
      {type === 'skills' && (
        <>
          <label>Skill</label>
          <input type="text" name="skill" value={formData.skill} onChange={handleChange} />
        </>
      )}
      {type === 'customSection' && (
        <>
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
          <label>Content</label>
          <textarea name="content" value={formData.content} onChange={handleChange} />
        </>
      )}
      <button type="submit">Save</button>
    </form>
  );
};

export default Form;
