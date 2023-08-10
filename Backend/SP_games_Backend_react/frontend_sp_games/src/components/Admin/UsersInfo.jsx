import React,{useMemo} from 'react'
import TableInfo from './TableInfo'
const UserInfo = () => {
    const columns = useMemo(
      () => [
        {
          accessorKey: 'userid',
          header: 'User ID',
          size: 100,
          sortable: true,
        },
        {
          accessorKey: 'username',
          header: 'Username',
          size: 200,
        },
        {
          accessorKey: 'type',
          header: 'Account Type',
          size: 150,
        },
        {
          accessorKey: 'email',
          header: 'Email',
          size: 300,
        }
        // No "Edit/More Info" column in the array
      ],
      []
    );
    const searchcolumns = ['username', 'email','type'];
  return (
    <div>
          <div>
      <TableInfo
        apiURL={'/user/paged'}
        col={columns}
        title={'Users Database'}
        Subtitle={'Edit View The Users Database'}
        PropertyID={'userid'}
        BtnState={false}
        profile_pic_state={true}
        profile_col={'profile_pic_url'}
        name_col={'username'}
        searchcolumns={searchcolumns} // Pass the searchcolumns array here
      />
    </div>
    </div>
  )
}

export default UserInfo;