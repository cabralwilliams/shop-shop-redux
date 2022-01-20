import React from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { idbPromise } from '../../utils/helpers';
//Import store from GlobalState
import { store } from "../../utils/GlobalState";
import { useProductReducer } from "../../utils/reducers";
import { useSelector, useDispatch } from "react-redux";

const CartItem = ({ item }) => {
    //const [, dispatch] = useStoreContext();
    //const [state, dispatch] = useProductReducer(store.getState());
    const state = useSelector(state => {
        return { cart: state.cart };
    });
    const dispatch = useDispatch();

    const removeFromCart = item => {
        dispatch({
            type: REMOVE_FROM_CART,
            _id: item._id
        });
        idbPromise('cart', 'delete', { ...item });
        console.log(state);
    };

    const onChange = e => {
        const value = e.target.value;

        if(value === '0') {
            dispatch({
                type: REMOVE_FROM_CART,
                _id: item._id
            });

            idbPromise('cart', 'delete', { ...item });
        } else {
            dispatch({
                type: UPDATE_CART_QUANTITY,
                _id: item._id,
                purchaseQuantity: parseInt(value)
            });

            idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
        }
    };

    return(
        <div className="flex-row">
            <div>
                <img src={`/images/${item.image}`} alt="" />
            </div>
            <div>
                <div>{item.name}, ${item.price}</div>
                <div><span>Qty:</span> <input type="number" placeholder="1" value={item.purchaseQuantity} onChange={onChange}/><span role="img" aria-label="trash" onClick={() => removeFromCart(item)}>🗑️</span></div>
            </div>
        </div>
    )
}

export default CartItem;