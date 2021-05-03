import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useTask } from './hooks';
import { List } from './components';

function App() {
  const { lists, action } = useTask([
    { id: 'todo', title: 'To do', tasks: [] },
    { id: 'progress', title: 'In progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ]);

  const onDragEnd = result => {
    const { draggableId, destination, source, type } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'list') {
      action.moveList(source.index, destination.index);
      return;
    }

    action.moveTask({
      source: {
        index: source.index,
        status: source.droppableId,
      },
      destination: {
        index: destination.index,
        status: destination.droppableId,
      },
      taskId: draggableId,
    });
  };

  return (
    <div className="container px-4 mx-auto my-12">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list" direction="horizontal" type="list">
          {provided => (
            <div className="grid grid-cols-3" {...provided.droppableProps} ref={provided.innerRef}>
              {lists.map((list, index) => (
                <List
                  key={list.id}
                  title={list.title}
                  status={list.id}
                  items={list.tasks}
                  action={action}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
