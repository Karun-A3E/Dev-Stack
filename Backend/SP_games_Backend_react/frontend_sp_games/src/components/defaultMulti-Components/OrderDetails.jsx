import React, { useEffect, useState } from 'react';
import { Card, Typography } from "@material-tailwind/react";
import axios from '../../configurations/axios';

import ListOrdersStatus from '../Cards/ListOrdersStatus';
import UserSettings from './UserSettings'

const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch user data from the API
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/getOrderDetails"
        );
        console.log(response)
        setOrderDetails(response.data); // Assuming the API response contains an array of order details
        setLoading(false); // Data fetching is done, set loading state to false
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false); // Set loading state to false even in case of an error
      }
    };

    fetchOrders();
  }, []);
  console.log(orderDetails)
  if (loading) {
    // Show a loading message while data is being fetched
    return <Typography color="blue-gray">Loading order details...</Typography>;
  }

  if (!orderDetails || orderDetails.length === 0) {
    // Show a message if there are no order details available
    return <Typography color="blue-gray">No order details available.</Typography>;
  }

  // Get column names from the first row of data
  const columnNames = Object.keys(orderDetails[0]);
  const excludedColumns = ["userID", "username", "orderID"];
  const filteredColumnNames = columnNames.filter((columnName) => !excludedColumns.includes(columnName));

  // Get the recent orders (assuming they are the first 4 entries in the orderDetails array)
  const recentOrders = orderDetails.slice(0, 4);
  return (
    <div className="flex space-x-4">
      <div className="w-2/3">
      <UserSettings /> 
      </div>
      <div className="w-1/3">
        <ListOrdersStatus data={recentOrders} />
      </div>
    </div>
  );
};

export default OrderDetails