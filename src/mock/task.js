import {COLORS} from "../const";

const DescriptionItem = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

const DefaultRepeatingDays = {
  'mo': false,
  'tu': false,
  'we': false,
  'th': false,
  'fr': false,
  'sa': false,
  'su': false,
};

const Tags = [
  `#homework`,
  `#theory`,
  `#practice`,
  `#intensive`,
  `#keks`,
];

const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomArrayItem = (array) => {
  return array[getRandomInteger(0, array.length)];
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sing = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sing * getRandomInteger(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateRepeatingDays = () => {
  return Object.assign({}, DefaultRepeatingDays, {
    'mo': Math.random() > 0.5,
    'tu': Math.random() > 0.5,
    'we': Math.random() > 0.5,
    'th': Math.random() > 0.5,
    'fr': Math.random() > 0.5,
    'sa': Math.random() > 0.5,
    'su': Math.random() > 0.5,
  });
};

const generateTags = (tags) => {
  return tags.filter(() => Math.random() > 0.5).slice(0, 3);
};

const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();
  return {
    description: getRandomArrayItem(DescriptionItem),
    dueDate,
    repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays(),
    tags: new Set(generateTags(Tags)),
    color: getRandomArrayItem(COLORS),
    isFavorite: Math.random() > 0.5,
    isArchived: Math.random() > 0.5,
  };
};

const generateTasks = (count) => {
  return new Array(count).fill(``).map(generateTask);
};

export {generateTask, generateTasks};
