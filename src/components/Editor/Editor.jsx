import React, { useEffect, useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import useStore from '../../ZustandStore';
import FormattingOptions from '../FormattingOptions/FormattingOptions';
import Modal from '../Modal/Modal';
import './Editor.css';
import "../Sidebar/Sidebar.css";
import "../Sidebar/Form.css";

// SidebarItem component
const SidebarItem = ({ type, name, onDelete, onClick, id }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type, name }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="sidebar-item" onClick={onClick}>
      {name}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="delete-button"
        >
          Delete
        </button>
      )}
    </div>
  );
};

// Sidebar component
const Sidebar = ({ handleEdit, handleAddNew, handleAddSection, handleDelete }) => {
  const {
    personalInfo,
    workExperience,
    education,
    skills,
    customSections,
  } = useStore((state) => ({
    personalInfo: state.personalInfo,
    workExperience: state.workExperience,
    education: state.education,
    skills: state.skills,
    customSections: state.customSections,
  }));

  return (
    <div className="sidebar">
      <h2>Sections</h2>
      <SidebarItem type="personalInfo" name="Personal Info" onClick={() => handleEdit('personalInfo', personalInfo)} />

      <h3>Work Experience</h3>
      {workExperience.length > 0 && (
        <>
          {workExperience.map((exp, index) => (
            <SidebarItem
              key={exp.id}
              type="workExperience"
              id={exp.id}
              name={`${exp.company} - ${exp.role}`}
              onClick={() => handleEdit('workExperience', exp, index)}
              onDelete={() => handleDelete('workExperience', index)}
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
              key={edu.id}
              type="education"
              id={edu.id}
              name={`${edu.institution} - ${edu.degree}`}
              onClick={() => handleEdit('education', edu, index)}
              onDelete={() => handleDelete('education', index)}
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
              key={skill.id}
              type="skills"
              id={skill.id}
              name={skill.skill}
              onClick={() => handleEdit('skills', skill, index)}
              onDelete={() => handleDelete('skills', index)}
            />
          ))}
        </>
      )}
      <button onClick={() => handleAddNew('skills')} className="add-button">Add New Skill</button>

      <h2>Custom Sections</h2>
      {customSections.length > 0 && customSections.map((section, index) => (
        <SidebarItem
          key={section.id}
          type={section.type}
          id={section.id}
          name={section.name}
          onClick={() => handleEdit('customSection', section, index)}
          onDelete={() => handleDelete('customSection', index)}
        />
      ))}
      <button onClick={handleAddSection} className="add-button">Add New Section</button>
      <button onClick={() => handleAddNew('customSection')} className="add-button">Add New Custom Entry</button>
    </div>
  );
};

// Form component
const Form = ({ type, entry, index, isNew, onSave }) => {
  const [formData, setFormData] = useState(entry);

  useEffect(() => {
    setFormData(entry);
  }, [entry]);

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

// Section component
const Section = ({ type, title, entries, onEdit, onRemoveEntry, onRemoveSection }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: type,
  });

  const style = {
    backgroundColor: isOver ? '#e0e0e0' : 'white',
  };

  return (
    <div ref={setNodeRef} className="section" style={style}>
      <h3>{title} <button onClick={onRemoveSection}>-</button></h3>
      {entries.map((entry, index) => (
        <div key={entry.id} className="resume-entry" onClick={() => onEdit(type, entry, index)}>
          <h4>{entry.company || entry.institution || entry.skill || entry.title}</h4>
          <p>{entry.role || entry.degree || entry.content}</p>
          <p>{entry.startDate} - {entry.endDate}</p>
          <p>{entry.description}</p>
          <button onClick={() => onRemoveEntry(type, index)}>-</button>
        </div>
      ))}
    </div>
  );
};

function Editor() {
  const { personalInfo, workExperience, education, skills, customSections } = useStore((state) => ({
    personalInfo: state.personalInfo,
    workExperience: state.workExperience,
    education: state.education,
    skills: state.skills,
    customSections: state.customSections,
  }));

  const [resumeData, setResumeData] = useState({
    personalInfo,
    workExperience,
    education,
    skills,
    customSections,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [formattingOptions, setFormattingOptions] = useState({
    font: 'Arial',
    color: '#000000',
    layout: 'single-column',
  });

  useEffect(() => {
    const data = localStorage.getItem('resumeData');
    if (data) {
      setResumeData(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    setResumeData({
      personalInfo,
      workExperience,
      education,
      skills,
      customSections,
    });
  }, [personalInfo, workExperience, education, skills, customSections]);

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  const handleFormatChange = ({ type, value }) => {
    setFormattingOptions((prevOptions) => ({
      ...prevOptions,
      [type]: value,
    }));
  };

  const handleDownload = (format) => {
    if (format === 'PDF') {
      generatePDF(resumeData);
    } else if (format === 'DOCX') {
      generateDOCX(resumeData);
    }
  };

  const handleEdit = (type, entry, index) => {
    setModalContent({ type, entry, index, isNew: false });
    setShowModal(true);
  };

  const saveEntry = (type, entry, index, isNew) => {
    setResumeData((prevData) => {
      const updatedData = { ...prevData };
      if (type === 'personalInfo') {
        updatedData.personalInfo = entry;
      } else {
        const section = updatedData[type];
        if (isNew) {
          section.push(entry);
        } else {
          section[index] = entry;
        }
      }
      return updatedData;
    });
    setShowModal(false);
  };

  const handleAddNew = (type) => {
    let blankEntry = {};
    if (type === 'workExperience') blankEntry = { id: new Date().toISOString(), company: '', role: '', startDate: '', endDate: '', description: '' };
    else if (type === 'education') blankEntry = { id: new Date().toISOString(), institution: '', degree: '', startDate: '', endDate: '', description: '' };
    else if (type === 'skills') blankEntry = { id: new Date().toISOString(), skill: '' };
    else if (type === 'customSection') blankEntry = { id: new Date().toISOString(), title: '', content: '' };
    else if (type === 'personalInfo') blankEntry = { name: '', email: '', phone: '', address: '' };

    setModalContent({ type, entry: blankEntry, isNew: true });
    setShowModal(true);
  };

  const handleAddSection = () => {
    const newSection = { id: new Date().toISOString(), type: 'customSection', name: `Custom Section ${customSections.length + 1}`, entries: [] };
    useStore.getState().addCustomSection(newSection);
  };

  const handleDelete = (type, index) => {
    if (type === 'workExperience') useStore.getState().deleteWorkExperience(index);
    else if (type === 'education') useStore.getState().deleteEducation(index);
    else if (type === 'skills') useStore.getState().deleteSkill(index);
    else if (type === 'customSection') useStore.getState().deleteCustomSection(index);
  };

  const handleRemoveEntry = (type, index) => {
    if (type === 'workExperience') useStore.getState().deleteWorkExperience(index);
    else if (type === 'education') useStore.getState().deleteEducation(index);
    else if (type === 'skills') useStore.getState().deleteSkill(index);
    else if (type === 'customSection') useStore.getState().deleteCustomSection(index);
  };

  const handleRemoveSection = (index) => {
    useStore.getState().deleteCustomSection(index);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over) {
      const activeData = active.data.current;
      const overData = over.data.current;

      if (activeData.type === overData.type) {
        const sourceSection = resumeData[activeData.type];
        const targetSection = resumeData[overData.type];

        const sourceIndex = sourceSection.findIndex(item => item.id === active.id);
        const targetIndex = targetSection.findIndex(item => item.id === over.id);

        const [movedItem] = sourceSection.splice(sourceIndex, 1);
        targetSection.splice(targetIndex, 0, movedItem);

        setResumeData({
          ...resumeData,
          [activeData.type]: sourceSection,
          [overData.type]: targetSection,
        });
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="editor-container">
        <Sidebar handleEdit={handleEdit} handleAddNew={handleAddNew} handleAddSection={handleAddSection} handleDelete={handleDelete} />
        <div className="editor" style={{ backgroundColor: 'white' }}>
          <FormattingOptions onFormatChange={handleFormatChange} />
          <div className="resume-preview" style={{ fontFamily: formattingOptions.font, color: formattingOptions.color }}>
            <h1>{resumeData.personalInfo.name}</h1>
            <h2>{resumeData.personalInfo.email}</h2>
            <h2>{resumeData.personalInfo.phone}</h2>
            <h2>{resumeData.personalInfo.address}</h2>
            
            <Section type="workExperience" title="Work Experience" entries={resumeData.workExperience} onEdit={handleEdit} onRemoveEntry={handleRemoveEntry} onRemoveSection={handleRemoveSection} />
            <Section type="education" title="Education" entries={resumeData.education} onEdit={handleEdit} onRemoveEntry={handleRemoveEntry} onRemoveSection={handleRemoveSection} />
            <Section type="skills" title="Skills" entries={resumeData.skills} onEdit={handleEdit} onRemoveEntry={handleRemoveEntry} onRemoveSection={handleRemoveSection} />
            <Section type="customSection" title="Custom Sections" entries={resumeData.customSections} onEdit={handleEdit} onRemoveEntry={handleRemoveEntry} onRemoveSection={handleRemoveSection} />
          </div>
          <button onClick={() => handleDownload('PDF')}>Download as PDF</button>
          <button onClick={() => handleDownload('DOCX')}>Download as DOCX</button>
        </div>
      </div>
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
    </DndContext>
  );
}

const generatePDF = async (resumeData) => {
  const { PDFDocument, rgb } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const page = doc.addPage();
  page.drawText(resumeData.personalInfo.name, { x: 50, y: 750, size: 20, color: rgb(0, 0, 0) });
  page.drawText(resumeData.personalInfo.email, { x: 50, y: 730, size: 12, color: rgb(0, 0, 0) });
  page.drawText(resumeData.personalInfo.phone, { x: 50, y: 710, size: 12, color: rgb(0, 0, 0) });
  page.drawText(resumeData.personalInfo.address, { x: 50, y: 690, size: 12, color: rgb(0, 0, 0) });

  let yPosition = 650;
  page.drawText('Work Experience', { x: 50, y: yPosition, size: 16, color: rgb(0, 0, 0) });
  yPosition -= 20;
  resumeData.workExperience.forEach(exp => {
    page.drawText(`${exp.company}: ${exp.role}`, { x: 50, y: yPosition, size: 12, color: rgb(0, 0, 0) });
    yPosition -= 15;
    page.drawText(`${exp.startDate} - ${exp.endDate}`, { x: 50, y: yPosition, size: 12, color: rgb(0, 0, 0) });
    yPosition -= 15;
    page.drawText(exp.description, { x: 50, y: yPosition, size: 12, color: rgb(0, 0, 0) });
    yPosition -= 30;
  });

  page.drawText('Education', { x: 50, y: yPosition, size: 16, color: rgb(0, 0, 0) });
  yPosition -= 20;
  resumeData.education.forEach(edu => {
    page.drawText(`${edu.institution}: ${edu.degree}`, { x: 50, y: yPosition, size: 12, color: rgb(0, 0, 0) });
    yPosition -= 15;
    page.drawText(`${edu.startDate} - ${edu.endDate}`, { x: 50, y: yPosition, size: 12, color: rgb(0, 0, 0) });
    yPosition -= 15;
    page.drawText(edu.description, { x: 50, y: yPosition, size: 12, color: rgb(0, 0, 0) });
    yPosition -= 30;
  });

  page.drawText('Skills', { x: 50, y: yPosition, size: 16, color: rgb(0, 0, 0) });
  yPosition -= 20;
  resumeData.skills.forEach(skill => {
    page.drawText(skill, { x: 50, y: yPosition, size: 12, color: rgb(0, 0, 0) });
    yPosition -= 15;
  });

  const pdfBytes = await doc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'resume.pdf';
  link.click();
};

const generateDOCX = (resumeData) => {
  const { Document, Packer, Paragraph, TextRun } = require('docx');
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(resumeData.personalInfo.name)],
          }),
          new Paragraph({
            children: [new TextRun(resumeData.personalInfo.email)],
          }),
          new Paragraph({
            children: [new TextRun(resumeData.personalInfo.phone)],
          }),
          new Paragraph({
            children: [new TextRun(resumeData.personalInfo.address)],
          }),
          new Paragraph({
            children: [new TextRun('Work Experience')],
          }),
          ...resumeData.workExperience.map(exp => new Paragraph({
            children: [
              new TextRun(`${exp.company}: ${exp.role}`),
              new TextRun(`\n${exp.startDate} - ${exp.endDate}`),
              new TextRun(`\n${exp.description}`),
            ],
          })),
          new Paragraph({
            children: [new TextRun('Education')],
          }),
          ...resumeData.education.map(edu => new Paragraph({
            children: [
              new TextRun(`${edu.institution}: ${edu.degree}`),
              new TextRun(`\n${edu.startDate} - ${edu.endDate}`),
              new TextRun(`\n${edu.description}`),
            ],
          })),
          new Paragraph({
            children: [new TextRun('Skills')],
          }),
          ...resumeData.skills.map(skill => new Paragraph({
            children: [new TextRun(skill)],
          })),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.docx';
    link.click();
  });
};

export default Editor;
