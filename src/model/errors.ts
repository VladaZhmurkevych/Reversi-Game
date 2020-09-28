export class ReversiBaseCoordinatesError extends Error {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
}

export class ReversiCellIsNotAvailableError extends ReversiBaseCoordinatesError {}

export class ReversiGameIsEndedError extends ReversiBaseCoordinatesError {}

export class ReversiGameNotStartedError extends Error {}

export class ReversiWrongCoordinatesError extends Error {}
