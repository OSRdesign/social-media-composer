import React from 'react';
import { useStore } from '../store';
import { Square, RectangleHorizontal, Smartphone } from 'lucide-react';

const TEMPLATE_PRESETS = [
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    description: 'Square format (1080×1080px)',
    format: 'post',
    width: 1080,
    height: 1080,
    icon: Square,
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    description: 'Vertical format (1080×1920px)',
    format: 'story',
    width: 1080,
    height: 1920,
    icon: Smartphone,
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    description: 'Landscape format (1200×630px)',
    format: 'post',
    width: 1200,
    height: 630,
    icon: RectangleHorizontal,
  },
];

export const TemplateSelector: React.FC = () => {
  const { setCurrentTemplate } = useStore();

  return (
    <div className="grid grid-cols-3 gap-4">
      {TEMPLATE_PRESETS.map((template) => {
        const Icon = template.icon;
        return (
          <button
            key={template.id}
            onClick={() => setCurrentTemplate({
              ...template,
              elements: [],
            })}
            className="flex flex-col items-center p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Icon className="w-8 h-8 mb-2 text-blue-500" />
            <h3 className="font-medium text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-500">{template.description}</p>
          </button>
        );
      })}
    </div>
  );
};