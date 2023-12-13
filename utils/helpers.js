import { config } from '../lib/constants';

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: config.app.TIMEZONE ?? 'UTC'
  });
};

export const pluralize = (count, noun, suffix = 's') => {
  return `${count} ${noun}${count !== 1 ? suffix : ''}`;
};
