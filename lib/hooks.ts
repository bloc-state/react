import { useState, useEffect, useCallback } from "react";
import { Bloc, BlocEvent, Cubit } from "bloc-state";
import { filter, Observable } from "rxjs";

/**
 * useBloc & useCubit return types
 */
export type UseBlocReturnType<E extends BlocEvent, S> = {
  state: S | null;
  addEvent: (event: E) => void;
  bloc: Bloc<E, S>;
};

export type CubitStateType<T extends Cubit<any>> = T extends Cubit<infer U> ? U : never;

export type UseCubitReturnType<T extends Cubit<any>> = [state: CubitStateType<T> | null, cubit: T];

export type BlocPredicate<S> = (state: S) => boolean;

export type UseBlocConfig<S> = {
  filter: BlocPredicate<S>;
  select?: <K>(state: S) => K;
};

/**
 * useAddEvent hook
 */
export const useAddEvent = <E extends BlocEvent, S>(bloc: Bloc<E, S>) => {
  return useCallback((event: E) => bloc.addEvent(event), []);
};

export const subscribeToObservable = <S>(observable: Observable<S>, setState: (state: S) => void) => {};

/**
 * useBloc & useCubit hook
 */
export const useBloc = <E extends BlocEvent, S>(
  bloc: Bloc<E, S>,
  config: UseBlocConfig<S> = {
    filter: (state: S) => true,
  }
): UseBlocReturnType<E, S> => {
  const defaultBlocConfig: UseBlocConfig<S> = {
    filter: (state: S) => true,
  };

  const blocConfig = { ...defaultBlocConfig, config };
  const initialState = blocConfig.filter(bloc.state) ? bloc.state : null;
  const [state, setState] = useState(initialState);
  const addEvent = useAddEvent(bloc);

  const setStateFromObservable = useCallback((state: S) => {
    setState(state);
  }, []);

  useEffect(() => {
    const subscription = bloc.state$.pipe(filter((s) => blocConfig.filter(s))).subscribe({
      next: (_state) => {
        if (state === _state) return;
        setState(_state);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    state,
    addEvent,
    bloc,
  };
};

export const useCubit = <C extends Cubit<any>>(
  cubit: C,
  config: UseBlocConfig<CubitStateType<C>> = {
    filter: (state) => true,
  }
): UseCubitReturnType<C> => {
  const initialState = config.filter(cubit.state) ? cubit.state : null;
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const subscription = cubit.state$.pipe(filter((s) => config.filter(s))).subscribe({
      next: (_state) => {
        if (state === _state) return;
        setState(_state);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  return [state, cubit];
};
