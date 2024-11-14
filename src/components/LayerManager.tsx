import React, { useState } from 'react';
import { useStore } from '../store';
import { ArrowUp, ArrowDown, Trash2, Eye, EyeOff, Image as ImageIcon, Type } from 'lucide-react';

export const LayerManager: React.FC = () => {
  const { 
    slides, 
    currentSlideIndex, 
    moveElement, 
    removeElement, 
    toggleElementVisibility,
    setBackground,
    addElement,
    updateElement,
    setSelectedElement,
    selectedElementId
  } = useStore();
  
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [elementImageUrl, setElementImageUrl] = useState('');
  
  const currentSlide = slides[currentSlideIndex];

  const sortedElements = [...(currentSlide?.elements || [])].sort(
    (a, b) => (b.zIndex || 0) - (a.zIndex || 0)
  );

  const handleImageUrl = async (url: string, isBackground: boolean) => {
    try {
      // Load image to get dimensions
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });

      const element = {
        id: crypto.randomUUID().substring(0, 8),
        type: 'image' as const,
        content: url,
        position: { x: 50, y: 50 },
        width: Math.min(img.width, 300),
        height: Math.min(img.height, 300),
        visible: true,
        naturalWidth: img.width,
        naturalHeight: img.height,
        aspectRatio: img.width / img.height,
        centerHorizontally: false,
        centerVertically: false
      };

      if (isBackground) {
        setBackground(element);
        setBackgroundImageUrl('');
      } else {
        addElement(element);
        setElementImageUrl('');
      }
    } catch (error) {
      alert('Invalid image URL. Please provide a valid direct image URL.');
    }
  };

  const handleImageSize = (elementId: string, height: number) => {
    const element = currentSlide.elements.find(el => el.id === elementId);
    if (!element || element.type !== 'image') return;

    const aspectRatio = element.aspectRatio || element.naturalWidth / element.naturalHeight || 1;
    const newWidth = height * aspectRatio;

    updateElement(elementId, {
      height,
      width: newWidth
    });
  };

  const handlePositionChange = (elementId: string, axis: 'x' | 'y', value: number) => {
    const element = currentSlide.elements.find(el => el.id === elementId);
    if (!element) return;

    updateElement(elementId, {
      position: {
        ...element.position,
        [axis]: value
      }
    });
  };

  const handleCenterToggle = (elementId: string, type: 'horizontal' | 'vertical') => {
    const element = currentSlide.elements.find(el => el.id === elementId);
    if (!element) return;

    updateElement(elementId, {
      centerHorizontally: type === 'horizontal' ? !element.centerHorizontally : element.centerHorizontally,
      centerVertically: type === 'vertical' ? !element.centerVertically : element.centerVertically
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Layers</h3>
      
      {/* Background Layer */}
      <div className="mb-4 p-3 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon size={16} />
          <span className="font-medium">Background</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter image URL"
            className="flex-1 p-2 text-sm border rounded"
            value={backgroundImageUrl}
            onChange={(e) => setBackgroundImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && backgroundImageUrl.trim()) {
                handleImageUrl(backgroundImageUrl.trim(), true);
              }
            }}
          />
        </div>
        {currentSlide?.background && (
          <div className="mt-2 flex items-center gap-2">
            <img 
              src={currentSlide.background.content} 
              alt="Background"
              className="w-12 h-12 object-cover rounded"
            />
            <span className="text-sm text-gray-600">Current Background</span>
          </div>
        )}
      </div>

      {/* Add Elements */}
      <div className="mb-4 p-3 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <Type size={16} />
          <span className="font-medium">Add Elements</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter image URL"
            className="flex-1 p-2 text-sm border rounded"
            value={elementImageUrl}
            onChange={(e) => setElementImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && elementImageUrl.trim()) {
                handleImageUrl(elementImageUrl.trim(), false);
              }
            }}
          />
        </div>
      </div>

      {/* Layer List */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-600 mb-2">Elements</h4>
        {sortedElements.map((element) => (
          <div
            key={element.id}
            className={`p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer ${
              selectedElementId === element.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedElement(element.id)}
          >
            {/* Element Header */}
            <div className="flex items-center gap-2">
              {element.type === 'image' ? (
                <img 
                  src={element.content} 
                  alt=""
                  className="w-8 h-8 object-cover rounded"
                />
              ) : (
                <Type size={16} />
              )}
              <span className="flex-1 truncate text-sm">
                {element.type === 'text' ? element.content : 'Image'}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleElementVisibility(element.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {element.visible === false ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveElement(element.id, (element.zIndex || 0) + 1);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveElement(element.id, (element.zIndex || 0) - 1);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-1 hover:bg-red-100 text-red-600 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Element Controls */}
            {selectedElementId === element.id && (
              <div className="mt-2 space-y-2 border-t pt-2">
                {/* Position Controls */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500">X Position</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={element.centerHorizontally ? '' : Math.round(element.position.x)}
                        onChange={(e) => handlePositionChange(element.id, 'x', Number(e.target.value))}
                        className="w-full p-1 text-sm border rounded"
                        disabled={element.centerHorizontally}
                        placeholder={element.centerHorizontally ? 'Auto' : ''}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Y Position</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={element.centerVertically ? '' : Math.round(element.position.y)}
                        onChange={(e) => handlePositionChange(element.id, 'y', Number(e.target.value))}
                        className="w-full p-1 text-sm border rounded"
                        disabled={element.centerVertically}
                        placeholder={element.centerVertically ? 'Auto' : ''}
                      />
                    </div>
                  </div>
                </div>

                {/* Center Controls */}
                <div className="flex gap-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={element.centerHorizontally}
                      onChange={() => handleCenterToggle(element.id, 'horizontal')}
                      className="rounded"
                    />
                    <span className="text-xs">Center H</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={element.centerVertically}
                      onChange={() => handleCenterToggle(element.id, 'vertical')}
                      className="rounded"
                    />
                    <span className="text-xs">Center V</span>
                  </label>
                </div>

                {/* Image Size Control */}
                {element.type === 'image' && (
                  <div>
                    <label className="block text-xs text-gray-500">Height (px)</label>
                    <input
                      type="number"
                      value={Math.round(element.height || 0)}
                      onChange={(e) => handleImageSize(element.id, Number(e.target.value))}
                      className="w-full p-1 text-sm border rounded"
                      min="20"
                    />
                    <p className="text-xs text-gray-400 mt-1">Width adjusts automatically to maintain aspect ratio</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {sortedElements.length === 0 && (
          <p className="text-sm text-gray-500 text-center p-4">
            No elements added yet
          </p>
        )}
      </div>
    </div>
  );
};