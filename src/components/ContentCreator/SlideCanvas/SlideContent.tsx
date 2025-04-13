
import React from 'react';

export const SlideContent: React.FC = () => {
  return (
    <div className="w-[960px] h-[540px] bg-white dark:bg-gray-800 shadow-md rounded-sm overflow-hidden relative">
      <div className="absolute inset-0 p-8 flex flex-col">
        <h1 contentEditable className="text-4xl font-bold mb-4 outline-none border-transparent focus:border-primary border-2 rounded px-1">
          Build Awesome Presentations
        </h1>
        <p contentEditable className="text-xl mb-8 outline-none border-transparent focus:border-primary border-2 rounded px-1">
          A modern alternative to PowerPoint for 2025
        </p>
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">1</div>
            <div contentEditable className="outline-none border-transparent focus:border-primary border-2 rounded px-1">
              Drag and Drop Interface
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">2</div>
            <div contentEditable className="outline-none border-transparent focus:border-primary border-2 rounded px-1">
              Beautiful Modern Themes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
