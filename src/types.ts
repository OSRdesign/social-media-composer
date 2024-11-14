import React from 'react';

export interface CanvasElement {
  id: string;
  type: 'background' | 'image' | 'text';
  content: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
  zIndex?: number;
  visible?: boolean;
  fontFamily?: string;
  fontWeight?: string;
  textDecoration?: string;
  fontStyle?: string;
  textAlign?: string;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  centerHorizontally?: boolean;
  centerVertically?: boolean;
  aspectRatio?: number;
  naturalWidth?: number;
  naturalHeight?: number;
}