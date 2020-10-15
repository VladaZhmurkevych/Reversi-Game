import Cell from '../cell';

export default class BlackHoleCell extends Cell {
  get isAvailable (): boolean {
    return false;
  }

  set isAvailable (value: boolean) {
    return;
  }
}
