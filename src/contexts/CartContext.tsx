import { createContext, useContext, useReducer, ReactNode } from 'react';
import { workflows } from '../data/mockData';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: string }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const workflow = workflows.find(w => w.id === action.payload);
      if (!workflow || workflow.price === null) return state;
      
      const existingItem = state.items.find(item => item.id === action.payload);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + workflow.price
        };
      }
      
      return {
        ...state,
        items: [...state.items, { 
          id: workflow.id,
          title: workflow.title,
          price: workflow.price,
          quantity: 1
        }],
        total: state.total + workflow.price
      };
    }
    
    case 'REMOVE_ITEM': {
      const item = state.items.find(i => i.id === action.payload);
      if (!item) return state;
      
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - (item.price * item.quantity)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(i => i.id === action.payload.id);
      if (!item) return state;
      
      const quantityDiff = action.payload.quantity - item.quantity;
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff)
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      };
      
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};