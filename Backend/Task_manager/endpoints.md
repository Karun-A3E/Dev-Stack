User Endpoints:

[x] POST /api/users: Create a new user.
[x] GET /api/users/{id}: Retrieve a specific user's details.
[x] PUT /api/users/{id}: Update a specific user's details.
[x] DELETE /api/users/{id}: Delete a specific user.


Team Endpoints:

[x] POST /api/teams: Create a new team.
[x] GET /api/teams/{id}: Retrieve a specific team's details.
[x] PUT /api/teams/{id}: Update a specific team's details.
[x] DELETE /api/teams/{id}: Delete a specific team.
[x] GET /teams/task/id : Get all the tasks of a specific team


Task Endpoints:

[x] POST /api/tasks: Create a new task.
[x] GET /api/tasks/{id}: Retrieve a specific task's details.
[x] PUT /api/tasks/{id}: Update a specific task's details.
[x] DELETE /api/tasks/{id}: Delete a specific task.


Task Assignment Endpoints:

[x] POST /api/tasks/{taskId}/assign/{userId}: Assign a task to a specific user.
[x] DELETE /api/tasks/{taskId}/unassign: Unassign a task from a user.

Team Membership Endpoints:

[x] POST /api/teams/{teamId}/members/{userId}: Add a user to a team.
[x] DELETE /api/teams/{teamId}/members/{userId}: Remove a user from a team.







Task Filtering and Sorting:

GET /api/tasks?status=pending&priority=high: Retrieve tasks filtered by status and priority.
GET /api/tasks?assigned_to={userId}: Retrieve tasks assigned to a specific user.
GET /api/tasks?team={teamId}: Retrieve tasks belonging to a specific team.
GET /api/tasks?sort=due_date&order=asc: Retrieve tasks sorted by due date in ascending order.


Task Comments:

POST /api/tasks/{taskId}/comments: Add a comment to a specific task.
GET /api/tasks/{taskId}/comments: Retrieve all comments for a specific task.
PUT /api/tasks/{taskId}/comments/{commentId}: Update a specific comment on a task.
DELETE /api/tasks/{taskId}/comments/{commentId}: Delete a specific comment from a task.


Task Attachments:

POST /api/tasks/{taskId}/attachments: Upload an attachment to a specific task.
GET /api/tasks/{taskId}/attachments/{attachmentId}: Retrieve a specific attachment of a task.
DELETE /api/tasks/{taskId}/attachments/{attachmentId}: Delete a specific attachment from a task.


Task Search:

GET /api/tasks/search?q=keyword: Search for tasks based on a keyword or The method of using grid-based mapping, as demonstrated in the Roofpedia project, has practical applications in real-life scenarios. Here are some ways in which this method can be utilized:

Urban Planning and Development: Grid-based mapping can assist urban planners in identifying areas suitable for solar panel installations. By analyzing the spatial distribution of existing solar panels and overlaying it with land-use data, urban planners can make informed decisions regarding the integration of solar energy systems into new developments or the retrofitting of existing structures.

Renewable Energy Policy: The data obtained from grid-based mapping can provide valuable insights for policymakers in formulating renewable energy policies. By understanding the geographic distribution of solar panels and their correlation with socioeconomic factors, policymakers can identify areas that require targeted incentives or support for solar energy adoption. This information can aid in the formulation of effective policies to promote renewable energy usage and reduce carbon emissions.

Energy Efficiency Programs: Grid-based mapping can be used to identify areas with high energy consumption and low solar panel density. This information can help prioritize energy efficiency programs and identify locations where the installation of solar panels can have the greatest impact in reducing energy consumption and greenhouse gas emissions.

Environmental Impact Assessments: The use of grid-based mapping in assessing the spatial distribution of solar panels can be valuable in conducting environmental impact assessments. By analyzing the proximity of solar panel installations to environmentally sensitive areas or protected habitats, potential ecological risks can be identified, and mitigation measures can be implemented.

Equity and Social Justice Considerations: Grid-based mapping can help address equity and social justice concerns in renewable energy deployment. By analyzing the relationship between solar panel distribution and socioeconomic factors such as income levels, policymakers can ensure that renewable energy initiatives are accessible to all communities, including marginalized or low-income populations. This can help bridge the energy divide and promote energy justice.

While the method of grid-based mapping requires robust data collection and analysis, advancements in remote sensing technologies and geographic information systems (GIS) have made it increasingly practical and accessible. The availability of high-resolution satellite imagery, open-source GIS software, and advanced data processing techniques has significantly facilitated the implementation of grid-based mapping in real-life applications.

Moreover, the scalability of the method allows for its application at various scales, from individual buildings to entire cities or regions. This flexibility makes it suitable for different contexts and can support decision-making processes across multiple sectors, including energy, urban planning, and environmental management.phrase.


Task Statistics:

GET /api/tasks/stats/assigned: Get statistics on the number of tasks assigned to each user.
GET /api/tasks/stats/priority: Get statistics on the distribution of tasks by priority.
GET /api/tasks/stats/due_date: Get statistics on the distribution of tasks by due date.










Task Filtering and Sorting:

GET /api/tasks?status=pending&priority=high: Retrieve tasks filtered by status and priority.
GET /api/tasks?assigned_to={userId}: Retrieve tasks assigned to a specific user.
GET /api/tasks?team={teamId}: Retrieve tasks belonging to a specific team.
GET /api/tasks?sort=due_date&order=asc: Retrieve tasks sorted by due date in ascending order.


Task Comments:

POST /api/tasks/{taskId}/comments: Add a comment to a specific task.
GET /api/tasks/{taskId}/comments: Retrieve all comments for a specific task.
PUT /api/tasks/{taskId}/comments/{commentId}: Update a specific comment on a task.
DELETE /api/tasks/{taskId}/comments/{commentId}: Delete a specific comment from a task.


Task Attachments:

POST /api/tasks/{taskId}/attachments: Upload an attachment to a specific task.
GET /api/tasks/{taskId}/attachments/{attachmentId}: Retrieve a specific attachment of a task.
DELETE /api/tasks/{taskId}/attachments/{attachmentId}: Delete a specific attachment from a task.


Task Search:

GET /api/tasks/search?q=keyword: Search for tasks based on a keyword or phrase.


Task Statistics:

GET /api/tasks/stats/assigned: Get statistics on the number of tasks assigned to each user.
GET /api/tasks/stats/priority: Get statistics on the distribution of tasks by priority.
GET /api/tasks/stats/due_date: Get statistics on the distribution of tasks by due date.