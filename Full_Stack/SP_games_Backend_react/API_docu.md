GET /users: Fetches all users' information but currently unused.
GET /users/:id: Fetches specific user information by user ID. It uses Redis caching to improve performance for repeated requests.
GET /users/image/:id: Fetches the user's profile picture by user ID. It also uses Redis caching.
POST /addNewUser: Adds a new user with provided username, email, and password to the database.
DELETE /user/:id: Deletes a user by user ID. It also removes the user data from Redis cache and deletes the user's profile picture if present.
GET /user/paged: Fetches paginated user data with search capabilities. Requires a token (presumably for authentication).
GET /userSpecificInformation: Fetches specific information for the authenticated user. Requires a token.
PUT /users: Updates user information (username, email, password, profile picture) for the authenticated user. Requires a token.

GET /top10Games:
Description: Fetches the top 10 games based on some criteria (e.g., popularity, ratings).
Response Code:
200: Success. Returns an array of top 10 games.
500: Internal Server Error.

GET /GetUserBookmarked:
Description: Fetches the bookmarks of the authenticated user.
Headers: Requires a valid token (authentication token).
Response Code:
200: Success. Returns an array of bookmarks for the authenticated user.
500: Internal Server Error.

GET /CheckIfGameBookmrked:
Description: Checks if a game is bookmarked by the authenticated user.
Headers: Requires a valid token (authentication token).
Query Parameter:
query: The ID of the game to check if it's bookmarked.
Response Code:
200: Success. Returns a result indicating whether the game is bookmarked or not.
500: Internal Server Error.


POST /newBookMark:
Description: Adds a new bookmark for the authenticated user and a specific game.
Headers: Requires a valid token (authentication token).
Query Parameter:
query: The ID of the game to add to the bookmarks.
Response Code:
201: Success. The bookmark has been added.
500: Internal Server Error.

DELETE /removeBookmark:
Description: Removes a bookmark for the authenticated user and a specific game.
Headers: Requires a valid token (authentication token).
Query Parameter:
query: The ID of the game to remove from the bookmarks.
Response Code:
201: Success. The bookmark has been removed.
500: Internal Server Error.

GET /games/allGames (UNUSED)
Description: Fetch all games.
Response Code:
200: Success. Returns an array of all games.
500: Internal Server Error.


GET /games/Pagination (UNUSED)
Description: Fetch paginated game data.
Parameters:
page (optional, default: 1): Page number.
pageSize (optional, default: 10): Number of games per page.
Response Code:
200: Success. Returns paginated game data.
500: Internal Server Error.


GET /games/{gameid}
Description: Fetch specific game by ID.
Parameters:
gameid (required): Game ID.
Response Code:
200: Success. Returns the specific game.
500: Internal Server Error.


PATCH /games/{gameid}
Description: Update game information by ID.
Parameters:
gameid (required): Game ID.
Request Body: JSON object containing updated game information.
Response Code:
200: Success. Game updated successfully.
409: Conflict - Duplicate key.
500: Internal Server Error.


GET /getStatus
Description: Get game release status and upcoming games.
Response Code:
200: Success. Returns game release status and upcoming games.
500: Internal Server Error.


GET /getRandom
Description: Get random games by section value.
Parameters:
value (required): Section value (e.g., "new", "popular").
Response Code:
200: Success. Returns random games.
500: Internal Server Error.


GET /gamesFilters
Description: Fetch paginated game data with filtering.
Parameters:
page (optional, default: 1): Page number.
pageSize (optional, default: 10): Number of games per page.
yearRange (optional): Comma-separated range of years (e.g., "2010,2020").
minRating (optional): Minimum game rating (float).
maxRating (optional): Maximum game rating (float).
platform (optional): Comma-separated list of platform names.
category (optional): Comma-separated list of category names.
search (optional): Search input for filtering games.
columns (optional): Selected columns to fetch.
Response Code:
200: Success. Returns paginated game data with filtering.
500: Internal Server Error.


POST /newGame
Description: Add a new game.
Headers: Requires a valid token (bearerAuth).
Request Body: Form data containing new game information.
Response Code:
201: Success. Returns the ID of the newly added game.
500: Internal Server Error.


Update Category (UNUSED)

Updates a category with the given ID.

Endpoint: PUT /categories/:catid
Description: (UNUSED)
Parameters:
catid - Category ID.
Request Body: Object containing catname and cat_description.
Response Code:
200: Success. Category updated successfully.
409: Conflict. Category with the same name already exists.
500: Internal Server Error.
Update Platform (UNUSED)

Updates a platform with the given ID.

Endpoint: PUT /platforms/:platformid
Description: (UNUSED)
Parameters:
platformid - Platform ID.
Request Body: Object containing platform_name and platform_description.
Response Code:
200: Success. Platform updated successfully.
409: Conflict. Platform with the same name already exists.
500: Internal Server Error.
Get All Categories (UNUSED)

Retrieves information about all categories.

Endpoint: GET /categories
Description: (UNUSED)
Response Code:
200: Success. Returns information about all categories.
500: Internal Server Error.
Get All Platforms (UNUSED)

Retrieves information about all platforms.

Endpoint: GET /platforms
Description: (UNUSED)
Response Code:
200: Success. Returns information about all platforms.
500: Internal Server Error.
Add New Category

Adds a new category.

Endpoint: POST /categories
Description: Used for inserting a new category.
Request Body: Object containing catname and cat_description.
Response Code:
200: Success. New category added successfully.
500: Internal Server Error.
Add New Platform

Adds a new platform.

Endpoint: POST /platforms
Description: Used for inserting a new platform.
Request Body: Object containing platform_name and platform_description.
Response Code:
200: Success. New platform added successfully.
500: Internal Server Error.
Delete Platform

Deletes a platform with the given ID.

Endpoint: DELETE /platforms/:platformid
Description: Used for deleting a platform.
Parameters:
platformid - Platform ID.
Response Code:
200: Success. Platform deleted successfully.
500: Internal Server Error.
Delete Category

Deletes a category with the given ID.

Endpoint: DELETE /categories/:catid
Description: Used for deleting a category.
Parameters:
catid - Category ID.
Response Code:
200: Success. Category deleted successfully.
500: Internal Server Error.
Get Platforms Paged

Retrieves paged platform data.

Endpoint: GET /platform/paged
Description: GET PLATFORMS PAGED
Parameters:
page - Page number.
pageSize - Number of platforms per page.
search - Search input for filtering platforms.
columns - Selected columns to fetch.
Response Code:
200: Success. Returns paged platform data.
500: Internal Server Error.
Get Categories Paged

Retrieves paged category data.

Endpoint: GET /category/paged
Description: GET CATEGORY PAGED
Parameters:
page - Page number.
pageSize - Number of categories per page.
search - Search input for filtering categories.
columns - Selected columns to fetch.
Response Code:
200: Success. Returns paged category data.
500: Internal Server Error.
Get Platform Details

Retrieves details of a platform with the given ID.

Endpoint: GET /platform/:id
Description: GET PLATFORM DETAILS
Parameters:
id - Platform ID.
Response Code:
200: Success. Returns platform details.
500: Internal Server Error.
Get Category Details

Retrieves details of a category with the given ID.

Endpoint: GET /category/:id
Description: GET CATEGORY DETAILS
Parameters:
id - Category ID.
Response Code:
200: Success. Returns category details.
500: Internal Server Error.
Get Filters

Retrieves filters for pagination.

Endpoint: GET /getFilters
Description: GET FILTERS IN PAGINATION
Parameters:
page - Page number (default: 1).
filters - Comma-separated filter criteria.
Response Code:
200: Success. Returns filters in pagination.
500: Internal Server Error.
Update Platform and Category

Updates platforms and categories of a game.

Endpoint: PUT /updatePlatform/updateCategory
Description: Updates platform and category information for a game.
Headers: Requires a valid token (bearerAuth).
Request Body: Object containing categories, platforms, and prices.
Query Parameters:
gameid - ID of the game to update.
Response Code:
200: Success. Platform and category updates successful! Returns old and new platform prices.
400: Bad Request. Invalid data provided.
500: Internal Server Error.


User Login

Logs in a user and generates access and refresh tokens.

Endpoint: POST /login
Description: Logs in a user and generates access and refresh tokens.
Request Body: Object containing email and password.
Response Code:
201: Success. Returns user ID, user type, refresh token, and access token.
404: User Not Found. User with the provided email and password does not exist.
500: Internal Server Error.
Refresh Token

Refreshes the access token using a valid refresh token.

Endpoint: POST /refresh
Description: Refreshes the access token using a valid refresh token.
Headers: Requires a valid refresh token in the 'refresh-token' header.
Response Code:
200: Success. Returns a new access token.
403: Forbidden. No refresh token provided or invalid refresh token.
500: Internal Server Error.
Add New Review

Adds a new review for a game.

Endpoint: POST /reviews
Description: Add in a new review.
Headers: Requires a valid token (verifyToken).
Request Body: Object containing game_id, review, and rating.
Response Code:
201: Success. Returns the ID of the newly added review.
400: Bad Request. Invalid data provided.
500: Internal Server Error.
Get Reviews for a Game

Retrieves reviews related to a specific game.

Endpoint: GET /reviews/:gameid
Description: Gets the reviews related to that game ID.
Parameters:
gameid - ID of the game.
Response Code:
200: Success. Returns the reviews related to the game.
500: Internal Server Error.
Get Recent Reviews Made by User

Retrieves recent reviews made by a specific user.

Endpoint: GET /getRecentReviewsOfUser
Description: Gets recent reviews made by a user only.
Headers: Requires a valid token (verifyToken).
Query Parameters:
limitation - Boolean value to indicate if the results are limited or not (default: true).
Response Code:
200: Success. Returns recent reviews made by the user.
500: Internal Server Error.
Get User Payment Info

Retrieves payment information of a user.

Endpoint: GET /getPaymentInfo
Description: Gets user payment info.
Headers: Requires a valid token (verifyToken).
Response Code:
200: Success. Returns user payment information.
500: Internal Server Error.
Get Orders Paged

Retrieves paged order data.

Endpoint: GET /getOrderView/paged
Description: Gets the orders of the SP_GAMES paged.
Headers: Requires a valid token (verifyToken).
Parameters:
page - Page number (default: 1).
pageSize - Number of orders per page (default: 10).
search - Search input for filtering orders.
columns - Selected columns to fetch.
Response Code:
200: Success. Returns paged order data.
500: Internal Server Error.
Get User Order Details

Retrieves order details of a user.

Endpoint: GET /getOrderDetails
Description: Gets the order of a user limited or unlimited.
Headers: Requires a valid token (verifyToken).
Query Parameters:
limitation - Boolean value to indicate if the results are limited or not (default: true).
Response Code:
200: Success. Returns user order information.
500: Internal Server Error.
Update Order Status

Updates the status of an order.

Endpoint: PATCH /updateStatus
Description: Updates the status of an order.
Request Body: Object containing Id and status.
Response Code:
201: Success. Order status updated.
500: Internal Server Error.
Insert New Order

Inserts a new order for a user.

Endpoint: POST /insertNewOrder
Description: Adds a new order for a user.
Headers: Requires a valid token (verifyToken).
Request Body: Object containing cartItems.
Response Code:
200: Success. Order created successfully.
500: Internal Server Error.
Add New Payment Card

Adds a new payment card for a user.

Endpoint: POST /addNewPaymentCard
Description: Adds a new payment card for a user.
Headers: Requires a valid token (verifyToken).
Request Body: Object containing paymentType and lastDigits.
Response Code:
201: Success. Payment card added successfully.
400: Bad Request. Missing required fields.
500: Internal Server Error.
Get Search Autocomplete Suggestions

For creating autocomplete suggestions.

Endpoint: GET /get/Search/auto
Description: For creating autocomplete suggestions.
Query Parameters:
columName - Column name to search.
tableName - Table name to search.
value - Value to match for suggestions.
Response Code:
200: Success. Returns autocomplete suggestions.
500: Internal Server Error.
Get Search Results

Used to get autocomplete suggestions for the search bar.

Endpoint: GET /getSearchResults
Description: Used to get autocomplete suggestions for the search bar.
Query Parameters:
query - Search query for autocomplete.
Response Code:
200: Success. Returns search results.
500: Internal Server Error.
Get Games Overview

Retrieves an overview of games including popular games, random picks, and favorites.

Endpoint: GET /overview/games
Description: Retrieves an overview of games (special).
Response Code:
200: Success. Returns overview of games.
500: Internal Server Error.
Get Lines Chart Data

Retrieves data for the lines chart.

Endpoint: GET /getLinesChart
Description: Gets lines chart data.
Headers: Requires a valid token (verifyToken).
Query Parameters:
timeSpan - Time span for the chart data.
userType - User type for the chart data.
Response Code:
200: Success. Returns lines chart data.
500: Internal Server Error.
Get Bar Chart Data

Retrieves data for the bar chart.

Endpoint: GET /getBarChart
Description: Gets bar chart data.
Headers: Requires a valid token (verifyToken).
Response Code:
200: Success. Returns bar chart data.
500: Internal Server Error.