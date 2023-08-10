import React,{useMemo} from 'react'
import TableInfo from './TableInfo'
const PlatformInfo = () => {
    const columns = useMemo(
      () => [
        {
          accessorKey: 'platformid',
          header: 'Platform ID',
          size: 100,
          sortable: true,
        },
        {
          accessorKey: 'platform_name',
          header: 'Platform Name',
          size: 200,
        },
        {
          accessorKey: 'platform_description',
          header: 'Description',
          size: 300,
        }
      ],
      []
    );
    const searchcolumns = ['platform_name'];
  return (
    <div>
          <div>
      <TableInfo
        apiURL={'/platform/paged'}
        col={columns}
        title={'Platform Database'}
        Subtitle={'Edit View The Platform Database'}
        formName={'PlatformEdit'}
        PropertyID={'platformid'}
        searchcolumns={searchcolumns} // Pass the searchcolumns array here
        newRecord={true}
        deleteState={true}
        deleteAPI={'/platforms'}
      />
    </div>
    </div>
  )
}

export default PlatformInfo