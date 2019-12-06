import {remove, render, RenderPosition, replace} from "../utils/render";
import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import LoadMoreButtonComponent from "../components/load-more-button";
import SortComponent from "../components/sort";
import NoTasksComponent from "../components/no-tasks";
import TasksComponent from "../components/tasks";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const onEscPressDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscPressDown);
    }
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };


  const taskComponent = new TaskComponent(task);

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscPressDown);
  });

  const taskEditComponent = new TaskEditComponent(task);
  taskEditComponent.setSubmitHandler(() => {
    replaceEditToTask();
  });

  render(taskListElement, taskComponent, RenderPosition.BEFOREBEGIN);
};

export default class boardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const container = this._container.getElement();
    const isAllTaskArchived = tasks.every((task) => task.isArchived);

    if (isAllTaskArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREBEGIN);
    } else {
      render(container, this._sortComponent, RenderPosition.BEFOREBEGIN);
      render(container, this._tasksComponent, RenderPosition.BEFOREBEGIN);

      const taskListElement = this._tasksComponent.getElement();

      let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;
      tasks.slice(0, showingTaskCount).forEach((task) => {
        renderTask(taskListElement, task);
      });

      render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREBEGIN);

      this._loadMoreButtonComponent.setClickHandler(() => {
        let prevTackCount = showingTaskCount;
        showingTaskCount += SHOWING_TASKS_COUNT_BY_BUTTON;
        tasks.slice(prevTackCount, showingTaskCount)
          .forEach((task) => renderTask(taskListElement, task), RenderPosition.BEFOREBEGIN);

        if (showingTaskCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    }
  }
}
