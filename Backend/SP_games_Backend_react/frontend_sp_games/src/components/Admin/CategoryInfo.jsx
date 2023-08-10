import React,{useMemo} from 'react'
import TableInfo from './TableInfo'
const CategoryInfo = () => {
    const columns = useMemo(
      () => [
        {
          accessorKey: 'catid',
          header: 'Category ID',
          size: 100,
          sortable: true,
        },
        {
          accessorKey: 'catname',
          header: 'Category Name',
          size: 200,
        },
        {
          accessorKey: 'cat_description',
          header: 'Description',
          size: 300,
        }
        // No "Edit/More Info" column in the array
      ],
      []
    );
    const searchcolumns = ['catname'];

  return (
    <div>
          <div>
      <TableInfo
        apiURL={'/category/paged'}
        col={columns}
        title={'Category Database'}
        Subtitle={'Edit View The Category Database'}
        PropertyID={'catid'}
        formName={'CategoryInfo'}
        searchcolumns={searchcolumns} // Pass the searchcolumns array here
        newRecord={true}
        deleteState={true}
        deleteAPI={'/categories'}
      />
    </div>
    </div>
  )
}

export default CategoryInfo