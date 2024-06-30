import React, { useState } from 'react';
import useStore from '../../ZustandStore';
import Modal from '../Modal/Modal';
import Form from './Form';
import './Sidebar.css';

const SidebarItem = ({ type, name, onDelete, onClick, index }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { type, name, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="sidebar-item" style={{ opacity: isDragging ? 0.5 : 1 }} onClick={onClick}>
      {name}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
          className="delete-button"
        >
          Delete
        </button>
      )}
    </div>
  );
};

const Sidebar = () => {
  const {
    personalInfo,
    workExperience,
    education,
    skills,
    customSections,
    addCustomSection,
    updatePersonalInfo,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkills,
    updateSkill,
    deleteSkill,
    updateCustomSectionEntry,
    deleteCustomSection,
  } = useStore((state) => ({
    personalInfo: state.personalInfo,
    workExperience: state.workExperience,
    education: state.education,
    skills: state.skills,
    customSections: state.customSections,
    addCustomSection: state.addCustomSection,
    updatePersonalInfo: state.updatePersonalInfo,
    addWorkExperience: state.addWorkExperience,
    updateWorkExperience: state.updateWorkExperience,
    deleteWorkExperience: state.deleteWorkExperience,
    addEducation: state.addEducation,
    updateEducation: state.updateEducation,
    deleteEducation: state.deleteEducation,
    addSkills: state.addSkills,
    updateSkill: state.updateSkill,
    deleteSkill: state.deleteSkill,
    updateCustomSectionEntry: state.updateCustomSectionEntry,
    deleteCustomSection: state.deleteCustomSection,
  }));

  const [customSectionCounter, setCustomSectionCounter] = useState(customSections.length);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleAddSection = () => {
    const newSection = { type: 'customSection', name: `Custom Section ${customSectionCounter + 1}`, entries: [] };
    setCustomSectionCounter(customSectionCounter + 1);
    addCustomSection(newSection);
  };

  const handleAddNew = (type) => {
    let blankEntry = {};
    if (type === 'workExperience') blankEntry = { company: '', role: '', startDate: '', endDate: '', description: '' };
    else if (type === 'education') blankEntry = { institution: '', degree: '', startDate: '', endDate: '', description: '' };
    else if (type === 'skills') blankEntry = { skill: '' };
    else if (type === 'customSection') blankEntry = { title: '', content: '' };
    else if (type === 'personalInfo') blankEntry = { name: '', email: '', phone: '', address: '' };

    setModalContent({ type, entry: blankEntry, isNew: true });
    setShowModal(true);
  };

  const handleEdit = (type, entry, index) => {
    setModalContent({ type, entry, index, isNew: false });
    setShowModal(true);
  };

  const saveEntry = (type, entry, index, isNew) => {
    if (type === 'personalInfo') {
      updatePersonalInfo(entry);
    } else if (type === 'workExperience') {
      if (isNew) addWorkExperience(entry);
      else updateWorkExperience(index, entry);
    } else if (type === 'education') {
      if (isNew) addEducation(entry);
      else updateEducation(index, entry);
    } else if (type === 'skills') {
      if (isNew) addSkills([...skills, entry]);
      else updateSkill(index, entry);
    } else if (type === 'customSection') {
      if (isNew) addCustomSection(entry);
      else updateCustomSectionEntry(index, entry);
    }
    setShowModal(false);
  };

  const handleDelete = (type, index) => {
    if (type === 'workExperience') deleteWorkExperience(index);
    else if (type === 'education') deleteEducation(index);
    else if (type === 'skills') deleteSkill(index);
    else if (type === 'customSection') deleteCustomSection(index);
  };

  return (
    <div className="sidebar">
      <h2>Sections</h2>
      <SidebarItem type="personalInfo" name="Personal Info" onClick={() => handleEdit('personalInfo', personalInfo)} />

      <h3>Work Experience</h3>
      {workExperience.length > 0 && (
        <>
          {workExperience.map((exp, index) => (
            <SidebarItem
              key={`workExperience-${index}`}
              type="workExperience"
              name={`${exp.company} - ${exp.role}`}
              onClick={() => handleEdit('workExperience', exp, index)}
              onDelete={() => handleDelete('workExperience', index)}
              index={index}
            />
          ))}
        </>
      )}
      <button onClick={() => handleAddNew('workExperience')} className="add-button">Add New Experience</button>

      <h3>Education</h3>
      {education.length > 0 && (
        <>
          {education.map((edu, index) => (
            <SidebarItem
              key={`education-${index}`}
              type="education"
              name={`${edu.institution} - ${edu.degree}`}
              onClick={() => handleEdit('education', edu, index)}
              onDelete={() => handleDelete('education', index)}
              index={index}
            />
          ))}
        </>
      )}
      <button onClick={() => handleAddNew('education')} className="add-button">Add New Education</button>

      <h3>Skills</h3>
      {skills.length > 0 && (
        <>
          {skills.map((skill, index) => (
            <SidebarItem
              key={`skills-${index}`}
              type="skills"
              name={skill.skill}
              onClick={() => handleEdit('skills', skill, index)}
              onDelete={() => handleDelete('skills', index)}
              index={index}
            />
          ))}
        </>
      )}
      <button onClick={() => handleAddNew('skills')} className="add-button">Add New Skill</button>

      <h2>Custom Sections</h2>
      {customSections.length > 0 && customSections.map((section, index) => (
        <SidebarItem
          key={section.name}
          type={section.type}
          name={section.name}
          onClick={() => handleEdit('customSection', section, index)}
          onDelete={() => handleDelete('customSection', index)}
          index={index}
        />
      ))}
      <button onClick={handleAddSection} className="add-button">Add New Section</button>
      <button onClick={() => handleAddNew('customSection')} className="add-button">Add New Custom Entry</button>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        {modalContent && (
          <Form
            type={modalContent.type}
            entry={modalContent.entry}
            index={modalContent.index}
            isNew={modalContent.isNew}
            onSave={saveEntry}
          />
        )}
      </Modal>
    </div>
  );
};

export default Sidebar;
