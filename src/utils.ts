import {Coordinates} from './model/reversi';

const LETTERS_ARRAY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const convertFromStringToCoordinates = (data: string): Coordinates => {
  if (data === 'pass') return null;
  const [letter, number] = data.split('');
  const x = parseInt(number) - 1;
  const y = LETTERS_ARRAY.indexOf(letter);
  return { x, y };
};

export const convertFromCoordinatesToString = (coords: Coordinates) => {
  const letter = LETTERS_ARRAY[coords.y];
  const number = coords.x + 1;

  return `${letter}${number}`;
};
