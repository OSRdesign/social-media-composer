import React, { useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useStore } from '../store';
import type { CanvasElement } from '../types';

export const Canvas: React.FC = () => {
  const { currentTemplate, slides, currentSlideIndex, updateElement, selectedElementId, setSelectedElement } = useStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const currentSlide = slides[currentSlideIndex];
  const dragRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});

  // Initialize refs for each element
  useEffect(() => {
    if (currentSlide?.elements) {
      currentSlide.elements.forEach(element => {
        if (!dragRefs.current[element.id]) {
          dragRefs.current[element.id] = React.createRef();
        }
      });
    }
  }, [currentSlide?.elements]);

  // Calculate centered positions for elements
  useEffect(() => {
    if (!currentTemplate || !currentSlide) return;

    currentSlide.elements.forEach(element => {
      if (element.centerHorizontally || element.centerVertically) {
        const newPosition = { ...element.position };
        const elementWidth = element.width || 0;
        const elementHeight = element.height || 0;
        
        if (element.centerHorizontally) {
          newPosition.x = (currentTemplate.width - elementWidth) / 2;
        }
        
        if (element.centerVertically) {
          newPosition.y = (currentTemplate.height - elementHeight) / 2;
        }

        if (newPosition.x !== element.position.x || newPosition.y !== element.position.y) {
          updateElement(element.id, { position: newPosition });
        }
      }
    });
  }, [currentTemplate, currentSlide, updateElement]);

  if (!currentTemplate) return null;

  const handleDoubleClick = (elementId: string) => {
    setSelectedElement(elementId);
  };

  return (
    <div
      ref={canvasRef}
      id="canvas-content"
      className="relative bg-white shadow-lg mx-auto overflow-hidden"
      style={{
        width: currentTemplate.width,
        height: currentTemplate.height,
      }}
    >
      {/* Background Image */}
      {currentSlide?.background && (
        <div className="absolute inset-0">
          <img
            src={currentSlide.background.content}
            alt=""
            className="object-cover w-full h-full"
            style={{
              transform: currentSlide.background.crop 
                ? `translate(${-currentSlide.background.crop.x}px, ${-currentSlide.background.crop.y}px)`
                : undefined,
              width: currentSlide.background.crop?.width || '100%',
              height: currentSlide.background.crop?.height || '100%',
            }}
          />
        </div>
      )}

      {/* Layer Elements */}
      {currentSlide?.elements
        .filter(element => element.visible !== false)
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
        .map((element) => {
          // Ensure ref exists for this element
          if (!dragRefs.current[element.id]) {
            dragRefs.current[element.id] = React.createRef();
          }

          return (
            <Draggable
              key={element.id}
              nodeRef={dragRefs.current[element.id]}
              position={element.position}
              onStop={(_, data) => {
                updateElement(element.id, {
                  position: { x: data.x, y: data.y },
                });
              }}
              disabled={element.centerHorizontally || element.centerVertically}
            >
              <div 
                ref={dragRefs.current[element.id]}
                className={`absolute cursor-move ${
                  selectedElementId === element.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ zIndex: element.zIndex }}
                onDoubleClick={() => handleDoubleClick(element.id)}
              >
                {element.type === 'image' ? (
                  <div className="relative group">
                    <img
                      src={element.content}
                      alt=""
                      style={{
                        width: element.width,
                        height: element.height,
                      }}
                      className="rounded-lg"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: element.width,
                      height: element.height,
                      fontSize: element.fontSize,
                      color: element.color,
                      fontFamily: element.fontFamily,
                      fontWeight: element.fontWeight,
                      textDecoration: element.textDecoration,
                      fontStyle: element.fontStyle,
                      textAlign: element.textAlign as any,
                      display: 'flex',
                      alignItems: element.verticalAlign === 'middle' ? 'center' : 
                                element.verticalAlign === 'bottom' ? 'flex-end' : 'flex-start',
                    }}
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: element.content.replace(/[®™]/g, match => 
                        `<sup style="font-size: 0.6em">${match}</sup>`
                      )
                    }}
                  />
                )}
              </div>
            </Draggable>
          );
        })}
    </div>
  );
};