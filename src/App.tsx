import React from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { TemplateSelector } from './components/TemplateSelector';
import { CarouselManager } from './components/CarouselManager';
import { LayerManager } from './components/LayerManager';
import { TextControls } from './components/TextControls';
import { useStore } from './store';
import { Layout, Menu, X } from 'lucide-react';

function App() {
  const { currentTemplate, selectedElementId } = useStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b h-14 fixed top-0 left-0 right-0 z-40">
        <div className="h-full px-4 flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Layout className="text-blue-500 hidden sm:block" size={24} />
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            Social Media Composer
          </h1>
        </div>
      </header>

      <main className="pt-14 h-screen">
        {!currentTemplate ? (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">
                Choose a Template Format
              </h2>
              <TemplateSelector />
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white border-b shadow-sm">
              <div className="max-w-screen-2xl mx-auto px-4">
                <Toolbar />
              </div>
            </div>
            
            <div className="flex h-[calc(100vh-8.5rem)]">
              {/* Left Sidebar */}
              <div className={`
                fixed inset-y-[7.5rem] left-0 z-30 w-72 bg-white border-r transform transition-transform duration-200 ease-in-out
                lg:relative lg:inset-auto lg:transform-none
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}>
                <div className="h-full overflow-y-auto">
                  <div className="p-3 space-y-4">
                    <LayerManager />
                    {selectedElementId && <TextControls />}
                  </div>
                </div>
              </div>

              {/* Overlay */}
              {sidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
              )}

              {/* Main Canvas Area */}
              <div className="flex-1 overflow-y-auto bg-gray-100">
                <div className="p-3 space-y-4">
                  <CarouselManager />
                  <div className="canvas-container flex justify-center items-start">
                    <div className="relative w-full">
                      <div className="overflow-auto">
                        <div className="max-w-full mx-auto" style={{
                          width: 'min(100%, 800px)',
                          transform: 'scale(var(--canvas-scale, 1))',
                          transformOrigin: 'top center',
                        }}>
                          <Canvas />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;