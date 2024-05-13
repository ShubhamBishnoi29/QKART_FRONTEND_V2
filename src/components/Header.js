/* eslint-disable */

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { display } from "@mui/system";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {

  const history = useHistory();
    
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        {hasHiddenAuthButtons ? 
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => history.push("/")}
            // onClick={() => history.goBack()}
          >
            Back to explore
          </Button> :
          (localStorage.getItem('token') !== null ?
            <Stack direction="row" spacing={2}>
              <Box className="user-icon">
                <Avatar alt={localStorage.getItem('username')} src="avatar.png" sx={{ width: 35, height: 35, paddingTop: "2px" }} />
                {/* <Avatar src="../../public/avatar.png" alt={localStorage.getItem('username')}/> */}
                <p style={{ paddingLeft: "7px", paddingTop: "15px" }}>{localStorage.getItem('username')}</p>
              </Box>
              <Button variant="text" style={{ paddingTop: "10px" }} onClick={() => {
                localStorage.clear(); // clear all the local storage
                history.push("/");
                window.location.reload(); //forced reload
              }}>LOGOUT</Button>
            </Stack> :
            <Stack direction="row" spacing={2}>
              <Button variant="text" onClick={() => history.push("/login")}>LOGIN</Button>
              <Button variant="contained" onClick={() => history.push("/register")}>REGISTER</Button>
            </Stack>    
          )  
         }
        
      </Box>
    );
};

export default Header;
