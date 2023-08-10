  import React, { useState, useEffect } from "react";
  import axios from '../configurations/axios'
  import MessageCard from "../components/Cards/MessageCards";
  import {
    Button,
    Card,
    CardHeader,
    CardBody,
    IconButton,
    CardFooter,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";
  import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
  } from "@material-tailwind/react";

  const Search = () => {
    const [userProfiles, setUserProfiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
      fetchFilteredGameProfiles([...selectedFilters], event.target.value, ['platforms', 'title'], currentPage);
    };
    let LOAD_MORE_PAGE_SIZE = 20;
    let pageSize = 10;
    if (window.matchMedia("(min-width: 1280px)").matches) {
      // xl: 20 per page
      pageSize = 20;
    } else if (window.matchMedia("(min-width: 768px)").matches) {
      // md: 12 per page
      pageSize = 12;
    } else if (window.matchMedia("(min-width: 640px)").matches) {
      // sm: 8 per page
      pageSize = 8;
    }

    // Function to handle pagination
    const handlePagination = (page) => {
      setCurrentPage(page);
      fetchFilteredGameProfiles(selectedFilters, page); // Update filtered profiles for the new page
    };
    
    // Function to generate an array of page numbers for display
    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxDisplayedPageNumbers = 5; // Show only the first 3 and last 2 page numbers
      let startPage = 1;
      let endPage = maxPages;

      if (maxPages > maxDisplayedPageNumbers) {
        if (currentPage <= maxDisplayedPageNumbers - 1) {
          endPage = maxDisplayedPageNumbers;
        } else if (currentPage >= maxPages - (maxDisplayedPageNumbers - 2)) {
          startPage = maxPages - (maxDisplayedPageNumbers - 1);
        } else {
          startPage = currentPage - 2;
          endPage = currentPage + 2;
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      return pageNumbers;
    };
    const [activeTab, setActiveTab] = useState("");
    const [open, setOpen] = useState(false);
    const [tabItemCounts, setTabItemCounts] = useState({});
    const [tabTotalCounts, setTabTotalCounts] = useState({});
    const [tabPages, setTabPages] = useState({});
    const [filterOptions, setFilterOptions] = useState({});
    const handleOpen = () => setOpen(!open);

    useEffect(() => {
      // Fetch filter options for used_platform and used_category
      const fetchFilterOptions = async () => {
        try {
          const response = await axios.get("http://localhost:8081/getFilters", {
            params: {
              filters: "used_platform,used_category",
            },
          });

          const filterOptionsData = response.data;

          // Initialize item counts and total counts for each tab
          const itemCounts = {};
          const totalCounts = {};

          Object.keys(filterOptionsData).forEach((key, index) => {
            itemCounts[index] = LOAD_MORE_PAGE_SIZE; // Set the initial item count to pageSize
            totalCounts[index] = filterOptionsData[key].length; // Store the total count for each tab
          });

          setFilterOptions(filterOptionsData);
          setTabItemCounts(itemCounts);
          setTabTotalCounts(totalCounts); // Update the tabTotalCounts state with the correct total counts
        } catch (error) {
          console.error("Error fetching filter options:", error);
        }
      };

      fetchFilterOptions();
    }, []); // Empty dependency array to ensure the effect runs only once on initial component mount

    useEffect(() => {
      // Fetch initial filter options for used_platform and used_category
      fetchFilterOptions(LOAD_MORE_PAGE_SIZE);
    }, [LOAD_MORE_PAGE_SIZE]);

    

    useEffect(() => {
      if (!filterOptions) return; // Return early if filterOptions is not available yet

      // Initialize item counts for each tab with the default page size
      const initialTabItemCounts = {};
      Object.keys(filterOptions).forEach((key, index) => {
        initialTabItemCounts[index] = LOAD_MORE_PAGE_SIZE; // Start with the default page size
      });

      // Update the tabItemCounts state
      setTabItemCounts(initialTabItemCounts);
    }, [filterOptions]);
    console.log(filterOptions);
    const fetchMoreFilterOptions = async (index, PageSize, page) => {
      try {
        const response = await axios.get("http://localhost:8081/getFilters", {
          params: {
            filters: filterOptions[index].tableName,
            pageSize: PageSize,
            page: page,
          },
        });
        return response;
      } catch (error) {
        throw error;
      }
    };

    const fetchFilterOptions = async (pageSize) => {
      try {
        const response = await axios.get("http://localhost:8081/getFilters", {
          params: {
            filters: "used_platform,used_category",
            pageSize: pageSize,
          },
        });

        const filterOptionsData = response.data;

        // Initialize item counts and total counts for each tab
        const itemCounts = {};
        const totalCounts = {};

        Object.keys(filterOptionsData).forEach((key, index) => {
          itemCounts[index] = pageSize; // Set the initial item count to pageSize
          totalCounts[index] = filterOptionsData[key].length; // Store the total count for each tab
        });

        setFilterOptions(filterOptionsData);
        setTabItemCounts(itemCounts);
        setTabTotalCounts(totalCounts); // Update the tabTotalCounts state with the correct total counts
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    // Function to switch between tabs
    const handleTabChange = (index) => {
      setActiveTab(index);

      // Reset the tab page number when switching tabs
      setTabPages((prevTabPages) => ({
        ...prevTabPages,
        [index]: 1,
      }));
    };
    const handleShowMore = async (index) => {
      try {
        const pageSize = LOAD_MORE_PAGE_SIZE;
        const nextPage = (tabPages[index] || 1) + 1;
        const response = await fetchMoreFilterOptions(index, pageSize, nextPage);
        const newItems = response.data[0].result;

        // Combine the existing filter options with the new items
        const updatedFilterOptions = { ...filterOptions };
        updatedFilterOptions[index].result = [
          ...updatedFilterOptions[index].result,
          ...newItems,
        ];

        // Update the tabItemCounts state with the new total count for the specific tab
        setTabItemCounts((prevState) => ({
          ...prevState,
          [index]: prevState[index] + pageSize,
        }));

        // Update the filterOptions with the new combined items
        setFilterOptions(updatedFilterOptions);

        // Update the tab page number
        setTabPages((prevTabPages) => ({
          ...prevTabPages,
          [index]: nextPage,
        }));
      } catch (error) {
        console.error("Error fetching more items:", error);
      }
    };
    const [selectedFilters, setSelectedFilters] = useState([]);

    const handleFilter = (filter) => {
      const index = selectedFilters.indexOf(filter);
      let updatedSelectedFilters;
    
      if (index === -1) {
        updatedSelectedFilters = [...selectedFilters, filter];
      } else {
        updatedSelectedFilters = selectedFilters.filter((item) => item !== filter);
      }
    
      setSelectedFilters(updatedSelectedFilters);
    
      // Fetch user data from the API with the updated selected filters
      fetchFilteredGameProfiles(updatedSelectedFilters);
    };
    const fetchFilteredGameProfiles = async (filters, searchQuery, columns, page) => {
      try {
        const params = new URLSearchParams({
          page: page,
          pageSize,
          ...parseFilters(filters),
          search: searchQuery,
          columns: columns.join(','), // Join the columns array into a comma-separated string
        });
    
        const response = await axios.get(`http://localhost:8081/gamesFilters?${params}`);
        console.log(response)
        setUserProfiles(response.data.results);
        setMaxPages(response.data.maxPages);
      } catch (error) {
        console.error("Error fetching filtered user profiles:", error);
      }
    };  
    
    
    // Helper function to parse selected filters and convert them to API query params
    const parseFilters = (filters) => {
      const parsedFilters = {};
    
      filters.forEach((filter) => {
        const [type, value] = filter.split(":");
        if (!parsedFilters[type]) {
          parsedFilters[type] = [];
        }
        parsedFilters[type].push(value);
      });
    
      return parsedFilters;
    };
    useEffect(() => {
      fetchFilteredGameProfiles(selectedFilters, searchQuery, ['platforms', 'title'], currentPage);
    }, [selectedFilters, searchQuery, currentPage]);
  
    console.log(typeof(userProfiles))
    return (
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 my-24">
        <form className="mb-8">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Mockups, Logos..."
            value={searchQuery} // Use the searchQuery state as the value for the input
            onChange={handleSearchChange} // Call the new search query change handler
            required
          />

            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex items-center">
        <Button onClick={handleOpen} variant="filter">
          Filter
        </Button>
        <div className="ml-3 flex items-center mt-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Chosen Filters:
          </h3>
          <div className="flex flex-wrap ml-2">
            {selectedFilters.map((filter, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-700 rounded-lg py-1 px-2 mr-2 mb-2"
              >
                {filter}
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => handleFilter(filter)}
                >
                  {/* Icon to remove the filter */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 inline-block align-text-bottom text-red-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div></div>{/* Flex container for the Filter button and chosen filters */}

        {/* User Profiles */}
        {userProfiles && userProfiles.length > 0 && userProfiles !== [] ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Render the paginated UserProfile components */}
          {userProfiles.map((profile) => (
            <MessageCard
              key={profile.gameid} // Assuming "gameid" is a unique identifier
              title={profile.title}
              gameid={profile.gameid}
              profile_pic_url={
                profile.profile_pic_url == null
                  ? "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  : profile.profile_pic_url
              }
              platforms={profile.platforms} // Pass in the platforms if available
              price={profile.price}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg text-center mt-8">
          No games match your filters.
        </p>
      )}

        {/* Pagination section */}
        {maxPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <a
              href="#"
              className={`px-4 py-2 text-blue-500 underline ${
                currentPage === 1 ? "pointer-events-none" : ""
              }`}
              onClick={() => handlePagination(currentPage - 1)}
            >
              Previous
            </a>
            {/* Display page numbers */}
            {getPageNumbers().map((pageNum) => (
              <IconButton
                key={pageNum}
                color={pageNum === currentPage ? "blue" : "blue-gray"}
                size="sm"
                className="px-4"
                onClick={() => handlePagination(pageNum)}
              >
                {pageNum}
              </IconButton>
            ))}
            <a
              href="#"
              className={`px-4 py-2 text-blue-500 underline ${
                currentPage === maxPages ? "pointer-events-none" : ""
              }`}
              onClick={() => handlePagination(currentPage + 1)}
            >
              Next
            </a>
          </div>
        )}
        <Dialog
          open={open}
          handler={handleOpen}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <Tabs>
            <TabsHeader>
              {/* Render tab headers */}
              {Object.keys(filterOptions).map((key, index) => (
                <Tab
                  key={index}
                  value={index}
                  active={index === activeTab}
                  onChange={() => handleTabChange(index)}
                >
                  {filterOptions[key]["columnName"]}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              {/* Render tab panels */}
              {Object.keys(filterOptions).map((key, index) => (
                <TabPanel key={index} value={index} active={index === activeTab}>
                  <div className="max-h-60 overflow-y-auto">
                    <div>
                      {filterOptions[key].result.map((item, itemIndex) => (
                        <label key={itemIndex} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(
                              `${index === 0 ? "category:" : "platform:"}${
                                item.catname || item.platform_name
                              }`
                            )}
                            onChange={() =>
                              handleFilter(
                                `${index === 0 ? "category:" : "platform:"}${
                                  item.catname || item.platform_name
                                }`
                              )
                            }
                            className="mr-2"
                          />
                          {item.catname || item.platform_name}
                        </label>
                      ))}
                    </div>
                    {/* Show "Show more" link if there are more items */}
                    {tabItemCounts[index] < tabTotalCounts[index] && (
                      <button
                        onClick={() => handleShowMore(index)}
                        className="text-blue-500 underline"
                      >
                        Show more...
                      </button>
                    )}
                  </div>
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
          <DialogFooter>
            <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={handleOpen}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>

      </div>
    );
  };

  export default Search;
