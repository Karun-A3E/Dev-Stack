  import React, { useEffect, useState, useMemo, Suspense } from "react";
  import axios from "../../configurations/axios";
  import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
  } from "@heroicons/react/24/outline";
  import {
    Typography,
    Card,
    CardHeader,
    Input,
    Button,
    CardBody,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    Tooltip,
    Select,
    Option,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";
  import UserConfirmBox from "../Forms/UserConfirmBox";
  import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
  import IconButton from "@mui/material/IconButton";
  import {HiPencil,HiTrash} from 'react-icons/hi2'
  const TableInfo = ({
    apiURL, //filtering and getting data
    col,
    title,
    Subtitle,
    formName,
    PropertyID,
    BtnState = true,
    profile_pic_state = false,
    profile_col,
    TagLine = "Edit/More Info",
    name_col,
    searchcolumns,
    newRecord = false,
    deleteState=false,
    deleteAPI

  }) => {
    const FormComponent = React.lazy(() => import(`../Forms/${formName}`));
    const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [maxPage, setMaxPages] = useState(1); // Total number of pages
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState(""); // State for search input
    const [newRec, setNewRec] = useState(false);
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [selectedGameIdToDelete, setSelectedGameIdToDelete] = useState(null);



    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };
    const fetchData = async () => {
      setIsLoading(true);
    
      const url = new URL(
        `${apiURL}`,
        process.env.NODE_ENV === "production"
          ? "https://www.material-react-table.com"
          : "http://localhost:8081/gamesFilters"
      );
    
      url.searchParams.set("page", `${currentPage}`);
      url.searchParams.set("pageSize", `${pageSize}`);
      url.searchParams.set("search", searchInput || ""); // Default to empty string if searchInput is null/undefined
      url.searchParams.set("columns", searchcolumns.join(","));
    
      try {
        const response = await axios.get(url);

        setData(response.data.results);
        setMaxPages(response.data.maxPages);
      } catch (error) {
        setIsError(true);
        console.error(error);
      }
      setIsLoading(false);
    };

    useEffect(() => {
      fetchData();
    }, [currentPage, searchInput]);
    console.log(data)
    const handleDelete = (gameid) => {
      // Show the confirmation box when the delete icon is clicked
      showConfirmationBox(gameid);
    };

    const handleConfirmDelete = () => {
      // Perform the actual delete action when the user confirms
      if (selectedGameIdToDelete) {
        // Call the delete API
        axios.delete(`${deleteAPI}/${selectedGameIdToDelete}`)
          .then(() => {
            // Hide the confirmation box
            hideConfirmationBox();
            // Refetch data after successful deletion
            fetchData();
          })
          .catch((error) => {
            console.error("Error deleting record:", error);
            // Hide the confirmation box even if there was an error
            hideConfirmationBox();
          });
      }
    };

    const handleEditGame = (gameid) => {
      setSelectedGameId(gameid);
      setIsEditingGame(true);
    };
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    };
    const avatarColors = [
      "#3b82f6",
      "#f43f5e",
      "#10b981",
      "#f59e0b",
      "#6366f1",
      // Add more colors as needed
    ];
    const handleSearchInputChange = (e) => {
      setSearchInput(e.target.value); // Update the search input state when the input changes
    };

    const handleAddNewRecord = () => {
      // Set isEditingGame to true to show the FormComponent for adding a new record
      setNewRec(true);
    };
    const showConfirmationBox = (gameid) => {
      setSelectedGameIdToDelete(gameid);
      setShowConfirmBox(true);
    };

    const hideConfirmationBox = () => {
      setShowConfirmBox(false);
    };

    const columns = useMemo(() => {
      // Create a copy of the columnsWithoutActions array
      const newColumns = [...col];
      if (profile_pic_state) {
        newColumns.unshift({
          accessorKey: "profilePic",
          header: "Profile Pic",
          size: 100,
          cellRenderer: (row) => {
            // Check if the profile_col exists in the row data
            const profilePicUrl = row[profile_col];

            // Extract the name from the data
            const name = row[name_col];
            const initials = name.substring(0, 2).toUpperCase();
            const randomColor =
              avatarColors[Math.floor(Math.random() * avatarColors.length)];

            return (
              <td key="profilePic" className="p-4" style={cellWrapperStyle}>
                {isValidUrl(profilePicUrl) ? (
                  <Avatar src={profilePicUrl} size="sm" />
                ) : (
                  <div
                    className="rounded-full w-8 h-8 text-white flex items-center justify-center"
                    style={{ backgroundColor: randomColor }}
                  >
                    {initials}
                  </div>
                )}
              </td>
            );
          },
        });
      }

      if (BtnState) {
        newColumns.push({
          accessorKey: "actions",
          header: TagLine,
          size: 100,
          // We'll use a custom cell renderer for this column
          cellRenderer: (row) => (
            // <Button color="blue" onClick={() => handleEditGame(row[PropertyID])}>
            //   Edit/More Info
            // </Button>
            <IconButton color="primary" onClick={() => handleEditGame(row[PropertyID])}>
              <HiPencil/>
            </IconButton>
          ),
        });
      }
      if (deleteState) {
        newColumns.push({
          accessorKey: "delete",
          header: "Delete",
          size: 100,
          cellRenderer: (row) => (
            <IconButton color="warning" onClick={() => handleDelete(row[PropertyID])}>
              <HiTrash />
            </IconButton>
          ),
        });
      }
      // Append the "Edit/More Info" column to the newColumns array

      return newColumns;
    }, [
      col,
      profile_pic_state,
      profile_col,
      name_col,
      handleEditGame,
      handleAddNewRecord,
      deleteState
    ]);

    const renderCellData = (row, accessorKey) => {
      const cellData = row[accessorKey];

      if (cellData === null) {
        return ""; // Return an empty string or any other appropriate value
      }

      const cellDataString = cellData.toString(); // Convert cell data to string
      const searchTerm = searchInput.trim(); // Trim the search input

      // Check if the search term is found in the cell data (case-insensitive)
      const startIndex = cellDataString
        .toLowerCase()
        .indexOf(searchTerm.toLowerCase());

      if (startIndex !== -1 && searchTerm !== "") {
        // Create a new React element with the search term encapsulated in a light blue rounded pill
        return (
          <span>
            {cellDataString.substring(0, startIndex)}
            <span
              style={{
                backgroundColor: "#f3f4f6",
                color: "#2563eb",
                borderRadius: "9999px",
                padding: "0.25rem 0.5rem",
                display: "inline-block",
              }}
            >
              {cellDataString.substring(
                startIndex,
                startIndex + searchTerm.length
              )}
            </span>
            {cellDataString.substring(startIndex + searchTerm.length)}
          </span>
        );
      }

      // If the search term is not found or is empty, return the original cell data as is
      return cellDataString;
    };

    const [selectedGameId, setSelectedGameId] = useState(null);
    const [isEditingGame, setIsEditingGame] = useState(false);

    // Add a CSS class for wrapping text in table cells
    const cellWrapperStyle = {
      wordWrap: "break-word",
      whiteSpace: "normal",
    };

    const handleFirstPage = () => {
      handlePageChange(1);
    };

    const handleLastPage = () => {
      handlePageChange(maxPage);
    };
    
    // const handleEditStatusChange = (row, value) => {
    //   // Assuming you have an API endpoint to update the status value for a specific order
    //   // Call the API to update the status for the specific order using row.orderID or any other unique identifier
    //   console.log(row,value)
    //   axios
    //     .patch(`/${editStatusColURL}`, {
    //       Id: row[PropertyID], // Use the provided property (OrderID) as the unique identifier
    //       status: value, // Use the provided value (status) to update the status
    //     })
    //     .then(() => {
    //       // Assuming the update was successful, update the data state to reflect the new status value
    //       setData((prevData) =>
    //         prevData.map((rowData) =>
    //           rowData.Id === row.Id ? { ...rowData, status: value } : rowData
    //         )
    //       );
    //     })
    //     .catch((error) => {
    //       console.error("Error updating status:", error);
    //     });
    // };
    

    return (
      <Card className="m-5 rounded-lg">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                {title}
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                {Subtitle}
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={searchInput} // Bind the search input state to the input value
                  onChange={handleSearchInputChange} // Handle input change
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          {isLoading ? ( // Check for loading state
            <div className="py-4 px-6 text-center text-gray-500">Loading...</div>
          ) : data == null  ||data.length === 0  ? ( // Check if data is null or empty
            <div className="py-4 px-6 text-center text-gray-500">
              No games found.
            </div>
          ) : (
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <colgroup>
                {columns.map((column) => (
                  <col key={column.accessorKey} style={{ width: column.size }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.accessorKey}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {column.header}
                        {column.sortable && (
                          <ChevronUpDownIcon
                            strokeWidth={2}
                            className={`h-4 w-4`}
                          />
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.gameid}>
                    {columns.map((column) => (
                      <td
                        key={column.accessorKey}
                        className="p-4"
                        style={cellWrapperStyle}
                      >
                        {column.cellRenderer
                          ? column.cellRenderer(row)
                          : renderCellData(row, column.accessorKey)}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Add a new row for the "Add Record" button */}
                <tr className="border-t-2 border-gray-200"></tr>
                {newRecord && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="p-5 flex justify-start"
                    >
                      <IconButton
                        color="primary"
                        aria-label="Add New Record"
                        onClick={handleAddNewRecord}
                      >
                        <AddCircleOutlineRoundedIcon />
                      </IconButton>
                    </td>
                  </tr>
                )}
                <tr className="border-t-2 border-gray-200"></tr>
              </tbody>
            </table>
          )}
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {maxPage}
          </Typography>
          <div className="flex gap-2">
            {currentPage > 1 ? (
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={handleFirstPage} // Add onClick handler for the "First Page" button
              >
                First Page
              </Button>
            ) : (
              <Button
                variant="filled"
                color="blue-gray"
                size="sm"
                onClick={handleFirstPage} // Add onClick handler for the "First Page" button
                disabled
              >
                First Page
              </Button>
            )}
            {currentPage < maxPage ? (
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={handleLastPage} // Add onClick handler for the "Last Page" button
              >
                Last Page
              </Button>
            ) : (
              <Button
                variant="filled"
                color="blue-gray"
                size="sm"
                onClick={handleLastPage} // Add onClick handler for the "Last Page" button
                disabled
              >
                Last Page
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
            )}
            {currentPage < maxPage && (
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </CardFooter>

        {/* Render the GameInfoForm as a dialog when editing a game */}
        {isEditingGame && (
          <Dialog open={isEditingGame} handler={() => setIsEditingGame(false)}>
            <Suspense fallback={<div>Loading...</div>}>
              <FormComponent
                gameid={selectedGameId}
                onClose={() => {
                  setIsEditingGame(false);
                  fetchData(); // Refetch data when the dialog is closed
                }}
                info={data}
              />
            </Suspense>
          </Dialog>
        )}
        {newRec && (
          <Dialog open={newRec} handler={() => setNewRec(false)}>
            <Suspense fallback={<div>Loading...</div>}>
              <FormComponent
                gameid={selectedGameId}
                onClose={() => {
                  setNewRec(false);
                }}
                editForm={false}
                addRecord={true}
              />
            </Suspense>
          </Dialog>
        )}
        {showConfirmBox && (
          <UserConfirmBox
            message="Are you sure you want to delete this record?"
            onConfirm={handleConfirmDelete}
            onCancel={hideConfirmationBox}
          />
        )}
      </Card>
    );
  };

  export default TableInfo;
