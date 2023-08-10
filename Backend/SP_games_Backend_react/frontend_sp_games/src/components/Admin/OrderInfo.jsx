import React, { useMemo } from 'react';
import TableInfo from './TableInfo';

const OrderInfo = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'orderID',
        header: 'Order ID',
        size: 100,
        sortable: true,
      },
      {
        accessorKey: 'username',
        header: 'Username',
        size: 200,
      },
      {
        accessorKey: 'total_price',
        header: 'Price',
        size: 100,
      },
      {
        accessorKey: 'product_info',
        header: 'Product Info',
        size: 300,
      },
      
      {
        accessorKey: 'OrderStats',
        header: 'Order Status',
        size: 300,
      }
    ],
    []
  );

  const searchcolumns = ['username'];

  return (
    <div>
      <div>
        <TableInfo
          apiURL={'/getOrderView/paged'}
          col={columns}
          title={'Order Database'}
          Subtitle={'Edit & View The Category Database'}
          PropertyID={'orderID'}
          formName={'OrderInfoEdit'}
          searchcolumns={searchcolumns} // Pass the searchcolumns array here
          BtnState={true}
        />
      </div>
    </div>
  );
};

export default OrderInfo;
