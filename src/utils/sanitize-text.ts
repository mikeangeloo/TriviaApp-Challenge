const he = require('he');

export const sanitizeText = (text?: string): string =>
  text ? he.decode(text) : '';
