import React, { useRef } from 'react';
import { parse, unparse } from 'papaparse';
import { useStore } from '../store';
import { FileSpreadsheet, Download, Upload } from 'lucide-react';

export const CSVImporter: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { slides, currentSlideIndex, addSlide, addElement, currentTemplate } = useStore();

  const handleExportCSV = () => {
    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return;

    // Create headers from element IDs
    const elements = currentSlide.elements.map(el => ({
      id: el.id,
      type: el.type,
      content: el.content,
    }));

    const headers = elements.map(el => `${el.id}:${el.type}`);
    const data = [elements.map(el => el.content)];

    const csv = unparse({
      fields: headers,
      data,
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    parse(file, {
      complete: (results) => {
        const headers = results.data[0] as string[];
        const data = results.data.slice(1) as string[][];
        
        // Process each row of data
        data.forEach((row, rowIndex) => {
          if (rowIndex > 0) addSlide();
          
          headers.forEach((header, colIndex) => {
            const [id, type] = header.split(':');
            const content = row[colIndex];
            
            if (content) {
              addElement({
                id,
                type: type as 'text' | 'image',
                content,
                position: { x: 50, y: 50 },
                fontSize: type === 'text' ? 16 : undefined,
                color: type === 'text' ? '#000000' : undefined,
                visible: true,
              });
            }
          });
        });
      },
      header: true,
    });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportCSV}
        className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        <Download size={18} />
        <span className="text-sm">Export CSV</span>
      </button>

      <label className="cursor-pointer">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleImportCSV}
          className="hidden"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600">
          <Upload size={18} />
          <span className="text-sm">Import CSV</span>
        </div>
      </label>
    </div>
  );
};