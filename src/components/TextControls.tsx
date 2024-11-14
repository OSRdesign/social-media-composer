import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter } from 'lucide-react';

export const TextControls: React.FC = () => {
  const { slides, currentSlideIndex, selectedElementId, updateElement } = useStore();
  const [availableFonts, setAvailableFonts] = useState<string[]>([]);
  const [isLoadingFonts, setIsLoadingFonts] = useState(true);
  const [textContent, setTextContent] = useState('');

  const currentSlide = slides[currentSlideIndex];
  const selectedElement = currentSlide?.elements.find(el => el.id === selectedElementId);

  // Update local text content when selected element changes
  useEffect(() => {
    if (selectedElement?.type === 'text') {
      setTextContent(selectedElement.content);
    }
  }, [selectedElement]);

  useEffect(() => {
    const loadFonts = async () => {
      setIsLoadingFonts(true);
      try {
        // Try to load system fonts first
        if ('queryLocalFonts' in window) {
          const fonts = await (window as any).queryLocalFonts();
          const systemFonts = [...new Set(fonts.map((font: any) => font.family))];
          setAvailableFonts(systemFonts);
        } else {
          // Fallback to basic fonts plus Google Fonts
          setAvailableFonts([
            'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
            'Courier New', 'Verdana', 'Tahoma', 'Impact',
            'Oswald', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
            'Source Sans Pro', 'Playfair Display', 'Merriweather'
          ]);
        }
      } catch (error) {
        console.warn('Could not load fonts:', error);
        setAvailableFonts([
          'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
          'Courier New', 'Verdana', 'Tahoma', 'Impact',
          'Oswald', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
          'Source Sans Pro', 'Playfair Display', 'Merriweather'
        ]);
      }
      setIsLoadingFonts(false);
    };

    loadFonts();
  }, []);

  if (!selectedElement || selectedElement.type !== 'text') return null;

  const handleFontSizeChange = (value: number) => {
    if (selectedElement.width && selectedElement.height) {
      // If box dimensions are set, adjust font size to fit
      const tempDiv = document.createElement('div');
      tempDiv.style.width = `${selectedElement.width}px`;
      tempDiv.style.height = `${selectedElement.height}px`;
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.whiteSpace = 'pre-wrap';
      tempDiv.textContent = selectedElement.content;
      document.body.appendChild(tempDiv);

      let fontSize = value;
      tempDiv.style.fontSize = `${fontSize}px`;

      while (
        (tempDiv.scrollHeight > selectedElement.height || 
         tempDiv.scrollWidth > selectedElement.width) && 
        fontSize > 1
      ) {
        fontSize--;
        tempDiv.style.fontSize = `${fontSize}px`;
      }

      document.body.removeChild(tempDiv);
      updateElement(selectedElement.id, { fontSize });
    } else {
      // If no box dimensions, use specified font size
      updateElement(selectedElement.id, { fontSize: value });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTextContent(newText);
    updateElement(selectedElement.id, { content: newText });
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-medium text-gray-900">Text Controls</h3>

      <div className="space-y-3">
        {/* Text Content */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Text Content</label>
          <textarea
            value={textContent}
            onChange={handleTextChange}
            className="w-full p-2 border rounded text-sm min-h-[100px]"
            placeholder="Enter your text here..."
          />
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Font</label>
          {isLoadingFonts ? (
            <div className="w-full p-2 border rounded text-sm bg-gray-50">Loading fonts...</div>
          ) : (
            <select
              value={selectedElement.fontFamily || 'Arial'}
              onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
              className="w-full p-2 border rounded text-sm"
            >
              {availableFonts.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Size (px)</label>
          <input
            type="number"
            value={selectedElement.fontSize || 16}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="w-full p-2 border rounded text-sm"
            min="1"
          />
        </div>

        {/* Text Box Dimensions */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Width (px)</label>
            <input
              type="number"
              value={selectedElement.width || ''}
              onChange={(e) => updateElement(selectedElement.id, { 
                width: Number(e.target.value) || undefined 
              })}
              className="w-full p-2 border rounded text-sm"
              min="0"
              placeholder="Auto"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Height (px)</label>
            <input
              type="number"
              value={selectedElement.height || ''}
              onChange={(e) => updateElement(selectedElement.id, { 
                height: Number(e.target.value) || undefined 
              })}
              className="w-full p-2 border rounded text-sm"
              min="0"
              placeholder="Auto"
            />
          </div>
        </div>

        {/* Horizontal Alignment */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Horizontal Alignment</label>
          <div className="flex gap-1">
            <button
              onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })}
              className={`p-2 rounded flex-1 ${
                selectedElement.textAlign === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <AlignLeft size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })}
              className={`p-2 rounded flex-1 ${
                selectedElement.textAlign === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <AlignCenter size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })}
              className={`p-2 rounded flex-1 ${
                selectedElement.textAlign === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <AlignRight size={16} className="mx-auto" />
            </button>
          </div>
        </div>

        {/* Vertical Alignment */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Vertical Alignment</label>
          <div className="flex gap-1">
            <button
              onClick={() => updateElement(selectedElement.id, { verticalAlign: 'top' })}
              className={`p-2 rounded flex-1 ${
                selectedElement.verticalAlign === 'top' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              Top
            </button>
            <button
              onClick={() => updateElement(selectedElement.id, { verticalAlign: 'middle' })}
              className={`p-2 rounded flex-1 ${
                selectedElement.verticalAlign === 'middle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <AlignVerticalJustifyCenter size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => updateElement(selectedElement.id, { verticalAlign: 'bottom' })}
              className={`p-2 rounded flex-1 ${
                selectedElement.verticalAlign === 'bottom' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              Bottom
            </button>
          </div>
        </div>

        {/* Text Style */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Style</label>
          <div className="flex gap-1">
            <button
              onClick={() => updateElement(selectedElement.id, { 
                fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' 
              })}
              className={`p-2 rounded flex-1 ${
                selectedElement.fontWeight === 'bold' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <Bold size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => updateElement(selectedElement.id, { 
                fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' 
              })}
              className={`p-2 rounded flex-1 ${
                selectedElement.fontStyle === 'italic' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <Italic size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => updateElement(selectedElement.id, { 
                textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' 
              })}
              className={`p-2 rounded flex-1 ${
                selectedElement.textDecoration === 'underline' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <Underline size={16} className="mx-auto" />
            </button>
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Color</label>
          <input
            type="color"
            value={selectedElement.color || '#000000'}
            onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
            className="w-full h-8 p-0 border rounded"
          />
        </div>
      </div>
    </div>
  );
};