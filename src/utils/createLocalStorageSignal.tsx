import { createSignal, onCleanup } from 'solid-js';

/**
 * Creates a signal that is backed by localStorage. This allows the value to persist across browser sessions.
 *
 * @param key The localStorage key to use for storing the value.
 * @param initialValue The initial value of the signal, used if there's no value in localStorage yet.
 * @returns A tuple with the same interface as createSignal: [value, setValue].
 */
function createLocalStorageSignal<T>(key: string, initialValue: T): [() => T, (value: T) => void] {
    // Attempt to read the value from localStorage, or use the initial value if it's not found.
    const storedValue = localStorage.getItem(key);
    const [value, setValue] = createSignal<T>(storedValue ? JSON.parse(storedValue) : initialValue);

    // Update localStorage whenever the value changes.
    const setAndStoreValue = (newValue: T) => {
        // @ts-ignore
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
    };

    // Optionally, listen for storage events to sync across tabs.
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key && event.newValue !== null) {
            setValue(JSON.parse(event.newValue));
        }
    };

    window.addEventListener('storage', handleStorageChange);
    onCleanup(() => window.removeEventListener('storage', handleStorageChange));

    return [value, setAndStoreValue];
}

export default createLocalStorageSignal;
