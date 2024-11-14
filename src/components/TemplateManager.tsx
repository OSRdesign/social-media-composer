import React from 'react';
import { useStore } from '../store';
import { Save, FolderOpen, Download, Upload } from 'lucide-react';

export const TemplateManager: React.FC = () => {
  const { currentTemplate, slides, saveTemplate, setCurrentTemplate } = useStore();

  const handleSaveTemplate = () => {
    if (!currentTemplate) return;
    
    const name = window.prompt('Enter template name:', currentTemplate.name);
    if (!name) return;

    const templateData = {
      ...currentTemplate,
      id: crypto.randomUUID().substring(0, 8),
      name,
      slides: slides.map(slide => ({
        ...slide,
        elements: slide.elements.map(el => ({
          ...el,
          id: el.id.substring(0, 8)
        }))
      }))
    };

    // Save as JSON file
    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    saveTemplate(templateData);
  };

  const handleLoadTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const template = JSON.parse(e.target?.result as string);
        setCurrentTemplate(template);
      } catch (error) {
        alert('Invalid template file');
      }
    };
    reader.readAsText(file);
  };

  const handleExportExcel = () => {
    if (!currentTemplate) return;

    // Create CSV data
    const headers = ['ID', 'Type', 'Content', 'X', 'Y', 'Properties'];
    const rows = slides.flatMap((slide, slideIndex) =>
      slide.elements.map(el => [
        el.id.substring(0, 8),
        el.type,
        el.content,
        el.position.x,
        el.position.y,
        JSON.stringify({
          fontSize: el.fontSize,
          color: el.color,
          fontFamily: el.fontFamily,
          fontWeight: el.fontWeight,
          textDecoration: el.textDecoration,
          fontStyle: el.fontStyle,
          textAlign: el.textAlign,
          width: el.width,
          height: el.height,
          slideIndex
        })
      ])
    );

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSaveTemplate}
        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        <Save size={16} />
        <span className="text-sm">Save</span>
      </button>

      <label className="cursor-pointer">
        <input
          type="file"
          accept=".json"
          onChange={handleLoadTemplate}
          className="hidden"
        />
        <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          <FolderOpen size={16} />
          <span className="text-sm">Load</span>
        </div>
      </label>

      <button
        onClick={handleExportExcel}
        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        <Download size={16} />
        <span className="text-sm">Export CSV</span>
      </button>
    </div>
  );
};