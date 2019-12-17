import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {render, replace, RenderPosition} from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscPressDown = this._onEscPressDown.bind(this);
  }

  render(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscPressDown);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {isArchive: !task.isArchive}));
      document.addEventListener(`keydown`, this._onEscPressDown);
    });

    this._taskComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {isFavorite: !task.isFavorite}));
      document.addEventListener(`keydown`, this._onEscPressDown);
    });

    this._taskEditComponent.setSubmitHandler(() => {
      this._replaceEditToTask();
    });

    if (oldTaskComponent && oldTaskEditComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._taskComponent, RenderPosition.BEFOREBEGIN);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceEditToTask() {
    this._taskEditComponent.reset();
    replace(this._taskComponent, this._taskEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();

    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _onEscPressDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscPressDown);
    }
  }
}

