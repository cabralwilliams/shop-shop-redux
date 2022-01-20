//Import the reducer function created in reducers.js and createStore from redux
import { reducer } from "./reducers";
import { createStore } from 'redux';

//Create the redux store with the initial state and reducer created in reducers.js!
const store = createStore(reducer,{ products: [], cart: [], cartOpen: false, categories: [], currentCategory: ''});

//Export the store just created for passage to the Provider element of App.js
export { store };