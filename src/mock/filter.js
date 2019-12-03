const generateFilters = (tasks) => {
  return [
    {
      title: `all`,
      count: tasks.length
    },
    {
      title: `overdue`,
      count: tasks.reduce((reducer, task) => {
        return (task.dueDate instanceof Date && task.dueDate < Date.now()) ? ++reducer : reducer;
      }, 0)
    },
    {
      title: `today`,
      count: tasks.reduce((reducer, task) => {
        let today = new Date();
        return (task.dueDate instanceof Date && task.dueDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) ? ++reducer : reducer;
      }, 0)
    },
    {
      title: `favorite`,
      count: tasks.reduce((reducer, task) => {
        return task.isFavorite ? ++reducer : reducer;
      }, 0)
    },
    {
      title: `repeating`,
      count: tasks.reduce((reducer, {repeatingDays}) =>
        Object.keys(repeatingDays).some((day) => repeatingDays[day]) ? reducer + 1 : reducer, 0)
    },
    {
      title: `tags`,
      count: tasks.reduce((reducer, task) => {
        return task.tags.size > 0 ? ++reducer : reducer;
      }, 0)
    },
    {
      title: `archive`,
      count: tasks.reduce((reducer, task) => {
        return task.isArchived ? ++reducer : reducer;
      }, 0)
    },
  ];
};

export {generateFilters};
