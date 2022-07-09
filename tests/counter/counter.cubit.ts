import { Cubit } from "bloc-state";
import { delay } from "./delay";

export default class CounterCubit extends Cubit<number> {
  constructor() {
    super(0);
  }

  increment = () => this.emit(this.state + 1);

  decrement = () => this.emit(this.state - 1);
}
