import { useCallback, useState } from "react";

export const useSelection = (items = [], onLimitReached = null) => {
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deselected, setDeselected] = useState([]);
  const [perPage, setPerPage] = useState(null);

  const MAX_SELECTION_LIMIT = 400;

  const handleSetSelectItems = (ids) => {
    setSelected([...ids]);
    setSelectAll(true);
    setDeselected([]);
  }

  const handleSelectAll = useCallback(() => {
    setSelected([...items]);
    setSelectAll(true);
    setDeselected([]);
  }, [items]);

  const handleSelectOne = useCallback((item) => {
    if (selectAll) {
      setDeselected((prevState) => {
        const newDeselected = prevState.filter((_item) => _item !== item);
        if (newDeselected.length > MAX_SELECTION_LIMIT && onLimitReached) {
          onLimitReached(`Deselection limited to ${MAX_SELECTION_LIMIT} items`);
          return newDeselected.slice(0, MAX_SELECTION_LIMIT);
        }
        return newDeselected;
      });
    } else {
      setSelected((prevState) => {
        if (prevState.length >= MAX_SELECTION_LIMIT) {
          if (onLimitReached) {
            onLimitReached(`Cannot select more than ${MAX_SELECTION_LIMIT} items`);
          }
          return prevState;
        }
        return [...prevState, item];
      });
    }
  }, [selectAll, onLimitReached]);

  const handleSelectPage = (val) => {
    if (selectAll) {
      setDeselected((prevState) => {
        const newDeselected = prevState.filter((item) => !val.includes(item));
        if (newDeselected.length > MAX_SELECTION_LIMIT && onLimitReached) {
          onLimitReached(`Deselection limited to ${MAX_SELECTION_LIMIT} items`);
          return newDeselected.slice(0, MAX_SELECTION_LIMIT);
        }
        return newDeselected;
      });
    } else {
      const newSelect = [...new Set([...selected, ...val])];
      if (newSelect.length > MAX_SELECTION_LIMIT) {
        if (onLimitReached) {
          onLimitReached(`Selection limited to ${MAX_SELECTION_LIMIT} items`);
        }
        setSelected(newSelect.slice(0, MAX_SELECTION_LIMIT));
      } else {
        setSelected(newSelect);
      }
    }
  };

  const handleDeSelectPage = (val) => {
    if (selectAll) {
      const newDeselected = [...new Set([...deselected, ...val])];
      if (newDeselected.length > MAX_SELECTION_LIMIT) {
        if (onLimitReached) {
          onLimitReached(`Deselection limited to ${MAX_SELECTION_LIMIT} items`);
        }
        setDeselected(newDeselected.slice(0, MAX_SELECTION_LIMIT));
      } else {
        setDeselected(newDeselected);
      }
    } else {
      const newIds = [...selected]?.filter((item) => !val?.includes(item));
      setSelected(newIds);
    }
  };

  const handleDeselectAll = useCallback(() => {
    setSelectAll(false);
    setSelected([]);
    setDeselected([]);
    setPerPage(null);
  }, []);

  const handleDeselectOne = useCallback((item) => {
    if (selectAll) {
      setDeselected((prevState) => {
        const newDeselected = [...prevState, item];
        if (newDeselected.length > MAX_SELECTION_LIMIT) {
          if (onLimitReached) {
            onLimitReached(`Cannot deselect more than ${MAX_SELECTION_LIMIT} items`);
          }
          return prevState;
        }
        return newDeselected;
      });
    } else {
      setSelected((prevState) => {
        return prevState.filter((_item) => _item !== item);
      });
    }
  }, [selectAll, onLimitReached]);

  const getEffectiveSelected = useCallback(() => {
    if (selectAll) {
      return items.filter((item) => !deselected.includes(item));
    }
    return selected;
  }, [selectAll, selected, deselected, items]);

  const getNonClientIds = useCallback(() => {
    if (selectAll && deselected.length > 0) {
      return deselected;
    }
    return [];
  }, [selectAll, deselected]);

  return {
    handleDeselectAll,
    handleDeselectOne,
    handleSelectAll,
    handleSelectPage,
    handleDeSelectPage,
    handleSelectOne,
    handleSetSelectItems,
    selected: getEffectiveSelected(),
    selectAll,
    deselected,
    perPage,
    setPerPage,
    getNonClientIds,
  };
};
