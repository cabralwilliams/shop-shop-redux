import React, { useEffect} from 'react';
import { useQuery } from '@apollo/client';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { useStoreContext } from '../../utils/GlobalState';
import { idbPromise } from '../../utils/helpers';
//Import store from GlobalState
import { store } from "../../utils/GlobalState";
import { useProductReducer } from "../../utils/reducers";
import { useSelector, useDispatch } from "react-redux";

function ProductList() {
  //const [state, dispatch] = useStoreContext();
  //const [state, dispatch] = useProductReducer(store.getState());
  const state = useSelector(state => {
    return { currentCategory: state.currentCategory, products: state.products };
  });
  const dispatch = useDispatch();
  const { currentCategory } = state;
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if(data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      //Store each product in IndexedDB
      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
    } else if(!loading) {
      //If the data is neither loading nor present - implying offline state
      idbPromise('products', 'get').then(products => {
        //Use retrieved data to set global state for offline browsing
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        });
      });
    }
  }, [data, loading, dispatch]);
  //const products = data?.products || [];

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
