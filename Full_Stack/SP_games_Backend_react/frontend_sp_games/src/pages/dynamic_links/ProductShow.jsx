import React from "react";
import { useParams } from "react-router-dom";

const ProductShow = () => { 
  const {productID} = useParams()
  return (
    <div>
      <h1>HEllo world {productID}</h1>
    </div>
  );
};

export default ProductShow;
