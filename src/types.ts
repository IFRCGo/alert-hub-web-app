export type SetValueArg<T> = T | ((value: T | undefined) => T);

export type EntriesAsList<T> = {
    [K in keyof T]-?: [SetValueArg<T[K]>, K, ...unknown[]];
}[keyof T];
