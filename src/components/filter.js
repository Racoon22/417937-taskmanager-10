const createFilterMarkup = (filter, isChecked) => {
  const {title, count} = filter;
  console.log(filter);
  return (
    `<input
          type="radio"
          id="filter__${title}"
          class="filter__input visually-hidden"
          name="filter"
          ${isChecked ? `checked` : ``}
    />
    <label for="filter__all" class="filter__label">${title}
      <span class="filter__${title}-count">${count}</span>
    </label>`
  );
};

export const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

