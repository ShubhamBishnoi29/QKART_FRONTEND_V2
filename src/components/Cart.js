/* eslint-disable */

import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  let cart_products = [];
  cart_products = productsData.filter(product_item => {
      let found = cartData.find(cart_item => {
          return cart_item.productId === product_item._id;
      });
      // console.log("====el========>", product_item);
      // console.log("====found========>", found);
      if(found){
          product_item.qty = found.qty;
          // console.log("====product_item qty addition========>", product_item);
          return product_item;
      }
  });
  // console.log("====RESPONSE========>", cart_products);
  return cart_products;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  const sum = items.map(element => (element.cost * element.qty))
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  
  // console.log("=======>", sum);

  return sum;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  const total = items.map(element => (element.qty))
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  return total;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  id,
  cartItemsFullList
}) => {

  let cartItems = JSON.parse(localStorage.getItem("cartProduct") || "[]");
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={() => { handleDelete(localStorage.getItem('token'), cartItems, cartItemsFullList, id, value-1, { preventDuplicate: true })}}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={() => { handleAdd(localStorage.getItem('token'), cartItems, cartItemsFullList, id, value+1, { preventDuplicate: true })}}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

const CheckoutCartView = ({value}) => {
  return (
    <Stack direction="row" alignItems="center">
      <Box padding="0.5rem" data-testid="item-qty">
        Qty: {value}
      </Box>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleQuantity
 *    Current quantity of product in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly
}) => {
  const history = useHistory();
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }
  // console.log("in Cart ==== item prop==========>", items);
  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {
          items.map((obj) => (  
            <Box display="flex" alignItems="flex-start" padding="1rem" key={obj._id}>
              <Box className="image-container">
                <img
                  // Add product image
                  src={obj.image}
                  // Add product name as alt eext
                  alt={obj.name}
                  width="100%"
                  height="100%"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
              >
                <div><p>{obj.name}</p></div>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {isReadOnly ?
                    <CheckoutCartView
                      value={obj.qty}
                    /> :
                    <ItemQuantity
                    // Add required props by checking implementation
                      value={obj.qty} 
                      handleDelete={handleQuantity}
                      handleAdd={handleQuantity}
                      id={obj._id}
                      cartItemsFullList={items}
                    />
                  }
                  <Box padding="0.5rem" fontWeight="700">
                      ${obj.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        }
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {!isReadOnly &&
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={()=> history.push("/checkout")}
            >
              Checkout
            </Button>
          </Box>
        }
      </Box>
      {isReadOnly &&
        <Box className="cart" padding="1.3rem 0rem 1rem 0rem">
          <Box padding="0.5rem 1rem 0.7rem 1rem" color="#3C3C3C" alignSelf="center" fontWeight="700" fontSize="1.3rem">
            Order Details
          </Box>
          <Box padding="0.5rem 1rem" display="flex" justifyContent="space-between" alignItems="center">
            <Box color="#3C3C3C" alignSelf="center">
              Products
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              {getTotalItems(items)}
            </Box>
          </Box>
          <Box padding="0.5rem 1rem" display="flex" justifyContent="space-between" alignItems="center">
            <Box color="#3C3C3C" alignSelf="center">
              Subtotal
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              ${getTotalCartValue(items)}
            </Box>
          </Box>
          <Box padding="0.5rem 1rem" display="flex" justifyContent="space-between" alignItems="center">
            <Box color="#3C3C3C" alignSelf="center">
              Shipping Charges
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              $0
            </Box>
          </Box>
          <Box padding="0.5rem 1rem" display="flex" justifyContent="space-between" alignItems="center">
            <Box color="#3C3C3C" alignSelf="center" fontWeight="700" fontSize="1.2rem">
              Total
            </Box>
            <Box color="#3C3C3C" alignSelf="center" fontWeight="700" fontSize="1.2rem">
              ${getTotalCartValue(items)}
            </Box>
          </Box>
        </Box>
      }
    </>
  );
};

export default Cart;
