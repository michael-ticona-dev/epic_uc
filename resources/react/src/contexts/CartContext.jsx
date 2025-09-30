import { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils/storage';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  coupon: null
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, ...action.payload };
    
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.gameId === action.payload.gameId);
      
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.gameId === action.payload.gameId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      
      return { ...state, items: newItems };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.gameId !== action.payload)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.gameId === action.payload.gameId
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case 'APPLY_COUPON':
      return {
        ...state,
        coupon: action.payload
      };
    
    case 'REMOVE_COUPON':
      return {
        ...state,
        coupon: null
      };
    
    case 'CLEAR_CART':
      return {
        ...initialState
      };
    
    case 'UPDATE_TOTALS':
      return {
        ...state,
        ...action.payload
      };
    
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Cargar carrito desde localStorage
  useEffect(() => {
    if (user) {
      const savedCart = storage.get(`cart_${user.id}`);
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: savedCart });
      }
    }
  }, [user]);

  // Calcular totales cuando cambian los items o cupón
  useEffect(() => {
    const subtotal = state.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    let discount = 0;
    if (state.coupon) {
      discount = subtotal * state.coupon.discount;
    }

    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.21; // 21% IVA
    const total = discountedSubtotal + tax;

    dispatch({
      type: 'UPDATE_TOTALS',
      payload: { subtotal, tax, discount, total }
    });
  }, [state.items, state.coupon]);

  // Guardar carrito en localStorage
  useEffect(() => {
    if (user) {
      storage.set(`cart_${user.id}`, state);
    }
  }, [state, user]);

  const addToCart = (game, quantity = 1) => {
    const finalPrice = game.price * (1 - game.discount);
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        gameId: game.id,
        title: game.title,
        cover: game.cover,
        price: finalPrice,
        originalPrice: game.price,
        discount: game.discount,
        quantity
      }
    });
  };

  const removeFromCart = (gameId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: gameId });
  };

  const updateQuantity = (gameId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { gameId, quantity }
    });
  };

  const applyCoupon = (code) => {
    // Cupones disponibles
    const coupons = {
      'EPIC10': { code: 'EPIC10', discount: 0.10, description: '10% de descuento' }
    };

    const coupon = coupons[code.toUpperCase()];
    if (coupon) {
      dispatch({ type: 'APPLY_COUPON', payload: coupon });
      return { success: true, message: 'Cupón aplicado correctamente' };
    } else {
      return { success: false, message: 'Cupón no válido' };
    }
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (gameId) => {
    return state.items.some(item => item.gameId === gameId);
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
    getItemCount,
    isInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}