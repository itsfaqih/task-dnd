import clsx from 'clsx';
import { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Plus } from '../icons';
import { Item } from './Item';
import { handleBlurOnEscape } from '../utils';

export function List({ title, status, items = [], action, index, className }) {
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmitCreate = event => {
    event.preventDefault();
    const { value: label } = event.target.label;
    action.create({ label, status });
    setIsCreating(false);
  };

  return (
    <Draggable draggableId={status} index={index}>
      {(provided, snapshot) => (
        <div
          className={clsx('rounded-lg p-6', { 'bg-white': snapshot.isDragging }, className)}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-gray-700" {...provided.dragHandleProps}>
              {title}
            </h2>
            <span className="flex items-center justify-center w-6 h-6 ml-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
              {items.length}
            </span>
            <button
              className="p-1 ml-auto transition rounded-lg hover:bg-white hover:shadow focus:outline-none focus:ring-2 ring-blue-500"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <Droppable droppableId={status} type="item">
            {(provided, snapshot) => (
              <div
                className={clsx('mt-6 ring-blue-50 rounded-lg', {
                  'bg-blue-50 ring-[1rem]': snapshot.isDraggingOver,
                })}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {!isCreating && items.length === 0 && (
                  <div className="p-3 text-gray-400 border-4 border-gray-200 border-dashed rounded-lg">
                    This list is empty
                  </div>
                )}
                {isCreating && (
                  <form
                    onSubmit={handleSubmitCreate}
                    className="p-3 mb-3 transition bg-white border-4 border-transparent rounded-lg shadow ring-2 ring-blue-500"
                  >
                    <input
                      type="text"
                      name="label"
                      className="focus:outline-none"
                      onBlur={() => setIsCreating(false)}
                      onKeyDown={handleBlurOnEscape}
                      autoFocus
                    />
                  </form>
                )}
                {items.map((item, index) => (
                  <Item
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    status={status}
                    index={index}
                    action={action}
                    className="mb-3"
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
