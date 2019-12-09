import {remove, render, RenderPosition, replace} from "../utils/render";
import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import LoadMoreButtonComponent from "../components/load-more-button";
import SortComponent, {SORT_TYPE} from "../components/sort";
import NoTasksComponent from "../components/no-tasks";
import TasksComponent from "../components/tasks";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

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

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscPressDown);
  });

  taskEditComponent.setSubmitHandler(() => {
    replaceEditToTask();
  });

  render(taskListElement, taskComponent, RenderPosition.BEFOREBEGIN);
};

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
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
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    let taskListElement = this._tasksComponent.getElement();

    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREBEGIN);

      this._loadMoreButtonComponent.setClickHandler(() => {
        let prevTackCount = showingTasksCount;
        showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;
        tasks.slice(prevTackCount, showingTasksCount)
          .forEach((task) => renderTask(taskListElement, task), RenderPosition.BEFOREBEGIN);

        if (showingTasksCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    };

    const container = this._container.getElement();
    const isAllTaskArchived = tasks.every((task) => task.isArchived);

    if (isAllTaskArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREBEGIN);
    } else {
      render(container, this._sortComponent, RenderPosition.BEFOREBEGIN);
      render(container, this._tasksComponent, RenderPosition.BEFOREBEGIN);

      renderTasks(taskListElement, tasks.slice(0, showingTasksCount));
      renderLoadMoreButton();

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        let sortedTasks = [];

        switch (sortType) {
          case SORT_TYPE.DATE_UP :
            sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
            break;
          case SORT_TYPE.DATE_DOWN :
            sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
            break;
          default :
            sortedTasks = tasks.slice(0, showingTasksCount);
            break;
        }

        taskListElement.innerHTML = ``;
        renderTasks(taskListElement, sortedTasks);
        if (sortType === SORT_TYPE.DATE_DEFAULT) {
          renderLoadMoreButton();
        } else {
          remove(this._loadMoreButtonComponent);
        }
      }
      );

      this._loadMoreButtonComponent.setClickHandler(() => {
        let prevTackCount = showingTasksCount;
        showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;
        tasks.slice(prevTackCount, showingTasksCount)
          .forEach((task) => renderTask(taskListElement, task), RenderPosition.BEFOREBEGIN);

        if (showingTasksCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    }
  }
}
