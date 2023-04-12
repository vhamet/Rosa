import { useEffect } from "react";

const useClickOutside = (ref, onClickOutside, shouldTrigger = true) =>
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        onClickOutside &&
        shouldTrigger &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        onClickOutside();
      }
    };

    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, [onClickOutside, ref, shouldTrigger]);

export default useClickOutside;
