// Define a function called timeConverter that takes a UNIX timestamp as input
const timeConverter = (UNIX_timestamp) => {
    // Create a new Date object from the UNIX timestamp (multiplied by 1000 to convert seconds to milliseconds)
    let a = new Date(UNIX_timestamp * 1000);
    
    // Define an array with abbreviated month names for easier formatting later
    let months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 
        'Sep', 'Oct', 'Nov', 'Dec',
    ];
    
    // Get the full year (e.g., 2024) from the Date object
    let year = a.getFullYear();
    
    // Get the current month (as an index) from the Date object and convert it to a name using the months array
    let month = months[a.getMonth()];
    
    // Get the day of the month and add a leading zero if the value is less than 10
    let date = a.getDate() < 10 ? `0${a.getDate()}` : a.getDate();
    
    // Get the hour and add a leading zero if less than 10
    let hour = a.getHours() < 10 ? `0${a.getHours()}` : a.getHours();
    
    // Get the minutes and add a leading zero if less than 10
    let min = a.getMinutes() < 10 ? `0${a.getMinutes()}` : a.getMinutes();
    
    // Get the seconds and add a leading zero if less than 10
    let sec = a.getSeconds() < 10 ? `0${a.getSeconds()}` : a.getSeconds();
    
    // Create a formatted string containing the full date and time in the desired format
    let time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;
    
    // Return the formatted date and time string
    return time;
};

// Define a throttle function that takes a function (func) and a wait time (wait) as parameters
const throttle = (func, wait) => {
    // Initialize a flag to track whether the function is currently waiting (throttling)
    let isWaiting = false;
    
    // Return a new function that can be called with any number of arguments
    return (...args) => {
        // If the function is currently waiting, return early without executing the function
        if (isWaiting) return;
        
        // Call the original function with the provided arguments
        func(...args);
        
        // Set isWaiting to true, indicating that the function is now in a throttled state
        isWaiting = true;
        
        // Use setTimeout to reset isWaiting to false after the wait period, allowing the function to be called again
        setTimeout(() => {
            isWaiting = false;
        }, wait);
    };
};
