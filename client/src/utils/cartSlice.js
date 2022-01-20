//Import createSlice from redux toolkit
import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: 'shoppingCart',
    initialState: {
        cart: [],
        cartOpen: false,
        products: [],
        categories: [],
        currentCategory: ''
    },
    reducers: {
        TOGGLE_CART: state => {
            //switch the boolean value of the cartOpen property
            state.cartOpen = !state.cartOpen;
        },
        CLEAR_CART: state => {
            //empty and close the cart
            state.cartOpen = false;
            state.cart = [];
        },
        ADD_TO_CART: (state, action) => {
            //automatically open cart upon adding an item
            state.cartOpen = true;
            state.cart = [...state.cart, action.payload.product]
        },
        ADD_MULTIPLE_TO_CART: (state, action) => {
            state.cart = [...state.cart, ...action.payload.products]
        },
        REMOVE_FROM_CART: (state, action) => {
            //remove item from current cart and set adjusted cart to newCart variable
            let newCart = state.cart.filter(item => item._id !== action.payload._id);
            //close cart if no items remain
            state.cartOpen = newCart.length > 0;
            //set cart to newCart
            state.cart = newCart;
        },
        UPDATE_CART_QUANTITY: (state, action) => {
            //open the cart anytime an item is added
            state.cartOpen = true;
            //create a new cart state with quantity based on the updated values
            let newCart = state.cart.map(item => {
                if(action.payload._id === item._id) {
                    item.purchaseQuantity = action.payload.purchaseQuantity;
                }
                return item;
            });
            //set state.cart equal to newCart
            state.cart = newCart;
        },
        UPDATE_PRODUCTS: (state, action) => {
            //update state.products to action.payload.products
            state.products = [...action.payload.products];
        },
        UPDATE_CATEGORIES: (state, action) => {
            //update state.categories to action.payload.categories
            state.categories = [...action.payload.categories];
        },
        UPDATE_CURRENT_CATEGORY: (state, action) => {
            //change the current category
            state.currentCategory = action.payload.currentCategory;
        }
    }
});