import API from './api'
import BoardComponent from "./components/board";
import SiteMenuComponent, {MenuItem} from "./components/menu";
import StatisticsComponent from './components/statistics.js';
import BoardController from './controllers/board';
import FilterController from './controllers/filter.js';
import TasksModel from './models/tasks.js';
import {render, RenderPosition} from "./utils/render";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAoW=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/task-manager`;

const dateTo = new Date();

const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();
const api = new API(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector(`.main`);
const tasksModel = new TasksModel();

const siteHeaderElement = document.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();

const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});


const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel, api);
const filterController = new FilterController(siteMainElement, tasksModel);

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);
filterController.render();
render(siteMainElement, boardComponent, RenderPosition.BEFOREBEGIN);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);

statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });
