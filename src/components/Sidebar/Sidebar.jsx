import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import useStore from '../../ZustandStore';
import Modal from '../Modal/Modal';
import Form from './Form';
import './Sidebar.css';

const SidebarItem = ({ type, name, onDelete, onClick, index }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { name, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="sidebar-item" style={{ opacity: isDragging ? 0.5 : 1 }} onClick={onClick}>
      {name}
      {onDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(index); }} className="delete-button">Delete</button>}
    </div>
  );
};

const Sidebar = () => {
  const { personalInfo, workExperience, education, skills, customSections } = useStore((state) => ({
    personalInfo: state.personalInfo,
    workExperience: state.workExperience,
    education: state.education,
    skills: state.skills,
    customSections: state.customSections,
  }));

  const [customSectionCounter, setCustomSectionCounter] = useState(customSections.length);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const addSection = () => {
    const newSection = { type: 'customSection', name: `Custom Section ${customSectionCounter + 1}`, entries: [] };
    setCustomSectionCounter(customSectionCounter + 1);
    useStore.getState().addCustomSection(newSection);
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
      useStore.getState().updatePersonalInfo(entry);
    } else if (type === 'workExperience') {
      if (isNew) useStore.getState().addWorkExperience(entry);
      else useStore.getState().updateWorkExperience(index, entry);
    } else if (type === 'education') {
      if (isNew) useStore.getState().addEducation(entry);
      else useStore.getState().updateEducation(index, entry);
    } else if (type === 'skills') {
      if (isNew) useStore.getState().addSkills([...skills, entry]);
      else useStore.getState().updateSkill(index, entry);
    } else if (type === 'customSection') {
      if (isNew) useStore.getState().addCustomSectionEntry(entry);
      else useStore.getState().updateCustomSectionEntry(index, entry);
    }
    setShowModal(false);
  };

  const deleteEducation = (index) => {
    useStore.getState().deleteEducation(index);
  };

  const deleteWorkExperience = (index) => {
    useStore.getState().deleteWorkExperience(index);
  };

  const deleteSkill = (index) => {
    useStore.getState().deleteSkill(index);
  };

  const deleteSection = (index) => {
    useStore.getState().deleteCustomSection(index);
  };

  return (
    <div className="sidebar">
      <h2>Sections</h2>
      <SidebarItem type="section" name="Personal Info" onClick={() => handleEdit('personalInfo', personalInfo)} />
      <h3>Work Experience</h3>
      {workExperience.length > 0 && (
        <>
          {workExperience.map((exp, index) => (
            <div key={`workExperience-${index}`}>
              <SidebarItem 
                type="workExperience" 
                name={`${exp.company} - ${exp.role}`} 
                onClick={() => handleEdit('workExperience', exp, index)} 
                onDelete={() => deleteWorkExperience(index)} 
                index={index} 
              />
            </div>
          ))}
        </>
      )}
      <button onClick={() => handleAddNew('workExperience')} className="add-button">Add New Exp</button>
      <h3>Education</h3>
      {education.length > 0 && (
        <>
          {education.map((edu, index) => (
            <div key={`education-${index}`}>
              <SidebarItem 
                type="education" 
                name={`${edu.institution} - ${edu.degree}`} 
                onClick={() => handleEdit('education', edu, index)} 
                onDelete={() => deleteEducation(index)} 
                index={index} 
              />
            </div>
          ))}
        </>
      )}
      <button onClick={() => handleAddNew('education')} className="add-button">Add New Edu</button>
      <h3>Skills</h3>
      {skills.length > 0 && (
        <>
          {skills.map((skill, index) => (
            <div key={`skills-${index}`}>
              <SidebarItem 
                type="skills" 
                name={skill.skill} 
                onClick={() => handleEdit('skills', skill, index)} 
                onDelete={() => deleteSkill(index)} 
                index={index} 
              />
            </div>
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
          onDelete={() => deleteSection(index)}
          onClick={() => handleEdit('customSection', section, index)}
          index={index}
        />
      ))}
      <button onClick={addSection} className="add-button">Add New Section</button>
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
