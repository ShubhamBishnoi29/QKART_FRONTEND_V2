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
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value
    });
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    // prevents the register button from refreshing the page
    formData.preventDefault();
    setIsLoading(true);
    // Checking validation
    let isInputValid = validateInput(formValue);
    
    if (isInputValid) {
      const data = {
        username: formValue.username,
        password: formValue.password,
      };
      // POST request using axios with async/await
      try {
        const response = await axios.post(`${config.endpoint}/auth/register`, data);
        // console.log("------------>", response);

        if(response?.data?.success){
          enqueueSnackbar("Registered successfully",
            { variant: 'success' },
            {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
              }
            }
          );
          setFormValue({
            ...formValue,
            username: "",
            password: "",
            confirmPassword: "",
          });

          history.push("/login");
        }
      } catch (error) {
          // console.log("error.response------->", error.response)
          // console.log("error.status------->", error.status);
          // console.log("error.response.status------->", error.response.status);
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

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
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
      } else if (data[property].length <= 6) {
        error_message = property.charAt(0).toUpperCase() + property.slice(1) + " must be at least 6 characters";
        // console.log("--error_message----->", error_message);
        break;
      }
      if (property == "confirmPassword") {
        error_message = data[property] === data.password ? "" : "Passwords do not match";
        // console.log("-----error_message---------->",error_message);
      }
      // console.log(`${property}: ${data[property]}`);
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
      );
    }

    return validation;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={formValue.username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={formValue.password}
            onChange={handleChange}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formValue.confirmPassword}
            onChange={handleChange}
            fullWidth
          />
          {isLoading ?
            <Box className="circular-progress"><CircularProgress /></Box> :
            <Button className="button" variant="contained" onClick={register}>
              Register Now
            </Button>
          }
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">Login here</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
