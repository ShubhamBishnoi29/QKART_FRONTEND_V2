/* eslint-disable */

import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom, getTotalCartValue } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
  */
  
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimeoutState, setDebounceTimeoutState] = useState(0);
  const [cartData, setCartData] = useState([]);
  const [cartProduct, setCartProduct] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  
  const performAPICall = async () => {
    setIsLoading(true);
    try {
      let url = `${config.endpoint}/products`;
      // GET request using axios with async/await
      const response = await axios.get(url);
      setData(response.data);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //immediately-invoked function expression 
    (async () => {
      const productDataList = await performAPICall();
      // console.log("=====productDataList useEffect==========>", productDataList);
    })();
    
    if (localStorage.getItem('token') !== null) {
      const userToken = localStorage.getItem('token');
      console.log("=====token==========>", userToken);
      //immediately-invoked function expression 
      (async () => {
        const cartDataList = await fetchCart(userToken);
        // console.log("=====promise cart Data List==========>", cartDataList);
      })();
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      const cartProductList = generateCartItemsFrom(cartData, data);
      setCartProduct(cartProductList)
      // console.log("=====cart Product List==========>", cartProductList);

      const cartProductCost = getTotalCartValue(cartProduct);
      setTotalCost(cartProductCost)
      // console.log("=====cart Product Cost==========>", cartProductCost);

      //set cart item in the local storage
      localStorage.setItem("cartProduct", JSON.stringify(cartData));
    }
  }, [cartData]);
  
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setIsLoading(true);
    let filteredData;
    try {
      let url = `${config.endpoint}/products/search?value=${text}`;
      // GET request using axios with async/await
      let response = await axios.get(url);
      filteredData = response.data;
      setData(filteredData);
      setIsLoading(false);
    } catch (error) {
      setData([]);
      // console.error(error);
      setIsLoading(false);
    }
    // return filteredData;
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    setSearchKey(event.target.value)
    if (debounceTimeoutState !== 0) {
      clearTimeout(debounceTimeoutState);
    }
    const newTimeout = setTimeout(() => {
      performSearch(event.target.value)
    }, debounceTimeout);
    setDebounceTimeoutState(newTimeout);
  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setCartData(res.data); 
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return items.some(element => element.productId === productId);
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    // console.log("--token-->", token);
    // console.log("--items in CART with id and qty-->", items);
    console.log("--products in CART with compete data-->", products);
    // console.log("--productId on click button-->", productId);
    // console.log("--qty on click (ADD TO CART)-->", qty);
    // console.log("--options-->", options);

    if (!token) { //if user token is not present
      enqueueSnackbar(
        "Login to add an item to the Cart.",
        {
          variant: "warning",
        }
      );
    } else {
      let isPresent = isItemInCart(items, productId); // check item is present in the cart or not
      if (isPresent) {
        if (options.preventDuplicate) {
          try {
            let token = localStorage.getItem('token');
            let res = await axios.post(`${config.endpoint}/cart`, {
              "productId": productId,
              "qty": qty
            }, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            setCartData(res.data);
            // console.log("--POST cart in (+++ ----)   ------>", res);
            // console.log("--POST cart in addToCart (+++ ----)  data------>", res.data);
          } catch (error) {
            console.error(error);
          }
        } else {
            enqueueSnackbar(
            "Item already in cart. Use the cart sidebar to update quantity or remove item.",
            {
              variant: "warning",
            }
          );
        }
      } else {
        try {
          let token = localStorage.getItem('token');
          let res = await axios.post(`${config.endpoint}/cart`, {
            "productId": productId,
            "qty": qty
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          setCartData(res.data);
          // console.log("--POST cart in addToCart------>", res);
          // console.log("--POST cart in addToCart data------>", res.data);
        } catch (error) {
          console.error(error);
        }
      }
    }
    
  };


  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <Box className="search">
          <TextField
            className="search-desktop"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            value={searchKey}
            onChange={(event) => debounceSearch(event, 500)}
            />
          </Box>
      </Header>
      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchKey}
        onChange={(event) => debounceSearch(event, 500)}
      />
      <Grid container>
        <Grid item xs={12} sm={localStorage.getItem('token') !== null ? 6 : 12} md={localStorage.getItem('token') !== null ? 8 : 12} lg={localStorage.getItem('token') !== null ? 9 : 12}>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                  to your door step
                </p>
              </Box>
            </Grid>   
             
            <Grid container spacing={2} sx={{ padding: "30px 15px" }}>
              {isLoading ? (
                <Box className="loading">
                  <CircularProgress />
                  <p>Loading Products...</p>
                </Box>) : 
                (data.length != 0 ?
                  (data.map((object) => (
                    <ProductCard
                      product={object}
                      handleAddToCart={addToCart}
                      items={cartData}
                      cartProducts={cartProduct}
                      key={object._id}
                    />))
                  ) :
                  (<Box className="loading">
                    <SentimentDissatisfied />
                    <p>No products found</p>
                  </Box>)
                )
              }
            </Grid>
          </Grid>
        </Grid>
        {localStorage.getItem('token') !== null ?
          <Grid item xs={12} sm={6} md={4} lg={3} style={{ backgroundColor: "#E9F5E1" }}>
            <Cart items={cartProduct} handleQuantity={addToCart}/>
          </Grid> : 
          <></>
        }
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
