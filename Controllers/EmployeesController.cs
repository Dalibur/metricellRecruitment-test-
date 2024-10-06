using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        SqliteConnectionStringBuilder connectionStringBuilder = null;
        public EmployeesController()
        {
            connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
        }
        [HttpGet]
        public List<Employee> Get()
        {
            var employees = new List<Employee>();


            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();
                // adjusted query to include ID
                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT ID, Name, Value FROM Employees";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Id = reader.GetInt32(0),
                            Name = reader.GetString(1),
                            Value = reader.GetInt32(2)

                        });
                    }
                }
            }

            return employees;
        }

        [HttpPost]
        public IActionResult Post([FromBody] Employee newEmployee)
        {
            if (newEmployee.Value == 0 && string.IsNullOrEmpty(newEmployee.Name))
                return StatusCode(422, new { message = "Failed to insert employee with empty name and a value less than 1." });

            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                //checking if the same entry exists in the db exit with a conflict if there is 
                var checkCmd = connection.CreateCommand();
                checkCmd.CommandText = @"SELECT COUNT(1) FROM Employees WHERE Name = @Name AND Value = @Value";
                checkCmd.Parameters.AddWithValue("@Name", newEmployee.Name);
                checkCmd.Parameters.AddWithValue("@Value", newEmployee.Value);
                var exists = Convert.ToInt32(checkCmd.ExecuteScalar());

                if (exists > 0)
                    return Conflict(new { message = "Employee already exists" });

                var insertCmd = connection.CreateCommand();
                insertCmd.CommandText = @"INSERT INTO Employees (Name, Value) VALUES (@Name, @Value)";
                insertCmd.Parameters.AddWithValue("@Name", newEmployee.Name);
                insertCmd.Parameters.AddWithValue("@Value", newEmployee.Value);

                var rowsAffected = insertCmd.ExecuteNonQuery();

                // Assuring adding and returning 
                if (rowsAffected > 0)
                    return Ok(new { employee = newEmployee });
                else
                    return StatusCode(422, new { message = "Failed to insert employee" });
            }
        }
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Employee updatedEmployee)
        {
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                //checking if the same entry exists in the db 
                var checkCmd = connection.CreateCommand();
                checkCmd.CommandText = @"SELECT COUNT(1) FROM Employees WHERE ID = @Id";
                checkCmd.Parameters.AddWithValue("@Id", id);
                var exists = Convert.ToInt32(checkCmd.ExecuteScalar());

                if (exists == 0)
                    return NotFound(new { message = "Employee not in Database" });

                var updateCmd = connection.CreateCommand();
                updateCmd.CommandText = @"UPDATE Employees SET Name = @Name, Value = @Value WHERE ID = @Id";
                updateCmd.Parameters.AddWithValue("@Id", id);
                updateCmd.Parameters.AddWithValue("@Name", updatedEmployee.Name);
                updateCmd.Parameters.AddWithValue("@Value", updatedEmployee.Value);

                var rowsAffected = updateCmd.ExecuteNonQuery();
                // Assuring modifying and returning changed employee
                if (rowsAffected > 0)
                    return Ok(new { employee = updatedEmployee });
                else
                    return StatusCode(422, new { message = "Failed to update employee" });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                //checking if the same entry exists in the db 
                var checkCmd = connection.CreateCommand();
                checkCmd.CommandText = @"SELECT COUNT(1) FROM Employees WHERE ID = @Id";
                checkCmd.Parameters.AddWithValue("@Id", id);
                var exists = Convert.ToInt32(checkCmd.ExecuteScalar());

                if (exists == 0)
                    return NotFound(new { message = "Employee not in Database" });

                var deleteCmd = connection.CreateCommand();
                deleteCmd.CommandText = @"DELETE FROM Employees WHERE ID = @Id";
                deleteCmd.Parameters.AddWithValue("@Id", id);
                deleteCmd.ExecuteNonQuery();

                return Ok(new { message = "Employee deleted!" });
            }
        }

    }
}
