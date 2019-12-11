import moment from 'moment';

export const formatTime = (date) => {
  return moment(date).from(`hh:mm: A`);
};

export const formatDate = (date) => {
  return moment(date).from(`DD MMMM`);
};
