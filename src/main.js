import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createBoardTemplate} from './components/board';

import {createTaskTemplate} from './components/task';
import {createTaskEditTemplate} from './components/task-edit';

import {createLoadMoreButtonTemplate} from './components/load-more-button';

import {generateTasks} from "./mock/task";
import {generateFilters} from "./mock/filter";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);


render(siteHeaderElement, createMenuTemplate());

let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

const tasks = generateTasks(TASK_COUNT);

const filters = generateFilters(tasks);
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createBoardTemplate());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
render(taskListElement, createTaskEditTemplate(tasks[0]));

tasks.slice(1, showingTaskCount).forEach((task) => render(taskListElement, createTaskTemplate(task)));

const boardElement = siteMainElement.querySelector(`.board`);
render(boardElement, createLoadMoreButtonTemplate());

const loadMoreButton = boardElement.querySelector(`.load-more`);
loadMoreButton.addEventListener(`click`, () => {
  let prevTackCount = showingTaskCount;
  showingTaskCount += SHOWING_TASKS_COUNT_BY_BUTTON;
  tasks.slice(prevTackCount, showingTaskCount).forEach((task) => render(taskListElement, createTaskTemplate(task)));

  if (showingTaskCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
