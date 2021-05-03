import { useRef, useState } from 'react';

export function useTask(initialList = []) {
  const [lists, setLists] = useState(initialList);
  const idCounter = useRef(1);

  const createTask = task => {
    const { status, ...data } = task;
    const newTask = { ...data, id: idCounter.current++ };

    setLists(currentLists => {
      return currentLists.map(list => {
        const listToUpdate = list.id === status;

        if (!listToUpdate) {
          return list;
        }

        const updatedTasks = [newTask, ...list.tasks];
        return { ...list, tasks: updatedTasks };
      });
    });
  };

  const updateTask = update => {
    const { status, ...data } = update;

    setLists(currentLists => {
      return currentLists.map(list => {
        const listToUpdate = list.id === status;

        if (!listToUpdate) {
          return list;
        }

        const updatedTasks = list.tasks.map(task => {
          const taskToUpdate = task.id === data.id;

          if (!taskToUpdate) {
            return task;
          }
          return data;
        });

        return { ...list, tasks: updatedTasks };
      });
    });
  };

  const moveTask = ({ source, destination, taskId } = {}) => {
    const droppedInSameList = source.status === destination.status;

    setLists(currentLists => {
      if (droppedInSameList) {
        return currentLists.map(list => {
          const listToUpdate = list.id === destination.status;

          if (listToUpdate) {
            const updatedTasks = [...list.tasks];

            const [movedTask] = updatedTasks.splice(source.index, 1);
            updatedTasks.splice(destination.index, 0, movedTask);

            return { ...list, tasks: updatedTasks };
          }
          return list;
        });
      }

      const tasks = currentLists.flatMap(list => list.tasks);
      const movedTask = tasks.find(task => task.id === Number(taskId));

      return currentLists.map(list => {
        const isSourceList = list.id === source.status;
        const isDestinationList = list.id === destination.status;

        if (isSourceList) {
          const updatedTasks = [...list.tasks];

          updatedTasks.splice(source.index, 1);
          return { ...list, tasks: updatedTasks };
        }

        if (isDestinationList) {
          const updatedTasks = [...list.tasks];

          updatedTasks.splice(destination.index, 0, movedTask);
          return { ...list, tasks: updatedTasks };
        }

        return list;
      });
    });
  };

  const removeTask = taskId => {
    setLists(currentLists => {
      return currentLists.map(list => {
        const updatedTasks = list.tasks.filter(task => task.id !== taskId);
        return { ...list, tasks: updatedTasks };
      });
    });
  };

  const moveList = (sourceIndex, destinationIndex) => {
    setLists(currentLists => {
      const updatedList = [...currentLists];

      const [movedList] = updatedList.splice(sourceIndex, 1);
      updatedList.splice(destinationIndex, 0, movedList);

      return updatedList;
    });
  };

  return {
    lists,
    action: {
      create: createTask,
      update: updateTask,
      remove: removeTask,
      moveTask,
      moveList,
    },
  };
}
