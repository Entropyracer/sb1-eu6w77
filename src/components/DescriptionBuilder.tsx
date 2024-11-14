import React, { useState } from 'react';
import { Wand2, Trash2, Save, Type, Copy } from 'lucide-react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, useSensor, useSensors, MouseSensor } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useDescription } from '../context/DescriptionContext';
import { parseDescription } from '../utils/formatters';
import DraggableElement from './DraggableElement';

const DescriptionBuilder: React.FC = () => {
  const [input, setInput] = useState('');
  const [elements, setElements] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [combinedElement, setCombinedElement] = useState<string | null>(null);
  const [overlappingElements, setOverlappingElements] = useState<{
    active: string | null;
    over: string | null;
  }>({ active: null, over: null });
  const { addToHistory, addToSaved } = useDescription();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const sensors = useSensors(mouseSensor);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const handleGenerate = () => {
    if (!input.trim()) return;
    
    // Add the original input to history
    addToHistory(input);
    
    const { mainNoun, specs, material } = parseDescription(input);
    const formattedElements = [
      mainNoun,
      ...specs,
      material
    ].filter(Boolean).map(el => isUppercase ? el.toUpperCase() : el);
    
    setElements(formattedElements);
    
    // Add the formatted output to history
    addToHistory(formattedElements.join(', '));
  };

  const handleSave = () => {
    if (elements.length > 0) {
      addToSaved(elements.join(', '));
    } else if (input.trim()) {
      addToSaved(input);
    }
  };

  const handleCopy = () => {
    const textToCopy = elements.length > 0 ? elements.join(', ') : input;
    navigator.clipboard.writeText(textToCopy);
  };

  const clearInput = () => {
    setInput('');
    setElements([]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedElement(event.active.id as string);
    setOverlappingElements({ active: null, over: null });
    setCombinedElement(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setOverlappingElements({ active: null, over: null });
      return;
    }

    const activeIndex = elements.findIndex(el => el === active.id);
    const overIndex = elements.findIndex(el => el === over.id);

    // Only show combining effect if elements are adjacent
    if (Math.abs(activeIndex - overIndex) === 1) {
      setOverlappingElements({
        active: active.id as string,
        over: over.id as string,
      });
    } else {
      setOverlappingElements({ active: null, over: null });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setOverlappingElements({ active: null, over: null });
      return;
    }

    const activeIndex = elements.findIndex(el => el === active.id);
    const overIndex = elements.findIndex(el => el === over.id);

    // If elements are adjacent and overlapping significantly, combine them
    if (Math.abs(activeIndex - overIndex) === 1 && overlappingElements.active && overlappingElements.over) {
      const newElements = [...elements];
      const combinedElement = `${elements[Math.min(activeIndex, overIndex)]} ${elements[Math.max(activeIndex, overIndex)]}`;
      newElements.splice(Math.min(activeIndex, overIndex), 2, combinedElement);
      setElements(newElements);
      setCombinedElement(combinedElement);
      setTimeout(() => setCombinedElement(null), 1000); // Clear the combined state after animation
    } else {
      // Otherwise just reorder
      const newElements = [...elements];
      newElements.splice(activeIndex, 1);
      newElements.splice(overIndex, 0, active.id as string);
      setElements(newElements);
    }

    setOverlappingElements({ active: null, over: null });
    setDraggedElement(null);
  };

  const handleEdit = (index: number) => {
    const newValue = prompt('Edit element:', elements[index]);
    if (newValue !== null) {
      setElements(prev => {
        const newElements = [...prev];
        newElements[index] = isUppercase ? newValue.toUpperCase() : newValue;
        return newElements;
      });
    }
  };

  const handleDelete = (index: number) => {
    setElements(prev => prev.filter((_, i) => i !== index));
  };

  const handleCombineWithNext = (index: number) => {
    if (index >= elements.length - 1) return;
    
    const combinedValue = `${elements[index]} ${elements[index + 1]}`;
    setElements(prev => {
      const newElements = [...prev];
      newElements[index] = combinedValue;
      newElements.splice(index + 1, 1);
      return newElements;
    });
    setCombinedElement(combinedValue);
    setTimeout(() => setCombinedElement(null), 1000); // Clear the combined state after animation
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setIsUppercase(!isUppercase)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
                isUppercase 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>UPPERCASE</span>
            </button>
          </div>
          <div className="relative mb-4">
            {!elements.length ? (
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-lg transition-all ${
                  isFocused ? 'ring-2 ring-indigo-500' : 'border border-gray-300'
                }`}
                placeholder="Enter description"
              />
            ) : (
              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={elements} strategy={horizontalListSortingStrategy}>
                  <div className="min-h-[42px] p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {elements.map((element, index) => (
                      <DraggableElement
                        key={`${element}-${index}`}
                        id={element}
                        element={element}
                        index={index}
                        isLast={index === elements.length - 1}
                        isDragging={draggedElement === element}
                        isOverlapping={
                          overlappingElements.active === element ||
                          overlappingElements.over === element
                        }
                        isCombined={element === combinedElement}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCombineWithNext={() => handleCombineWithNext(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
            {(input || elements.length > 0) && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={clearInput}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Clear"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              Generate
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionBuilder;