import React, { useEffect, useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useStore from '../../ZustandStore';
import Sidebar from '../Sidebar/Sidebar';
import FormattingOptions from '../FormattingOptions/FormattingOptions';
import Modal from '../Modal/Modal';
import Form from '../Sidebar/Form';
import Section from './Section'; // Ensure you have a Section component
import './Editor.css';

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

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['workExperience', 'education', 'skills', 'customSection'],
    drop: (item, monitor) => {
      console.log(`Dropped item of type ${item.type} at index ${item.index}`);
      // Handle the drop logic here
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="editor-container">
        <Sidebar />
        <div className="editor" ref={drop} style={{ backgroundColor: isOver ? '#f0f0f0' : 'white' }}>
          <FormattingOptions onFormatChange={handleFormatChange} />
          <div className="resume-preview" style={{ fontFamily: formattingOptions.font, color: formattingOptions.color }}>
            <h1>{resumeData.personalInfo.name}</h1>
            <h2>{resumeData.personalInfo.email}</h2>
            <h2>{resumeData.personalInfo.phone}</h2>
            <h2>{resumeData.personalInfo.address}</h2>
            
            <Section type="workExperience" title="Work Experience" entries={resumeData.workExperience} onEdit={handleEdit} />
            <Section type="education" title="Education" entries={resumeData.education} onEdit={handleEdit} />
            <Section type="skills" title="Skills" entries={resumeData.skills} onEdit={handleEdit} />
            <Section type="customSection" title="Custom Sections" entries={resumeData.customSections} onEdit={handleEdit} />
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
    </DndProvider>
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
