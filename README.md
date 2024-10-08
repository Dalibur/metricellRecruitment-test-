﻿# Recruitment Coding Test for Metricell

This project is a submission for the **Metricell recruitment test**. It demonstrates full-stack CRUD functionality using **React** on the frontend and **.NET 6** with **SQLite** on the backend. It also includes additional SQL logic to fulfill specific requirements.

## Project Structure

### Frontend
The frontend is structured into **Components** and **Services**:

- **Components**: This folder contains the core UI components (`.tsx` and `.ts` files) for handling the user interface.
- **Services**: The CRUD operations are implemented in the **Services** folder, where API interactions with the backend occur.
- **Routing**: I used `App.tsx` for routing, allowing for potential future expansion of functionality and additional pages.
![Default Screen](Assets/mainWindow.jpg)

### Backend
The backend utilizes **.NET 6** and **SQLite** for database management. The following changes were made:

- **Database Creation**: Adjustments were made to the database creation logic to better fit the requirements.
- **Controllers**: Instead of using a separate `ListController`, I consolidated everything into an `EmployeesController`, as I found it sufficient to meet the CRUD requirements.

### SQL Scripts:
The project includes a **SQL Scripts folder**, containing additional SQL queries to meet specific task requirements. These queries handle:
1. Incrementing employee values based on their names.
2. Summing values for names beginning with A, B, or C, with a threshold check.

#### Example of One of the SQL Queies in Action:
![SQL Query Functionality GIF](Assets/SQLQuery.gif)
