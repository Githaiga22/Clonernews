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
// Define a function to display comments, where 'kid' is an object representing a comment
const displayComments = (kid) => {
    // If the comment is deleted or the author is marked as dead, stop the function
    if (kid.dead || kid.deleted) {
        return;
    }

    // Get the parent element of the comment by its parent ID
    const parent = document.getElementById(kid.parent);
    
    // Create a new div to hold the comment
    const commentDiv = document.createElement('div');
    
    // Create a div to hold the content (text) of the comment
    const commentContent = document.createElement('div');
    
    // Create a div to hold the author information of the comment
    const commentAuthor = document.createElement('div');

    // If the comment has text, set it inside the commentContent div and add a class for styling
    if (kid.text) {
        commentContent.innerHTML = kid.text;
        commentContent.className = 'content-class'; // Add class for styling
    }

    // Set the comment's ID and a class for the outer div
    commentDiv.id = kid.id;
    commentDiv.className = 'story-div-class';

    // Add the author's name and the time the comment was posted using timeConverter
    commentAuthor.innerHTML = `<span><b>@${kid.by}</b> ${timeConverter(kid.time)}</span>`;
    
    // Append the author information and content to the main comment div
    commentDiv.append(commentAuthor);
    commentDiv.append(commentContent);

    // If the comment has replies (kids), create a button to display them
    if (kid.kids) {
        const commentBtn = document.createElement('button');
        
        // Set the button text based on how many replies the comment has
        commentBtn.textContent = `${kid.kids.length} Comment${kid.kids.length > 1 ? 's' : ''}`;

        // Add a class to the button for styling
        commentBtn.className = 'btn';
        
        // Append the button to the main comment div
        commentDiv.append(commentBtn);
        
        // Add an event listener to load the replies (kids) when the button is clicked
        commentBtn.addEventListener(
            'click',
            () => handleComments(kid.kids), // Call handleComments when clicked
            { once: true } // Ensure the button can only be clicked once
        );
    }
    // Append the comment div to its parent if found, otherwise append to a fallback container
    if (parent) {
        parent.append(commentDiv);
    } else {
        const container = document.querySelector('.main-container-class');
        container.append(commentDiv);
    }
};
// Define a function to handle loading comments given an array of comment IDs
const handleComments = (commentIds) => {

    // Define an inner async function to fetch and sort comment data from the API
    const getCommentsData = async (commentIds) => {
        // Sort the comment IDs in descending order
        const sortedData = [...commentIds].sort((a, b) => (a > b ? -1 : 1));

        // Fetch the comment data from the API and return the results
        const showComments = await Promise.all(
            sortedData.map((commentId) =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json?print=pretty`)
                    .then((response) => response.json()) // Parse the JSON response
            )
        );
        return showComments; // Return the fetched comments
    };

    // Call the async function to get comment data and then display each comment
    getCommentsData(commentIds).then((showComments) => {
        showComments.forEach((comment) => {
            displayComments(comment); // Use displayComments to show each comment
        });
    });
};
