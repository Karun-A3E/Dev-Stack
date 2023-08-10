import React from 'react';
import {
  List,
  ListItem,
  ListItemSuffix,
  Card,
  Typography,
  IconButton,
  Chip
} from "@material-tailwind/react";
import { BsCheckAll,BsClockFill,BsTrash2Fill,BsEnvelopePaper } from 'react-icons/bs'; 
const ListOrdersStatus = ({ data }) => {
  return (
    <Card className="w-full">
      <List>
        {data.map((order, index) => (
          <ListItem key={index} ripple={false} className="py-1 pr-1 pl-4">
            <div className="flex flex-row justify-between items-center w-full">
              <Typography variant="body">{`Order ID: ${order.orderID}`}</Typography>
              {order.OrderStats === "Processing" ? (
                <div className="flex items-center gap-2">
                     <Chip value={order.OrderStats} />
                     <BsClockFill className="h-5 w-5" />

                </div>
              ) : order.OrderStats === "Shipped" ? (
                <div className="flex items-center gap-2">
                  <Chip
                    color="red"
                    size="regular"
                    className="flex items-center gap-1 text-white"
                    value={order.OrderStats}
                  />
                    <BsEnvelopePaper className="h-5 w-5" />
                </div>
              ) : order.OrderStats === "Delivered" ? (
                <div className="flex items-center gap-2">
                  <Chip
                    color="green"
                    value={order.OrderStats}/>
                  <BsCheckAll className="h-5 w-5" />
                </div>
              ) : null}
            </div>
          </ListItem>
        ))}
      </List>
    </Card>

  );
};

export default ListOrdersStatus;
