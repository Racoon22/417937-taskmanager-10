import FilterComponent from "./components/filter";
import BoardComponent from "./components/board";
import SiteMenuComponent from "./components/menu";
import TaskEditComponent from "./components/task-edit";
import LoadMoreButtonComponent from "./components/load-more-button";
import TaskComponent from "./components/task";
import SortComponent from "./components/sort";
import NoTasksComponent from "./components/no-tasks";
import TasksComponent from "./components/tasks";

import {generateTasks} from "./mock/task";
import {generateFilters} from "./mock/filter";
import {render, RenderPosition} from "./utils";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const onEscPressDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscPressDown)
    }
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };


  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector('.card__btn--edit');

  editButton.addEventListener(`click`, function () {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscPressDown);
  });

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, () => {
    replaceEditToTask();
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREBEGIN);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREBEGIN);

let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

const tasks = generateTasks(TASK_COUNT);
const allTaskArchived = tasks.every((tasks) => tasks.isArchived);


const filters = generateFilters(tasks);
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREBEGIN);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREBEGIN);

if (allTaskArchived) {
  render(boardComponent.getElement(), new NoTasksComponent().getElement(), RenderPosition.BEFOREBEGIN)
} else {
  render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREBEGIN);
  render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREBEGIN);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);
  tasks.slice(0, showingTaskCount).forEach((task) => {
    renderTask(taskListElement, task);
  });
  const boardElement = siteMainElement.querySelector(`.board`);
  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardElement, loadMoreButtonComponent.getElement(), RenderPosition.BEFOREBEGIN);

  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    let prevTackCount = showingTaskCount;
    showingTaskCount += SHOWING_TASKS_COUNT_BY_BUTTON;
    tasks.slice(prevTackCount, showingTaskCount)
      .forEach((task) => renderTask(taskListElement, task), RenderPosition.BEFOREBEGIN);

    if (showingTaskCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
    }
  });
}

