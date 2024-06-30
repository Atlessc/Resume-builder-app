import React from 'react';
import { useDrop } from 'react-dnd';
// import './Section.css';

const Section = ({ type, title, entries, onEdit }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [type],
    drop: (item, monitor) => {
      console.log(`Dropped ${item.type} in ${type}`);
      // Handle the drop logic here (e.g., add the entry to this section)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="section" style={{ backgroundColor: isOver ? '#e0e0e0' : 'white' }}>
      <h3>{title}</h3>
      {entries.map((entry, index) => (
        <div key={index} className="resume-entry" onClick={() => onEdit(type, entry, index)}>
          <h4>{entry.company || entry.institution || entry.skill || entry.title}</h4>
          <p>{entry.role || entry.degree || entry.content}</p>
          <p>{entry.startDate} - {entry.endDate}</p>
          <p>{entry.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Section;
