const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hour = castTimeFormat(date.getHours() % 12);

  const minuts = castTimeFormat(date.getMinutes());
  const interval = date.getHours() > 11 ? `pm` : `am`;

  return `${hour}:${minuts} ${interval}`;
};
