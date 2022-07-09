import { act, renderHook } from "@testing-library/react-hooks";
import CounterCubit from "./counter/counter.cubit";
import { useCubit } from "../lib/hooks";

describe("useCubit Hook", () => {
  let counterCubit: CounterCubit;

  beforeEach(() => {
    counterCubit = new CounterCubit();
  });

  it("should use counter", () => {
    const { result } = renderHook(() => useCubit(counterCubit));

    expect(result.current[0]).toBe(0);
    expect(result.current[1]).toBe(counterCubit);
  });

  it("should increment counter", () => {
    const { result, waitForNextUpdate } = renderHook(() => useCubit(counterCubit));

    act(() => {
      result.current[1].increment();
    });

    expect(result.current[0]).toBe(1);
  });
});
