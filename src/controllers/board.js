import {remove, render, RenderPosition} from "../utils/render";
import LoadMoreButtonComponent from "../components/load-more-button";
import SortComponent, {SORT_TYPE} from "../components/sort";
import NoTasksComponent from "../components/no-tasks";
import TasksComponent from "../components/tasks";
import TaskController from "./task";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task);
    return taskController;
  });
};

export default class boardController {
  constructor(container) {
    this._container = container;
    this._tasks = [];
    this._showedTaskControllers = [];
    this._showingTaskCount = SHOWING_TASKS_COUNT_ON_START;
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks) {
    this._tasks = tasks;
    const container = this._container.getElement();

    const isAllTaskArchived = this._tasks.every((task) => task.isArchive);
    if (isAllTaskArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREBEGIN);
      return;
    }
    render(container, this._sortComponent, RenderPosition.BEFOREBEGIN);
    render(container, this._tasksComponent, RenderPosition.BEFOREBEGIN);

    let taskListElement = this._tasksComponent.getElement();
    const newTasks = renderTasks(taskListElement, this._tasks.slice(0, this._showingTaskCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._showingTaskCount >= this._tasks.length) {
      return;
    }
    const container = this._container.getElement();
    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREBEGIN);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTaskCount = this._showingTaskCount;
      const taskListElement = this._tasksComponent.getElement();

      this._showingTaskCount = this._showingTaskCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      const newTasks = renderTasks(taskListElement, this._tasks.slice(prevTaskCount, this._showingTaskCount), this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTaskCount >= this._tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _onDataChange(tackController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));
    tackController.render(this._tasks[index]);
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];

    switch (sortType) {
      case SORT_TYPE.DATE_UP :
        sortedTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SORT_TYPE.DATE_DOWN :
        sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      default :
        sortedTasks = this._tasks.slice(0, this._showingTaskCount);
        break;
    }

    let taskListElement = this._tasksComponent.getElement();
    taskListElement.innerHTML = ``;

    this._showedTaskControllers = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);

    renderTasks(taskListElement, sortedTasks);
    if (sortType === SORT_TYPE.DATE_DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }

  }
}

