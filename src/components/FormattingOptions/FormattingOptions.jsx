import React from 'react';
import './FormattingOptions.css';

function FormattingOptions({ onFormatChange }) {
  const handleFontChange = (event) => {
    onFormatChange({ type: 'font', value: event.target.value });
  };

  const handleColorChange = (event) => {
    onFormatChange({ type: 'color', value: event.target.value });
  };

  const handleLayoutChange = (event) => {
    onFormatChange({ type: 'layout', value: event.target.value });
  };

  return (
    <div className="formatting-options">
      <h3>Formatting Options</h3>

      <div className='formatting-options-items'>
      <div>
        <label htmlFor="font-select">Font:</label>
        <select id="font-select" onChange={handleFontChange}>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>
      <div>
        <label htmlFor="color-select">Color:</label>
        <input type="color" id="color-select" onChange={handleColorChange} />
      </div>
      <div>
        <label htmlFor="layout-select">Layout:</label>
        <select id="layout-select" onChange={handleLayoutChange}>
          <option value="single-column">Single Column</option>
          <option value="two-column">Two Column</option>
        </select>
      </div>
      </div>
    </div>
  );
}

export default FormattingOptions;
