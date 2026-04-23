import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage.js';
import layouts from '../data/layouts/index.js';

const DEFAULT_STATE = {
  layout: 'tkl',
  caseColor: '#1a1a1a',
  caseFinish: 'matte',
  keyColors: {},
  selectedKeys: [],
  activeColor: '#cccccc',
  colorwayName: 'Untitled',
  workspace: 'dark',
};

const STORAGE_KEY = 'keycap-colorizer-slots';
const MAX_SLOTS = 5;

function buildInitialSlots() {
  return { active: 0, slots: [{ ...DEFAULT_STATE }] };
}

export default function useColorway() {
  const [store, setStore] = useLocalStorage(STORAGE_KEY, buildInitialSlots);

  // Lazily normalise: if store was built by the factory, call it
  const normalised = typeof store === 'function' ? store() : store;
  const { active, slots } = normalised;
  const state = slots[active] ?? { ...DEFAULT_STATE };

  const update = useCallback(
    (patch) => {
      setStore((prev) => {
        const p = typeof prev === 'function' ? prev() : prev;
        const newSlots = [...p.slots];
        newSlots[p.active] = { ...newSlots[p.active], ...patch };
        return { ...p, slots: newSlots };
      });
    },
    [setStore],
  );

  const setLayout = useCallback(
    (layout) => update({ layout, selectedKeys: [] }),
    [update],
  );

  const setActiveColor = useCallback(
    (activeColor) => update({ activeColor }),
    [update],
  );

  const applyColorToSelected = useCallback(() => {
    setStore((prev) => {
      const p = typeof prev === 'function' ? prev() : prev;
      const cur = p.slots[p.active];
      const keyColors = { ...cur.keyColors };
      for (const id of cur.selectedKeys) {
        keyColors[id] = cur.activeColor;
      }
      const newSlots = [...p.slots];
      newSlots[p.active] = { ...cur, keyColors };
      return { ...p, slots: newSlots };
    });
  }, [setStore]);

  const toggleKeySelected = useCallback(
    (keyId, additive) => {
      setStore((prev) => {
        const p = typeof prev === 'function' ? prev() : prev;
        const cur = p.slots[p.active];
        let selectedKeys;
        if (additive) {
          selectedKeys = cur.selectedKeys.includes(keyId)
            ? cur.selectedKeys.filter((id) => id !== keyId)
            : [...cur.selectedKeys, keyId];
        } else {
          selectedKeys = [keyId];
        }
        const newSlots = [...p.slots];
        newSlots[p.active] = { ...cur, selectedKeys };
        return { ...p, slots: newSlots };
      });
    },
    [setStore],
  );

  const selectZone = useCallback(
    (zoneKey) => {
      const layoutKeys = layouts[state.layout] ?? [];
      const ids = layoutKeys.filter((k) => k.zone === zoneKey).map((k) => k.id);
      update({ selectedKeys: ids });
    },
    [state.layout, update],
  );

  const setCaseColor = useCallback(
    (caseColor) => update({ caseColor }),
    [update],
  );

  const setCaseFinish = useCallback(
    (caseFinish) => update({ caseFinish }),
    [update],
  );

  const setWorkspace = useCallback(
    (workspace) => update({ workspace }),
    [update],
  );

  const resetAll = useCallback(() => {
    update({ ...DEFAULT_STATE });
  }, [update]);

  // Slot management
  const saveSlot = useCallback(
    (index, name) => {
      setStore((prev) => {
        const p = typeof prev === 'function' ? prev() : prev;
        const newSlots = [...p.slots];
        if (index < MAX_SLOTS) {
          newSlots[index] = { ...p.slots[p.active], colorwayName: name };
        }
        return { ...p, slots: newSlots };
      });
    },
    [setStore],
  );

  const loadSlot = useCallback(
    (index) => {
      setStore((prev) => {
        const p = typeof prev === 'function' ? prev() : prev;
        if (index >= 0 && index < p.slots.length) {
          return { ...p, active: index };
        }
        return p;
      });
    },
    [setStore],
  );

  const createSlot = useCallback(() => {
    setStore((prev) => {
      const p = typeof prev === 'function' ? prev() : prev;
      if (p.slots.length >= MAX_SLOTS) return p;
      const newSlots = [...p.slots, { ...DEFAULT_STATE }];
      return { active: newSlots.length - 1, slots: newSlots };
    });
  }, [setStore]);

  const actions = useMemo(
    () => ({
      setLayout,
      setActiveColor,
      applyColorToSelected,
      toggleKeySelected,
      selectZone,
      setCaseColor,
      setCaseFinish,
      setWorkspace,
      resetAll,
      saveSlot,
      loadSlot,
      createSlot,
    }),
    [
      setLayout, setActiveColor, applyColorToSelected, toggleKeySelected,
      selectZone, setCaseColor, setCaseFinish, setWorkspace, resetAll,
      saveSlot, loadSlot, createSlot,
    ],
  );

  return { state, slots, activeSlot: active, actions };
}
