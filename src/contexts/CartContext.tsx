import { createContext, useContext, useReducer, ReactNode } from 'react';
import { workflows } from '../data/mockData';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  priceId?: string;
  type?: 'workflow' | 'product';
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem | string }
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
      // Handle both string ID (for backward compatibility) and CartItem object
      if (typeof action.payload === 'string') {
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
            quantity: 1,
            type: 'workflow',
            image: workflow.image,
            priceId: workflow.stripeProductId
          }],
          total: state.total + workflow.price
        };
      } else {
        // Handle CartItem object
        const item = action.payload;
        const existingItem = state.items.find(i => i.id === item.id);
        
        if (existingItem) {
          return {
            ...state,
            items: state.items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
            total: state.total + item.price
          };
        }
        
        return {
          ...state,
          items: [...state.items, { ...item, quantity: item.quantity || 1 }],
          total: state.total + (item.price * (item.quantity || 1))
        };
      }
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
      
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => i.id !== action.payload.id),
          total: state.total - (item.price * item.quantity)
        };
      }
      
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