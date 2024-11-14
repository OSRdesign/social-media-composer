import { create } from 'zustand';
import { ComposerStore, CarouselSlide } from './types';

export const useStore = create<ComposerStore>((set) => ({
  templates: [],
  currentTemplate: null,
  savedTemplates: [],
  currentSlideIndex: 0,
  slides: [],
  selectedElementId: null,
  
  setSelectedElement: (elementId) => 
    set({ selectedElementId: elementId }),
  
  addTemplate: (template) =>
    set((state) => ({ templates: [...state.templates, template] })),
  
  saveTemplate: (template) =>
    set((state) => ({ savedTemplates: [...state.savedTemplates, template] })),
  
  setCurrentTemplate: (template) => 
    set((state) => ({
      currentTemplate: template,
      slides: [{ id: crypto.randomUUID(), elements: [] }],
      currentSlideIndex: 0,
      selectedElementId: null,
    })),
  
  updateElement: (elementId, updates) =>
    set((state) => ({
      slides: state.slides.map((slide, index) =>
        index === state.currentSlideIndex
          ? {
              ...slide,
              elements: slide.elements.map((el) =>
                el.id === elementId ? { ...el, ...updates } : el
              ),
            }
          : slide
      ),
    })),
  
  addElement: (element) =>
    set((state) => ({
      slides: state.slides.map((slide, index) =>
        index === state.currentSlideIndex
          ? {
              ...slide,
              elements: [...slide.elements, { ...element, zIndex: slide.elements.length, visible: true }],
            }
          : slide
      ),
      selectedElementId: element.id,
    })),
  
  removeElement: (elementId) =>
    set((state) => ({
      slides: state.slides.map((slide, index) =>
        index === state.currentSlideIndex
          ? {
              ...slide,
              elements: slide.elements.filter((el) => el.id !== elementId),
            }
          : slide
      ),
      selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
    })),
  
  addSlide: () =>
    set((state) => ({
      slides: [
        ...state.slides,
        { id: crypto.randomUUID(), elements: [] },
      ],
    })),
  
  removeSlide: (index) =>
    set((state) => ({
      slides: state.slides.filter((_, i) => i !== index),
      currentSlideIndex: state.currentSlideIndex > index 
        ? state.currentSlideIndex - 1 
        : state.currentSlideIndex,
    })),
  
  setCurrentSlide: (index) =>
    set({ currentSlideIndex: index, selectedElementId: null }),
  
  duplicateSlide: (index) =>
    set((state) => ({
      slides: [
        ...state.slides.slice(0, index + 1),
        {
          id: crypto.randomUUID(),
          elements: JSON.parse(JSON.stringify(state.slides[index].elements)),
          background: state.slides[index].background 
            ? JSON.parse(JSON.stringify(state.slides[index].background))
            : undefined,
        },
        ...state.slides.slice(index + 1),
      ],
    })),
  
  moveElement: (elementId, zIndex) =>
    set((state) => ({
      slides: state.slides.map((slide, index) =>
        index === state.currentSlideIndex
          ? {
              ...slide,
              elements: slide.elements.map((el) =>
                el.id === elementId ? { ...el, zIndex } : el
              ),
            }
          : slide
      ),
    })),

  toggleElementVisibility: (elementId) =>
    set((state) => ({
      slides: state.slides.map((slide, index) =>
        index === state.currentSlideIndex
          ? {
              ...slide,
              elements: slide.elements.map((el) =>
                el.id === elementId ? { ...el, visible: !el.visible } : el
              ),
            }
          : slide
      ),
    })),

  setBackground: (element) =>
    set((state) => ({
      slides: state.slides.map((slide, index) =>
        index === state.currentSlideIndex
          ? {
              ...slide,
              background: { ...element, type: 'background' },
            }
          : slide
      ),
    })),

  updateBackground: (updates) =>
    set((state) => ({
      slides: state.slides.map((slide, index) =>
        index === state.currentSlideIndex && slide.background
          ? {
              ...slide,
              background: { ...slide.background, ...updates },
            }
          : slide
      ),
    })),
}));