import { createContext, useContext, useState, useReducer } from 'react';

const UIContext = createContext();

const initialState = {
  toasts: [],
  modals: {},
  loading: {},
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

function uiReducer(state, action) {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { id: Date.now(), ...action.payload }]
      };
    
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    
    case 'OPEN_MODAL':
      return {
        ...state,
        modals: { ...state.modals, [action.payload.id]: action.payload }
      };
    
    case 'CLOSE_MODAL':
      const { [action.payload]: removed, ...remainingModals } = state.modals;
      return {
        ...state,
        modals: remainingModals
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value }
      };
    
    default:
      return state;
  }
}

export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const showToast = (message, type = 'info', duration = 5000) => {
    const toast = { message, type, duration };
    dispatch({ type: 'ADD_TOAST', payload: toast });
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(toast.id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const openModal = (id, component, props = {}) => {
    dispatch({ type: 'OPEN_MODAL', payload: { id, component, props } });
  };

  const closeModal = (id) => {
    dispatch({ type: 'CLOSE_MODAL', payload: id });
  };

  const setLoading = (key, value) => {
    dispatch({ type: 'SET_LOADING', payload: { key, value } });
  };

  const value = {
    ...state,
    showToast,
    removeToast,
    openModal,
    closeModal,
    setLoading
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}