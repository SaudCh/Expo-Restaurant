//import { itemList } from '../../data/item'
import { ADDTOCART } from '../action/item'
import { REMITEM } from '../action/item'
import { DELCART } from '../action/item'

const intialState = {
    cart: [],
}

const itemReducer = (state = intialState, action) => {
    switch (action.type) {
        case ADDTOCART:
            const existingIndex = state.cart.findIndex(meal => meal.id === action.itemid)
            if (existingIndex < 0) {
                const meal = {
                    id: action.itemid,
                    name: action.itemname,
                    price: action.itemprice,
                    quantity: action.quan
                }
                return { ...state, cart: state.cart.concat(meal) }
            } else {
                const updatedCart1 = [...state.cart];
                updatedCart1.splice(existingIndex, 1);
                const meal = {
                    id: action.itemid,
                    name: action.itemname,
                    price: action.itemprice,
                    quantity: action.quan
                }
                return { ...state, cart: updatedCart1.concat(meal) }

            }
        case REMITEM:
            const exIndex = state.cart.findIndex(meal => meal.id === action.itemid)
            const updatedCart = [...state.cart];
            updatedCart.splice(exIndex, 1);
            return { ...state, cart: updatedCart };
            break;
        case DELCART:
            return { ...state, cart: [] }
        default:
            return state;

    }
}

export default itemReducer;