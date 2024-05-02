import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import {
    NavigateOptions,
    useSearchParams,
} from 'react-router-dom';
import {
    encodeDate,
    isNotDefined,
    listToMap,
} from '@togglecorp/fujs';

type SearchValueFromUrl = string | null | undefined;
type SearchValueFromUser = string | number | boolean | Date | undefined | null;

type ValueOrSetter<VALUE> = VALUE | ((prevValue: VALUE) => VALUE);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func = (...args:any[]) => any;
export function isCallable<T, X extends Func>(value: T | X): value is X {
    return typeof value === 'function';
}

function useUrlSearchState<VALUE, KEY extends string>(
    keys: KEY[],
    deserialize: (valueFromUrl: Record<KEY, SearchValueFromUrl>) => VALUE,
    serialize: (value: VALUE) => Record<KEY, SearchValueFromUser>,
    navigateOptions: NavigateOptions = { replace: true },
) {
    const [searchParams, setSearchParams] = useSearchParams();
    const serializerRef = useRef(serialize);
    const deserializerRef = useRef(deserialize);

    useEffect(
        () => {
            serializerRef.current = serialize;
        },
        [serialize],
    );

    useEffect(
        () => {
            deserializerRef.current = deserialize;
        },
        [deserialize],
    );

    const getValues = useCallback(
        (currentKeys: KEY[], currentUrlParams: URLSearchParams) => (
            listToMap(
                currentKeys,
                (key) => key,
                (key) => currentUrlParams.get(key),
            )
        ),
        [],
    );

    const potentialValue = useMemo(
        () => getValues(keys, searchParams),
        [keys, searchParams, getValues],
    );

    const value = useMemo(
        () => deserializerRef.current(potentialValue),
        [potentialValue],
    );

    const setValue = useCallback(
        (newValueOrGetNewValue: ValueOrSetter<VALUE>) => {
            setSearchParams(
                (prevParams) => {
                    const encodedValue = isCallable(newValueOrGetNewValue)
                        ? newValueOrGetNewValue(
                            deserializerRef.current(getValues(keys, prevParams)),
                        )
                        : newValueOrGetNewValue;

                    const newValue = serializerRef.current(encodedValue);

                    (Object.keys(newValue) as KEY[]).forEach(
                        (newValueKey) => {
                            const newParamValue = newValue[newValueKey];

                            if (isNotDefined(newParamValue)) {
                                prevParams.delete(newValueKey);
                            } else {
                                let serializedValue: string;

                                if (typeof newParamValue === 'number') {
                                    serializedValue = String(newParamValue);
                                } else if (typeof newParamValue === 'boolean') {
                                    serializedValue = newValue ? 'true' : 'false';
                                } else if (newParamValue instanceof Date) {
                                    serializedValue = encodeDate(newParamValue);
                                } else {
                                    serializedValue = newParamValue;
                                }

                                prevParams.set(newValueKey, serializedValue);
                            }
                        },
                    );

                    return prevParams;
                },
                navigateOptions,
            );
        },
        [setSearchParams, keys, getValues, navigateOptions],
    );

    return [value, setValue] as const;
}

export default useUrlSearchState;
