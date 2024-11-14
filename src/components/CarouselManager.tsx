import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Copy, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const CarouselManager: React.FC = () => {
  const { slides, currentSlideIndex, addSlide, removeSlide, setCurrentSlide, duplicateSlide } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Carousel</h3>
          <span className="text-xs text-gray-500">({slides.length} slides)</span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isExpanded && (
        <div className="p-2 border-t">
          <div className="flex justify-end mb-2">
            <button
              onClick={addSlide}
              className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`relative group flex-shrink-0 ${
                  index === currentSlideIndex ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div
                  onClick={() => setCurrentSlide(index)}
                  className="w-16 h-16 bg-gray-50 border rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500">{index + 1}</span>
                  </div>
                </div>
                <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                  <button
                    onClick={() => duplicateSlide(index)}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100"
                  >
                    <Copy size={12} />
                  </button>
                  {slides.length > 1 && (
                    <button
                      onClick={() => removeSlide(index)}
                      className="p-1 bg-white rounded shadow hover:bg-red-100 text-red-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};