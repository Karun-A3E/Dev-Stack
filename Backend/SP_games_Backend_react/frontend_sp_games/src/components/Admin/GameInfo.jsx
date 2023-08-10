import React, { useMemo } from 'react';
import TableInfo from './TableInfo';

const GameInfo = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'gameid',
        header: 'Game ID',
        size: 100,
        sortable: true,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 200,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 300,
      },
      {
        accessorKey: 'categories',
        header: 'Categories',
        size: 300,
      },
      {
        accessorKey: 'platforms',
        header: 'Platforms',
        size: 300,
      }
      // No "Edit/More Info" column in the array
    ],
    []
  );

  const searchcolumns = ['platforms', 'title'];

  return (
    <div>
      <TableInfo
        apiURL={'/gamesFilters'}
        col={columns}
        title={'Game Database'}
        Subtitle={'Edit View The Game Database'}
        formName={'GameInfoForm'}
        PropertyID={'gameid'}
        searchcolumns={searchcolumns} // Pass the searchcolumns array here
        profile_pic_state={true}
        profile_col={'profile_pic_url'}
        name_col={'title'}
        newRecord={true}
        deleteState={true}
        deleteAPI={'/games'}
      />
    </div>
  );
};

export default GameInfo;
