// Importing necessary modules
const fs = require("fs"); // Importing the File system module for working with files
const csv = require("csv-parser"); // Using the CSV parser module to read CSV files

// Defining the path to the input CSV file
const inputFilePath = "Assignment_Timecard.csv";

// Initializing arrays to store employees in different categories
const consecutiveDaysEmployees = []; // Storing employees who are working for 7 consecutive days
const lessThan10HoursEmployees = []; // Collecting employees with less than 10 hours between shifts but more than 1 hour
const moreThan14HoursEmployees = []; // Gathering employees who are working for more than 14 hours in a single shift

// Creating a dictionary to track consecutive days for each employee
const consecutiveDaysMap = {};

// Reading the CSV file, processing the data, and handling events
fs.createReadStream(inputFilePath)
  .pipe(csv()) // Piping the read stream to the CSV parser
  .on("data", (row) => {
    // When data is being read from the CSV
    // Extracting relevant information from the current row
    const name = row["Employee Name"]; // Getting the employee's name from the row
    const position = row["Position ID"]; // Retrieving the employee's position from the row
    const timecardHours = parseFloat(row["Timecard Hours (as Time)"]); // Parsing the timecard hours as a float

    // Checking if the employee has less than 10 hours between shifts but more than 1 hour
    const lessThan10HoursBetweenShifts =
      timecardHours < 10 && timecardHours > 1;

    // Checking if the employee has worked for more than 14 hours in a single shift
    const moreThan14HoursInSingleShift = timecardHours > 14;

    // If the employee meets the criteria for less than 10 hours between shifts, adding them to the respective array
    if (lessThan10HoursBetweenShifts) {
      lessThan10HoursEmployees.push({ name, position });
    }

    // If the employee meets the criteria for more than 14 hours in a single shift, adding them to the respective array
    if (moreThan14HoursInSingleShift) {
      moreThan14HoursEmployees.push({ name, position });
    }

    // Checking for consecutive days
    if (consecutiveDaysMap[name]) {
      consecutiveDaysMap[name]++;
    } else {
      consecutiveDaysMap[name] = 1;
    }

    // If the employee has worked for 7 consecutive days, adding them to the consecutive days array
    if (consecutiveDaysMap[name] === 7) {
      consecutiveDaysEmployees.push({ name, position });
      //   consecutiveDaysMap[name] = 0; // Resetting consecutive days count
      //   I commented the previous line to reduce redundency.
      //   Explanation: Resetting may create an redundency for Eg: If a person has 15 days consecutively, then it will put that person twice.
    }
  })
  .on("end", () => {
    // When the CSV reading is finished
    // Getting the counts of employees in each category
    const consecutiveDaysCount = consecutiveDaysEmployees.length;
    const lessThan10HoursCount = lessThan10HoursEmployees.length;
    const moreThan14HoursCount = moreThan14HoursEmployees.length;

    // Printing the counts to the console
    console.log(
      `Number of employees with consecutive days: ${consecutiveDaysCount}`
    );
    console.log(
      `Number of employees with less than 10 hours but more than 1 hour between shifts: ${lessThan10HoursCount}`
    );
    console.log(
      `Number of employees with more than 14 hours in a single shift: ${moreThan14HoursCount}`
    );

    // Writing the data to text files for each category
    writeToFile("consecutive_days_employees.txt", consecutiveDaysEmployees);
    writeToFile("less_than_10_hours_employees.txt", lessThan10HoursEmployees);
    writeToFile("more_than_14_hours_employees.txt", moreThan14HoursEmployees);

    console.log("Entered data in txt files.");
  });

// Function to write employee data to a text file
function writeToFile(filename, employees) {
  const fileStream = fs.createWriteStream(filename); // Creating a writable stream for the file

  employees.forEach((employee) => {
    // Looping through each employee in the array
    // Writing the employee's name and position to the file
    fileStream.write(`Employee Name: ${employee.name}\n`);
    fileStream.write(`Position ID: ${employee.position}\n`);
    fileStream.write("-----------------------------\n"); // Adding a separator
  });

  fileStream.end(); // Closing the file stream
}
