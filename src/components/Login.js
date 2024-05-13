/* eslint-disable */

import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name] : event.target.value
    })
  }
  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    // prevents the login button from refreshing the page
    formData.preventDefault();
    setIsLoading(true);
    // Checking validation
    let isInputValid = validateInput(formValue);

    if (isInputValid) {
      try{
        const response = await axios.post(`${config.endpoint}/auth/login`, formValue);
        // console.log("--response.data.token---------->", response.data.token);
        // console.log("--response.data.username---------->", response.data.username);
        // console.log("--response.data.balance---------->", response.data.balance);

        if (response?.data?.success) {
          enqueueSnackbar("Logged in successfully",
            { variant: 'success' },
            {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
              }
            }
          );

          // persistLogin = (token, username, balance)
          persistLogin(response?.data?.token, response?.data?.username, response?.data?.balance);

          setFormValue({
            ...formValue,
            username: "",
            password: "",
          });
          history.push("/");
        }  
      } catch (error) {      
        let message = error.response != undefined ? error.response?.data?.message : "Something went wrong. Check that the backend is running, reachable and returns valid JSON.";
        enqueueSnackbar(message,
          { variant: 'error' },
          {
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center'
            }
          }
        );
      }
    }
    setIsLoading(false);
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    let validation = false;
    let error_message = "";
    // console.log("--data----->", data);
    for (const property in data) {
      if (data[property].length == 0) {
        error_message = property.charAt(0).toUpperCase() + property.slice(1) + " is a required field";
        // console.log("--error_message----->", error_message);
        break;
      } 
    }

    if (error_message.length == 0) {
      validation = !validation;
    } else {
      enqueueSnackbar(error_message,
        { variant: 'warning' },
        {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          }
        }
      )
    }

    return validation;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    // Put the API response into local storage
    localStorage.setItem('username', username);
    localStorage.setItem('balance', balance);
    localStorage.setItem('token', token);

    // Retrieve the object from storage
    // var retrievedObject = localStorage.getItem('testObject');
    // console.log('retrievedObject: ', JSON.parse(retrievedObject));  
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            fullWidth
            placeholder="Enter Username"
            value={formValue.username}
            onChange={handleChange}
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            autoComplete="current-password"
            fullWidth
            placeholder="Enter Password"
            value={formValue.password}
            onChange={handleChange}
          />
          {isLoading ?
            <Box className="circular-progress"><CircularProgress /></Box> :
            <Button className="button" variant="contained" onClick={login}>
              LOGIN TO QKART
            </Button>
          }          
           <p className="secondary-action">
            Don’t have an account?{" "}
            <Link className="link" to="/register">Register now</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
