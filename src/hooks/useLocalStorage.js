import { useEffect } from "react";
import { useState } from "react";

export default function useLocalStorage(initialState, key) {
  const [value, setValue] = useState(function () {
    const sotredValue = localStorage.getItem(key);
    return sotredValue ? JSON.parse(sotredValue) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);
  return [value, setValue];
}
