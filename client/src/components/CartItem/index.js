import React from "react";
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { idbPromise } from '../../utils/helpers';
//Import useSelector and useDispatch from react-redux to create the state and dispatch variables
import { useSelector, useDispatch } from "react-redux";

const CartItem = ({ item }) => {
    //Create the state and dispatch functions - extract the state just for loggin purposes
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