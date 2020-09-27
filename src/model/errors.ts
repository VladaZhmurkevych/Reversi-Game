export class ReversiBaseCoordinatesError extends Error {
  public x: number;
  public y: number;
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
}
export class ReversiGameNotStartedError extends Error {}
export class ReversiGameIsEndedError extends ReversiBaseCoordinatesError {}
export class ReversiWrongCoordinatesError extends Error {}
export class ReversiCellIsNotAvailableError extends ReversiBaseCoordinatesError {}
