import FilterComponent from "./components/filter";
import BoardComponent from "./components/board";
import SiteMenuComponent from "./components/menu";
import TaskEditComponent from "./components/task-edit";
import LoadMoreButtonComponent from "./components/load-more-button";
import TaskComponent from "./components/task";

import {generateTasks} from "./mock/task";
import {generateFilters} from "./mock/filter";
import {render, RenderPosition} from "./utils";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const editButton = taskComponent.getElement().querySelector('.card__btn--edit');

  editButton.addEventListener(`click`, function () {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement())
  });

  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREBEGIN);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREBEGIN);

let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;
const tasks = generateTasks(TASK_COUNT);

const filters = generateFilters(tasks);
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREBEGIN);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREBEGIN);

const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

tasks.slice(0, showingTaskCount).forEach((task) => {
  renderTask(task);
});

const boardElement = siteMainElement.querySelector(`.board`);
render(boardElement, new LoadMoreButtonComponent().getElement(), RenderPosition.BEFOREBEGIN);

const loadMoreButtonComponent = new LoadMoreButtonComponent();
loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
  let prevTackCount = showingTaskCount;
  showingTaskCount += SHOWING_TASKS_COUNT_BY_BUTTON;
  tasks.slice(prevTackCount, showingTaskCount)
    .forEach((task) => renderTask((task)), RenderPosition.BEFOREBEGIN);

  if (showingTaskCount >= tasks.length) {
    loadMoreButtonComponent.getElement().remove();
  }
});
