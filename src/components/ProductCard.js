import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Typography,
  Box
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart, items, cartProducts }) => {
  // console.log("ProductCard Object===========>", product);
 
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card className="card">
        <CardMedia
          component="img"
          alt={product.name}
          height="240px"
          image={product.image}
        />
        <CardContent>
          <Typography gutterBottom variant="p" component="div">
            {product.name}
          </Typography>
          <Typography variant="p" style={{ fontWeight: 600 }}>
            ${product.cost}
          </Typography>
          <Box style={{ paddingTop: "6px"}}>
            <Rating name="read-only" value={product.rating} readOnly />
          </Box>
        </CardContent>
        <CardActions className="card-actions">
          <Button
            className="card-button"
            variant="contained"
            startIcon={<AddShoppingCartOutlined />}
            fullWidth
            onClick={() => handleAddToCart(localStorage.getItem('token'), items, cartProducts, product._id, 1, { preventDuplicate: false })}
          >
            ADD TO CART
          </Button>
        </CardActions>
      </Card>
    </Grid>  
  );
};

export default ProductCard;
