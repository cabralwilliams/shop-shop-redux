import React, { createContext, useContext } from "react";
import { useProductReducer, reducer } from "./reducers";
import { createStore } from 'redux';
const StoreContext = createContext();
//Every Context object comes with components Provider and Consumer
//const { Provider } = StoreContext;
//The Provider component makes state data available to all other components

//Import createStore from redux


//Create the redux store with the initial state and reducer created in reducers.js!
const store = createStore(reducer,{ products: [], cart: [], cartOpen: false, categories: [], currentCategory: ''});

// const StoreProvider = ({ value = [], ...props }) => {
//     const [state, dispatch] = useProductReducer({
//         products: [],
//         cart: [],
//         cartOpen: false,
//         categories: [],
//         currentCategory: ''
//     });
//     //Confirm that the above worked
//     console.log(state);
//     return <Provider value={[state, dispatch]} {...props} />;
// }

// const useStoreContext = () => {
//     return useContext(StoreContext);
// }

// export { StoreProvider, useStoreContext };
export { store };