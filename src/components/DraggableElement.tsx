import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, GripVertical, X } from 'lucide-react';

interface DraggableElementProps {
  id: string;
  element: string;
  index: number;
  isLast: boolean;
  isCombined?: boolean;
  isDragging?: boolean;
  isOverlapping?: boolean;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onCombineWithNext?: (index: number) => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  id,
  element,
  index,
  isLast,
  isCombined,
  isDragging,
  isOverlapping,
  onEdit,
  onDelete,
  onCombineWithNext,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-id={id}
      className={`group relative inline-flex items-center ${
        isDragging ? 'opacity-50' : ''
      } ${isCombined ? 'bg-green-100' : ''} ${
        isOverlapping ? 'bg-yellow-100' : ''
      } rounded transition-colors duration-300`}
    >
      <div className="relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-4 hidden group-hover:block">
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white shadow-lg rounded-md p-1 z-20">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:text-indigo-600 p-1"
            >
              <GripVertical className="w-3 h-3" />
            </div>
            <button
              onClick={() => onEdit(index)}
              className="p-1 hover:text-blue-600"
              title="Edit"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete(index)}
              className="p-1 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        <span className="text-sm text-gray-700 py-2 px-1">{element}</span>
      </div>
      {!isLast && (
        <div className="group/comma relative">
          <span className="text-gray-400 mx-1 group-hover/comma:text-red-400">,</span>
          <button
            onClick={() => onCombineWithNext?.()}
            className="absolute -top-3 left-1/2 -translate-x-1/2 hidden group-hover/comma:flex items-center justify-center w-4 h-4 bg-red-100 hover:bg-red-200 rounded-full z-10"
            title="Remove comma and combine elements"
          >
            <X className="w-3 h-3 text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DraggableElement;