import React from 'react';
import { Type, Download, Upload, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useStore } from '../store';
import { toPng } from 'html-to-image';
import { TemplateManager } from './TemplateManager';

export const Toolbar: React.FC = () => {
  const { addElement, slides, currentSlideIndex, currentTemplate } = useStore();
  const [scale, setScale] = React.useState(1);

  const handleZoom = (action: 'in' | 'out' | 'reset') => {
    const maxScale = 2;
    const minScale = 0.1;
    const step = 0.1;

    let newScale = scale;
    switch (action) {
      case 'in':
        newScale = Math.min(scale + step, maxScale);
        break;
      case 'out':
        newScale = Math.max(scale - step, minScale);
        break;
      case 'reset':
        newScale = 1;
        break;
    }
    
    setScale(newScale);
    document.documentElement.style.setProperty('--canvas-scale', newScale.toString());
  };

  const handleAddText = () => {
    addElement({
      id: crypto.randomUUID().substring(0, 8),
      type: 'text',
      content: 'Double click to edit',
      position: { x: 50, y: 50 },
      fontSize: 24,
      color: '#000000',
      visible: true,
    });
  };

  const handleExport = async () => {
    if (!currentTemplate) return;

    const canvas = document.querySelector('#canvas-content');
    if (canvas) {
      // Reset scale to 1 temporarily for export
      const currentScale = scale;
      document.documentElement.style.setProperty('--canvas-scale', '1');
      
      try {
        const dataUrl = await toPng(canvas, {
          width: currentTemplate.width,
          height: currentTemplate.height,
          pixelRatio: 1
        });
        
        const link = document.createElement('a');
        link.download = 'social-post.png';
        link.href = dataUrl;
        link.click();
      } finally {
        // Restore original scale
        document.documentElement.style.setProperty('--canvas-scale', currentScale.toString());
      }
    }
  };

  return (
    <div className="py-2 flex items-center gap-3">
      <div className="flex items-center gap-2 border-r pr-3">
        <button
          onClick={() => handleZoom('out')}
          className="p-1.5 hover:bg-gray-100 rounded"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-sm min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => handleZoom('in')}
          className="p-1.5 hover:bg-gray-100 rounded"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => handleZoom('reset')}
          className="p-1.5 hover:bg-gray-100 rounded"
          title="Reset Zoom"
        >
          <Maximize size={18} />
        </button>
      </div>

      <button
        onClick={handleAddText}
        className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        <Type size={18} />
        <span className="text-sm">Add Text</span>
      </button>

      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
      >
        <Download size={18} />
        <span className="text-sm">Export Image</span>
      </button>

      <div className="ml-auto">
        <TemplateManager />
      </div>
    </div>
  );
};