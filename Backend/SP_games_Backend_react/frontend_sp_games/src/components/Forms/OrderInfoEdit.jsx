import React, { useState, useEffect } from "react";
import axios from "../../configurations/axios";
import { Card, Button, Typography } from "@material-tailwind/react";
import { Alert,Input} from "@material-tailwind/react";
import { FiThumbsUp } from "react-icons/fi";

const OrderInfoEdit = ({ gameid, onClose, info }) => {
  const [gameInfo, setGameInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");

  useEffect(() => {
    const fetchGameInfo = async () => {
      setIsLoading(true);
      try {
        const response = info.find((game) => game.orderID === gameid);
        setGameInfo(response);
        setSelectedOrderStatus(response?.OrderStats || "");
      } catch (error) {
        console.error(error);
        setGameInfo(null); // Set gameInfo to null if there's an error or no data
      }
      setIsLoading(false);
    };
    fetchGameInfo();
  }, [gameid]);

  const updateStatus = async (status) => {
    try {
      await axios.patch("/updateStatus", { Id: gameid, status });
      setIsUpdateSuccess(true);
      setTimeout(() => {
        setIsUpdateSuccess(false);
      }, 3000);
      // Show a success message or perform other actions after successful status update
    } catch (error) {
      console.error("Error updating status:", error);
      setIsUpdateError("Update status failed. Please try again later.");
      setTimeout(() => {
        setIsUpdateError(false);
      }, 3000);
      // Handle the error appropriately
    }
  };

  if (isLoading) {
    return <Typography>Loading game information...</Typography>;
  }

  if (!gameInfo) {
    return <Typography>No game information found for the given ID.</Typography>;
  }

  const { orderID, username, product_info, OrderStats } = gameInfo ?? {};
  const gameInfoArray = product_info.split(",").map((item) => item.trim());

  return (
    <Card
      color="transparent"
      shadow={false}
      className="h-full w-full overflow-scroll p-6 space-y-6"
    >
      {/* Game Information */}
      <div>
        <Typography variant="h4" color="blue-gray">
          Order Information
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enter the Order details.
        </Typography>
        <hr className="my-4 border-t-2 border-gray-300" />
        <div className="flex my-2">
          <Typography style={{ flexBasis: "180px" }}>Game ID : </Typography>
          <Typography>{orderID}</Typography>
        </div>

        <div className="flex my-2">
          <Typography style={{ flexBasis: "180px" }}>
            Customer Name :{" "}
          </Typography>
          <Typography>{username || ""}</Typography>
        </div>
        <div className="flex my-2 items-center">
          <Typography style={{ flexBasis: "180px" }}>
            Game Description:
          </Typography>
          <table>
            <thead>
              <tr>
                <th>Game Title</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {gameInfoArray.map((gameInfo, index) => {
                const [title, price] = gameInfo.split("-@-");
                return (
                  <tr key={index} className="py-3 ">
                    <td>
                      <Input
                        size="sm"
                        className="mr-2"
                        label="Game Title"
                        value={title}
                        disabled
                      />
                    </td>
                    <td>
                      <Input
                        size="sm"
                        className="mr-3"
                        label="Price"
                        value={price}
                        disabled
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex my-2">
          <Typography style={{ flexBasis: "180px" }}>Order Status : </Typography>
          <div>
            <label>
              <input
                type="radio"
                name="orderStatus"
                value="Processing"
                checked={selectedOrderStatus === "Processing"}
                onChange={(e) => setSelectedOrderStatus(e.target.value)}
              />
              Processing
            </label>
            <label className="ml-3">
              <input
                type="radio"
                name="orderStatus"
                value="Shipped"
                checked={selectedOrderStatus === "Shipped"}
                onChange={(e) => setSelectedOrderStatus(e.target.value)}
              />
              Shipped
            </label>
            <label className="ml-3">
              <input
                type="radio"
                name="orderStatus"
                value="Delivered"
                checked={selectedOrderStatus === "Delivered"}
                onChange={(e) => setSelectedOrderStatus(e.target.value)}
              />
              Delivered
            </label>
          </div>
        </div>
      </div>
      {/* Save and Update Button */}
      <div className="flex flex-row gap-3">
        <Button className="" onClick={() => updateStatus(selectedOrderStatus)}>
          Update Status
        </Button>
        <Button className="" onClick={onClose}>
          Close
        </Button>
      </div>
      {isUpdateSuccess && (
        <Alert color="green" outlined>
          <div className="flex items-center">
            <FiThumbsUp className="mr-2" />
            "Updated successfully"
          </div>
        </Alert>
      )}
      {isUpdateError && (
        <Alert color="red" outlined>
          {isUpdateError}
        </Alert>
      )}
    </Card>
  );
};

export default OrderInfoEdit;
