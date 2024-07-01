import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../ZustandStore';
import { saveStateToLocalStorage } from '../../helper/SaveStateToLocalStorage';
import './ResumeForm.css';

function ResumeForm() {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      link: []
    },
    workExperience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
    education: [{ institution: '', degree: '', startDate: '', endDate: '', description: '' }],
    skills: [''],
  });

  const { setPersonalInfo, addWorkExperience, addEducation, addSkills } = useStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, key, index] = name.split('-');
    if (section === 'personalInfo') {
      setFormData((prevData) => ({
        ...prevData,
        personalInfo: { ...prevData.personalInfo, [key]: value },
      }));
    } else if (section === 'workExperience' || section === 'education') {
      setFormData((prevData) => {
        const updatedSection = [...prevData[section]];
        updatedSection[index][key] = value;
        return { ...prevData, [section]: updatedSection };
      });
    } else if (section === 'skills') {
      setFormData((prevData) => {
        const updatedSkills = [...prevData.skills];
        updatedSkills[index] = value;
        return { ...prevData, skills: updatedSkills };
      });
    }
  };

  const addWorkExperienceField = () => {
    setFormData((prevData) => ({
      ...prevData,
      workExperience: [...prevData.workExperience, { company: '', role: '', startDate: '', endDate: '', description: '' }],
    }));
  };

  const addEducationField = () => {
    setFormData((prevData) => ({
      ...prevData,
      education: [...prevData.education, { institution: '', degree: '', startDate: '', endDate: '', description: '' }],
    }));
  };

  const addSkillField = () => {
    setFormData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, ''],
    }));
  };

  const deleteField = (section, index) => {
    setFormData((prevData) => {
      const updatedSection = prevData[section].filter((_, i) => i !== index);
      return { ...prevData, [section]: updatedSection };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPersonalInfo(formData.personalInfo);
    formData.workExperience.forEach(exp => addWorkExperience(exp));
    formData.education.forEach(edu => addEducation(edu));
    addSkills(formData.skills);

    // Save the current form data to localStorage
    saveStateToLocalStorage(formData);

    navigate('/editor');
  };

  return (
    <form onSubmit={handleSubmit} className="resume-form">
      <h2>Personal Information</h2>
      <div className="work-experience-entry">
      <input type="text" name="personalInfo-name" placeholder="Name" value={formData.personalInfo.name} onChange={handleChange} />
      <input type="email" name="personalInfo-email" placeholder="Email" value={formData.personalInfo.email} onChange={handleChange} />
      <input type="text" name="personalInfo-phone" placeholder="Phone" value={formData.personalInfo.phone} onChange={handleChange} />
      <input type="text" name="personalInfo-address" placeholder="Address" value={formData.personalInfo.address} onChange={handleChange} />

      </div>
      <h2>Work Experience</h2>
      {formData.workExperience.map((exp, index) => (
        <div key={index} className="work-experience-entry">
          <input type="text" name={`workExperience-company-${index}`} placeholder="Company" value={exp.company} onChange={handleChange} />
          <input type="text" name={`workExperience-role-${index}`} placeholder="Role" value={exp.role} onChange={handleChange} />
          <input type="date" name={`workExperience-startDate-${index}`} placeholder="Start Date" value={exp.startDate} onChange={handleChange} />
          <input type="date" name={`workExperience-endDate-${index}`} placeholder="End Date" value={exp.endDate} onChange={handleChange} />
          <textarea name={`workExperience-description-${index}`} placeholder="Description" value={exp.description} onChange={handleChange}></textarea>
          {formData.workExperience.length > 1 && (
            <button type="button" onClick={() => deleteField('workExperience', index)}>Delete</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addWorkExperienceField}>Add Work Experience</button>

      <h2>Education</h2>
      {formData.education.map((edu, index) => (
        <div key={index} className="education-entry">
          <input type="text" name={`education-institution-${index}`} placeholder="Institution" value={edu.institution} onChange={handleChange} />
          <input type="text" name={`education-degree-${index}`} placeholder="Degree" value={edu.degree} onChange={handleChange} />
          <input type="date" name={`education-startDate-${index}`} placeholder="Start Date" value={edu.startDate} onChange={handleChange} />
          <input type="date" name={`education-endDate-${index}`} placeholder="End Date" value={edu.endDate} onChange={handleChange} />
          <textarea name={`education-description-${index}`} placeholder="Description" value={edu.description} onChange={handleChange}></textarea>
          {formData.education.length > 1 && (
            <button type="button" onClick={() => deleteField('education', index)}>Delete</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addEducationField}>Add Education</button>

      <h2>Skills</h2>
      {formData.skills.map((skill, index) => (
        <div key={index} className="skill-entry">
          <input type="text" name={`skills-skill-${index}`} placeholder="Skill" value={skill} onChange={handleChange} />
          {formData.skills.length > 1 && (
            <button type="button" onClick={() => deleteField('skills', index)}>Delete</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addSkillField}>Add Skill</button>

      <button type="submit">Proceed to Editor</button>
    </form>
  );
}

export default ResumeForm;
