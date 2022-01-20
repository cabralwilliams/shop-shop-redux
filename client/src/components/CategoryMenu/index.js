import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { useStoreContext } from "../../utils/GlobalState";
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
//Import store from GlobalState
import { store } from "../../utils/GlobalState";
import { useProductReducer } from "../../utils/reducers";
import { useSelector, useDispatch } from "react-redux";

function CategoryMenu() {
  //The below two lines of code use the useQuery hook to populate the data
  // const { data: categoryData } = useQuery(QUERY_CATEGORIES);
  //This updated version uses GlobalState to populate the data
  // const [state, dispatch] = useStoreContext();
  //const [state, dispatch] = useProductReducer(store.getState());
  const state = useSelector(state => {
    return { categories: state.categories, currentCategory: state.currentCategory };
  });
  const dispatch = useDispatch();
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
  const categories = categoryData?.categories || [];

  useEffect(() => {
    //If categoryData exists or has changed from the response of useQuery, then run dispatch()
    if(categoryData) {
      //execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });

      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if(!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
