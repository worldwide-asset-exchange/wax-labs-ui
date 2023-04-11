import { useState, useCallback } from 'react';
import { getQueryStringValue, setQueryStringValue } from './queryString';

function useQueryString(key, initialValue) {
    const [value, setValue] = useState(getQueryStringValue(key) || initialValue);
    const onSetValue = useCallback(
        (newValue) => {
            if (newValue.skipUpdateQS) {
                setValue(newValue.value);
            } else {
                setValue(newValue);
                setQueryStringValue(key, newValue);
            }
        },
        [key]
    );

    return [value, onSetValue];
}

export default useQueryString;
