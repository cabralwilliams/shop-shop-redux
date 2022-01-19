import React, { createContext, useContext } from "react";
import { useProductReducer } from "./reducers";

const StoreContext = createContext();
//Every Context object comes with components Provider and Consumer
const { Provider } = StoreContext;
//The Provider component makes state data available to all other components

const StoreProvider = ({ value = [], ...props }) => {
    const [state, dispatch] = useProductReducer({
        products: [],
        cart: [],
        cartOpen: false,
        categories: [],
        currentCategory: ''
    });
    //Confirm that the above worked
    console.log(state);
    return <Provider value={[state, dispatch]} {...props} />;
}

const useStoreContext = () => {
    return useContext(StoreContext);
}

export { StoreProvider, useStoreContext };