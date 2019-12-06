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
import {remove, render, RenderPosition, replace} from "./utils/render";

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

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREBEGIN);

let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

const tasks = generateTasks(TASK_COUNT);
const allTaskArchived = tasks.every((tasks) => tasks.isArchived);


const filters = generateFilters(tasks);
render(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREBEGIN);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREBEGIN);

if (allTaskArchived) {
  render(boardComponent.getElement(), new NoTasksComponent(), RenderPosition.BEFOREBEGIN)
} else {
  render(boardComponent.getElement(), new SortComponent(), RenderPosition.BEFOREBEGIN);
  render(boardComponent.getElement(), new TasksComponent(), RenderPosition.BEFOREBEGIN);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);
  tasks.slice(0, showingTaskCount).forEach((task) => {
    renderTask(taskListElement, task);
  });
  const boardElement = siteMainElement.querySelector(`.board`);
  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardElement, loadMoreButtonComponent, RenderPosition.BEFOREBEGIN);

  loadMoreButtonComponent.setClickHandler(() => {
    let prevTackCount = showingTaskCount;
    showingTaskCount += SHOWING_TASKS_COUNT_BY_BUTTON;
    tasks.slice(prevTackCount, showingTaskCount)
      .forEach((task) => renderTask(taskListElement, task), RenderPosition.BEFOREBEGIN);

    if (showingTaskCount >= tasks.length) {
      remove(loadMoreButtonComponent);
    }
  });
}

