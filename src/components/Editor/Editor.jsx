import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useStore from '../../ZustandStore';
import Sidebar from '../Sidebar/Sidebar';
import FormattingOptions from '../FormattingOptions/FormattingOptions';
import './Editor.css';

function Editor() {
  const { personalInfo, workExperience, education, skills } = useStore();
  const [resumeData, setResumeData] = useState({
    personalInfo,
    workExperience,
    education,
    skills,
  });
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="editor-container">
        <Sidebar />
        <div className="editor">
          <FormattingOptions onFormatChange={handleFormatChange} />
          <div className="resume-preview" style={{ fontFamily: formattingOptions.font, color: formattingOptions.color }}>
            <h1>{resumeData.personalInfo.name}</h1>
            <h2>{resumeData.personalInfo.email}</h2>
            <h2>{resumeData.personalInfo.phone}</h2>
            <h2>{resumeData.personalInfo.address}</h2>
            
            <h3>Work Experience</h3>
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="resume-section">
                <h4>{exp.company}</h4>
                <p>{exp.role}</p>
                <p>{exp.startDate} - {exp.endDate}</p>
                <p>{exp.description}</p>
              </div>
            ))}

            <h3>Education</h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="resume-section">
                <h4>{edu.institution}</h4>
                <p>{edu.degree}</p>
                <p>{edu.startDate} - {edu.endDate}</p>
                <p>{edu.description}</p>
              </div>
            ))}

            <h3>Skills</h3>
            <ul>
              {resumeData.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => handleDownload('PDF')}>Download as PDF</button>
          <button onClick={() => handleDownload('DOCX')}>Download as DOCX</button>
        </div>
      </div>
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

  // Add work experience
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

  // Add education
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

  // Add skills
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
