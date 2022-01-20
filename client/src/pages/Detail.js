import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';
import { UPDATE_PRODUCTS, REMOVE_FROM_CART, UPDATE_CART_QUANTITY, ADD_TO_CART } from "../utils/actions";
import Cart from '../components/Cart';
import { idbPromise } from '../utils/helpers';
//Import useSelector and useDispatch from react-redux to create the state and dispatch variables
import { useSelector, useDispatch } from "react-redux";

function Detail() {
  //Create the state and dispatch functions - extract the state properties needed for Detail
  const state = useSelector(state => {
    return { products: state.products, cart: state.cart };
  });
  const dispatch = useDispatch();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products, cart } = state;

  const addToCart = () => {
    //find the cart item with the matching id
    const itemInCart = cart.find(cartItem => cartItem._id === id);

    //if there was a match, call UPDAA=TE with a new purchase quantity
    if(itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
      //place item in indexedDB cart as well
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      })
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 }
      });
      //if product not yet in cart
      idbPromise('cart','put', { ...currentProduct, purchaseQuantity: 1});
    }
  };

  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id
    });

    //remove from indexedDB cart as well
    idbPromise('cart', 'delete', { ...currentProduct });
  };
  useEffect(() => {
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    } else if(data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
    } else if(!loading) {
      //get cached data from idb
      idbPromise('products', 'get').then(indexedProducts => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts
        });
      });
    }
  }, [products, id, data, dispatch, loading]);

  console.log(state);
  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button disabled={!cart.find(p => p._id === currentProduct._id)} onClick={removeFromCart}>Remove from Cart</button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
