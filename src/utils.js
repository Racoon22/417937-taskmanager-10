export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREBEGIN: `beforebegin`
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    default:
      container.append(element)
  }
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hour = castTimeFormat(date.getHours() % 12);

  const minuts = castTimeFormat(date.getMinutes());
  const interval = date.getHours() > 11 ? `pm` : `am`;

  return `${hour}:${minuts} ${interval}`;
};
