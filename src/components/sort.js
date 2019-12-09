import AbstractComponent from "./abstract-component";

export const SORT_TYPE = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DATE_DEFAULT: `date-default`,
};

const createSortTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter" data-sort-type="${SORT_TYPE.DATE_DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__filter" data-sort-type="${SORT_TYPE.DATE_UP}">SORT BY DATE up</a>
      <a href="#" class="board__filter" data-sort-type="${SORT_TYPE.DATE_DOWN}">SORT BY DATE down</a>
     </div>`
  );
};


export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SORT_TYPE.DATE_DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType !== sortType) {
        this._currentSortType = sortType;
      }

      handler(this._currentSortType);
    });
  }
}
