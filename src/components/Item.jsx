import clsx from 'clsx';
import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { X } from '../icons';
import { handleBlurOnEscape } from '../utils/input';

export function Item({ id, label, status, index, action, className }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmitUpdate = event => {
    event.preventDefault();
    const { value: label } = event.target.label;
    action.update({ id, label, status });
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={`${id}`} index={index}>
      {(provided, snapshot) => (
        <div
          className={clsx(
            'flex justify-between p-3 bg-white border-4 border-transparent rounded-lg shadow ring-blue-500 focus:outline-none focus:ring-2',
            {
              'ring-2': snapshot.isDragging || isEditing,
            },
            className
          )}
          onDoubleClick={() => setIsEditing(true)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {isEditing ? (
            <form onSubmit={handleSubmitUpdate}>
              <input
                type="text"
                name="label"
                className="focus:outline-none"
                defaultValue={label}
                onBlur={() => setIsEditing(false)}
                onKeyDown={handleBlurOnEscape}
                autoFocus
                required
              />
            </form>
          ) : (
            label
          )}
          <button
            onClick={() => action.remove(id)}
            className="flex items-center justify-center w-6 h-6 rounded-lg focus:ring-2 focus:outline-none ring-blue-500"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}
    </Draggable>
  );
}
