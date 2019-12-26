import BoardComponent from "./components/board";
import SiteMenuComponent from "./components/menu";
import BoardController from './controllers/board';
import FilterController from './controllers/filter.js';
import TasksModel from './models/tasks.js';

import {generateTasks} from "./mock/task";
import {render, RenderPosition} from "./utils/render";


const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();

siteMenuComponent.getElement().querySelector(`.control__label--new-task`)
  .addEventListener(`click`, () => {
    boardController.createTask();
  });

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREBEGIN);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();

