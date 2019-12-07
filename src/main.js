import FilterComponent from "./components/filter";
import BoardComponent from "./components/board";
import SiteMenuComponent from "./components/menu";
import BoardController from './controllers/board.js';

import {generateTasks} from "./mock/task";
import {generateFilters} from "./mock/filter";
import {render, RenderPosition} from "./utils/render";

const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREBEGIN);

const tasks = generateTasks(TASK_COUNT);

const filters = generateFilters(tasks);
render(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREBEGIN);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREBEGIN);

const boardController = new BoardController(boardComponent);
boardController.render(tasks);

