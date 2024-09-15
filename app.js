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
// Define a function to display story data, where 'story' is an object containing story info, and 'index' is the position of the story
const displayData = (story, index) => {
    // Check if the story is marked as dead or deleted, and return early if true (skip rendering)
    if (story.dead || story.deleted) {
        return; // Exit the function if the story is dead or deleted
    }

    // Select the main container where all stories will be appended
    const container = document.querySelector('.main-container-class');
    
    // Create a new div element to hold the story content
    const storyDiv = document.createElement('div');
    
    // Create an anchor element to wrap the story title (used for linking to the story URL)
    const storyLink = document.createElement('a');
    
    // Create an h3 element to display the story title
    const storyHead = document.createElement('h3');
    
    // Create a div element to hold the story content (text) if it exists
    const storyContent = document.createElement('div');
    
    // Create a div to display the story's author and the time it was posted
    const storyAuthor = document.createElement('div');
    
    // Create a button element for displaying the number of comments (if the story has comments)
    const storyComment = document.createElement('button');

    // If the story has a URL, set the anchor's href attribute to the URL and open it in a new tab
    if (story.url) {
        storyLink.href = story.url;       // Set the link's destination URL
        storyLink.target = '_blank';      // Open the link in a new tab
    }

    // If the story has text content, set it inside the storyContent div and add a class for styling
    if (story.text) {
        storyContent.innerHTML = story.text;   // Add the story's text content
        storyContent.className = 'content-class';  // Assign a class to the content div for styling
    }

    // Set the story's author and the time it was posted using the timeConverter function
    storyAuthor.innerHTML = `<span><b>@${story.by}</b> ${timeConverter(story.time)}</span>`;

    // Set a data attribute for the story type and assign an ID to the story div
    storyDiv.setAttribute('data-type', `${story.type}`);  // Add data attribute to store the type of story (e.g., 'story', 'comment')
    storyDiv.id = story.id;  // Set the unique story ID for the div

    // Add a class for the div to style the story element
    storyDiv.className = 'story-div-class';  // Assign a class for styling the story div
    
    // If the story index is greater than or equal to 10, hide the story (could be for lazy loading or pagination)
    if (index >= 10) storyDiv.classList.add('hide');  // Hide the story if its index is 10 or above

    // Set the story title text in the h3 element
    storyHead.textContent = story.title;  // Set the story title in the h3 element

    // Append the story title (h3) inside the anchor (link) element
    storyLink.append(storyHead);

    // Append the link (with the title) to the story div
    storyDiv.append(storyLink);

    // Append the author's information and the story content to the story div
    storyDiv.append(storyAuthor);   // Add the author and time info to the story div
    storyDiv.append(storyContent);  // Add the story's text content (if any)

    // If the story has comments (kids), create a button to display the number of comments
    if (story.kids) {
        // Set the button text to display the number of comments (handle singular/plural cases)
        storyComment.textContent = `${story.kids.length} Comment${story.kids.length > 1 ? 's' : ''}`;

        // Append the comment button to the story div
        storyDiv.append(storyComment);

        // Add a class to the comment button for styling
        storyComment.className = 'btn';  // Assign a class to the button for styling

        // Add an event listener to load the comments when the button is clicked
        storyComment.addEventListener(
            'click',  // Listen for the 'click' event on the button
            () => {
                handleComments(story.kids);  // Call handleComments function with the list of comment IDs
            },
            { once: true }  // Ensure the button can only be clicked once
        );
    }

    // Append the entire story div (with all its content) to the main container
    container.append(storyDiv);
};
// Function to handle the fetching and displaying of stories
const handleStories = (e) => {
    // Logs the event data when the function is triggered (for debugging purposes)
    console.log(e);

    // Select all div elements inside the container with class 'main-container-class'
    let notIncluded = document.querySelectorAll(`.main-container-class div`);
    
    // Remove each of the selected elements from the DOM
    notIncluded.forEach((element) => {
        element.remove();
    });

    // Asynchronous function to fetch and return the story data
    const getStoriesData = async () => {
        // Fetches the list of story IDs for 'show' stories from the Hacker News API
        const showStoriesData = await fetch(
            'https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty'
        );

        // Convert the response to JSON format
        const sData = await showStoriesData.json();

        // Sort the story IDs in descending order
        const sortedData = [...sData].sort((a, b) => (a > b ? -1 : 1));

        // Fetch detailed data for each story ID concurrently
        const showStories = await Promise.all(
            sortedData.map((storyId) =>
                fetch(
                    `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`
                ).then((showStory) => showStory.json())
            )
        );

        // Return the fetched story details
        return showStories;
    };

    // Calls the async function and processes the fetched stories
    getStoriesData().then((showStories) => {
        // Iterate over each story and pass it to the displayData function for rendering
        showStories.forEach((story, index) => {
            console.log(story); // Log each story for debugging purposes
            displayData(story, index); // Render the story on the page
        });
    });
};

// Function to display a poll option if it is neither dead nor deleted
const displayPollOption = (option) => {
    // Exit the function if the option is marked as dead or deleted
    if (option.dead === true || option.deleted === true) {
        return;
    }

    // Get the parent poll element by the poll ID from the option
    const parent = document.getElementById(option.poll);

    // Log the parent poll element (for debugging)
    console.log(parent);

    // Create a new div element to represent the poll option
    const optionDiv = document.createElement('div');

    // Create another div to hold the text and score of the poll option
    const optionContent = document.createElement('div');
    
    // Set the inner HTML of the content div to display the text and score
    optionContent.innerHTML = `${option.text}: ${option.score}`;

    // Add a class to the content div for styling
    optionContent.className = 'content-class';

    // Set the ID and class for the poll option div
    optionDiv.id = option.id;
    optionDiv.className = 'poll-divclass';

    // Append the content div inside the poll option div
    optionDiv.append(optionContent);

    // Append the poll option div to the parent poll element
    parent.append(optionDiv);
};
// This function handles the poll options for each poll by fetching poll options data.
const handlePollOption = (pollOptions) => {
    // Fetch the details for each poll option by its ID.
    const getPollsOption = async (pollOptions) => {
        // Log the array of poll options to the console.
        console.log(pollOptions);
        // Fetch data for each poll option in parallel using Promise.all and map.
        const showPollsOption = await Promise.all(
            pollOptions.map((newPollOptId) =>
                // Fetch each poll option's data from the Hacker News API and convert it to JSON.
                fetch(`https://hacker-news.firebaseio.com/v0/item/${newPollOptId}.json?print=pretty`)
                    .then((showItem) => showItem.json())
            )
        );
        // Return the fetched poll options data.
        return showPollsOption;
    };

    // Call getPollsOption and handle the data once it's fetched.
    getPollsOption(pollOptions).then((options) => {
        // Iterate over each poll option and display it on the page.
        options.forEach((option) => {
            displayPollOption(option);  // Function that displays each poll option.
        });
    });
};

// This function displays a poll and its details on the page.
const displayPoll = (poll, index) => {
    // Skip displaying polls that are either deleted or marked dead.
    if (poll.dead || poll.deleted) {
        return;
    }

    // Get the container where the poll will be appended.
    const container = document.querySelector('.main-container-class');

    // Create elements to display the poll.
    const pollDiv = document.createElement('div');  // Main poll container.
    const pollLink = document.createElement('a');   // Link to the poll.
    const pollHead = document.createElement('h3');  // Poll title (as a heading).
    const pollContent = document.createElement('div');  // Content section for poll text.
    const pollAuthor = document.createElement('div');   // Displays poll author and time.
    const pollComment = document.createElement('button');  // Button to view comments.

    // If the poll has a URL, set it as the link's href and open it in a new tab.
    if (poll.url) {
        pollLink.href = poll.url;
        pollLink.target = '_blank';
    }

    // If the poll has text content, display it in the content div.
    if (poll.text) {
        pollContent.innerHTML = poll.text;
        pollContent.className = 'content-class';  // Apply styles to the content.
        pollDiv.append(pollContent);  // Append the content to the main poll container.
    }

    // Handle poll options (if available) by fetching their data.
    handlePollOption(poll.parts);

    // Set the poll author and time, and append it to the main poll container.
    pollAuthor.innerHTML = `<span><b>@${poll.by}</b> ${timeConverter(poll.time)}</span>`;
    pollDiv.setAttribute('data-type', poll.type);  // Set data attribute for the poll type.
    pollDiv.id = poll.id;  // Set poll ID.
    pollDiv.className = 'story-div-class';  // Apply styling to the poll container.

    // Hide polls that are beyond the 10th item by default (optional functionality).
    if (index >= 10) pollDiv.classList.add('hide');

    // Set the poll title and add it as a link to the container.
    pollHead.textContent = poll.title;
    pollLink.append(pollHead);
    pollDiv.prepend(pollLink);  // Add the link to the beginning of the poll container.
    pollDiv.prepend(pollAuthor);  // Add the author before the poll title.

    // Handle comments section if there are any comments (kids array).
    if (poll.kids) {
        pollComment.textContent = poll.kids.length === 1 ? `${poll.kids.length} Comment` : `${poll.kids.length} Comments`;
        pollDiv.append(pollComment);  // Add comment button to the poll.
        pollComment.className = 'btn';  // Style the comment button.
        
        // Add an event listener to load comments when the button is clicked.
        pollComment.addEventListener('click', () => {
            handleComments(poll.kids);  // Function to handle and display comments.
        }, { once: true });  // Event listener fires only once.
    }

    // Append the fully constructed pollDiv to the main container.
    container.append(pollDiv);
};

// This function handles fetching and displaying a set of polls.
const handlePolls = () => {
    // Select and remove any existing polls from the main container.
    let notIncluded = document.querySelectorAll('.main-container-class div');
    notIncluded.forEach((element) => {
        element.remove();  // Remove each poll element to refresh the display.
    });

    // Array of specific poll IDs to be fetched from the Hacker News API.
    const polls = [31891675, 31869104, 31788898, 31780911, 31716715, 31598236, 31587976];

    // Fetch the details for each poll ID in the array.
    const getPollsData = async (polls) => {
        // Fetch all poll data in parallel using Promise.all and map.
        const showPolls = await Promise.all(
            polls.map((newPollId) =>
                // Fetch each poll's data from the API and convert it to JSON.
                fetch(`https://hacker-news.firebaseio.com/v0/item/${newPollId}.json?print=pretty`)
                    .then((showItem) => showItem.json())
            )
        );
        // Return the fetched poll data.
        return showPolls;
    };

    // Call getPollsData and once the data is fetched, display each poll.
    getPollsData(polls).then((newPolls) => {
        newPolls.forEach((poll, index) => {
            displayPoll(poll, index);  // Function to display each poll with its index.
        });
    });
};
// Function to handle the display of more stories when a button is clicked.
const handleMore = () => {
    // Select all elements with the class 'story-div-class' and convert the NodeList to an array.
    const stories = [...document.querySelectorAll('.story-div-class')];
    
    // Iterate over the stories to find the first visible story that is followed by a hidden story.
    stories.some((story, i, arr) => {
        // Check if the current story is not hidden and the next story is hidden.
        if (!story.classList.contains('hide') && arr[i + 1]?.classList.contains('hide')) {
            // Unhide the next 10 stories or until the end of the array.
            for (let j = i + 1; j <= i + 10 && arr[j]; j++) {
                arr[j].classList.remove('hide');
                // Hide the 'show more' button if there are no more stories to display.
                if (!arr[j + 1]) {
                    document.querySelector('.show-more').classList.add('hide');
                }
            }
            return true; // Stop iterating once we find the first visible story followed by hidden stories.
        }
        return false; // Continue to the next story.
    });
};
let inMaxId;
let currMaxId;

// Function to fetch the maximum item ID from the Hacker News API periodically.
const fetchMaxId = () => {
    fetch('https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty')
        .then((response) => response.json())  // Convert the response to JSON.
        .then((maxId) => {
            // Store the initial max ID and the current max ID for comparison.
            if (inMaxId === undefined) {
                inMaxId = maxId;
            } else {
                currMaxId = maxId;
            }

            // If both IDs are set and different, indicate new items are available.
            if (inMaxId && currMaxId && inMaxId !== currMaxId) {
                const newIdElement = document.querySelector('.new');
                newIdElement.style.background = '#f73458'; // Change background color to indicate new items.
            }

            // Schedule the next fetch after 5 seconds.
            setTimeout(() => fetchMaxId(), 5000);
        });
};
// Function to handle and display new items between the max ID values.
const handleNew = () => {
    // Remove existing items from the main container.
    document.querySelectorAll('.main-container-class div').forEach((element) => {
        element.remove();
    });

    // Generate an array of new item IDs between the previous and current max IDs.
    const newItems = [];
    for (let i = inMaxId; i <= currMaxId; i++) {
        newItems.unshift(i);
    }

    // Function to fetch data for new items.
    const getItemsData = async (itemIds) => {
        const itemsData = await Promise.all(
            itemIds.map((itemId) =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`)
                    .then((response) => response.json())
            )
        );
        return itemsData;
    };

    // Fetch and display new items.
    getItemsData(newItems).then((items) => {
        items.forEach((item) => {
            // Skip items that are not valid or are deleted.
            if (!item.type || item.dead || item.deleted) {
                return;
            }
            // Display the item based on its type.
            if (item.type === 'story' || item.type === 'job') {
                displayData(item);
            } else if (item.type === 'poll') {
                displayPoll(item);
            } else if (item.type === 'comment') {
                displayComments(item);
            } else {
                console.log(item); // Log any unexpected item types.
            }
        });
    });

    // Update the max ID to the current max ID and reset the 'new' indicator.
    inMaxId = currMaxId;
    const newIdElement = document.querySelector('.new');
    newIdElement.style.background = 'buttonface'; // Reset background color.
};
// Function to fetch and display job stories.
const handleJobs = () => {
    // Remove existing items from the main container.
    document.querySelectorAll('.main-container-class div').forEach((element) => {
        element.remove();
    });

    // Function to fetch job stories data.
    const getStoriesData = async () => {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/jobstories.json?print=pretty');
        const storyIds = await response.json();
        
        // Sort story IDs in descending order.
        const sortedIds = [...storyIds].sort((a, b) => b - a);

        // Fetch details for each job story.
        const storiesData = await Promise.all(
            sortedIds.map((storyId) =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`)
                    .then((response) => response.json())
            )
        );
        return storiesData;
    };

    // Fetch and display job stories.
    getStoriesData().then((stories) => {
        stories.forEach((story, index) => {
            console.log(story); // Log each story for debugging.
            displayData(story, index);
        });
    });
};
// Select buttons for different actions.
const storiesBtn = document.querySelector('.stories');
const jobsBtn = document.querySelector('.jobs');
const pollsBtn = document.querySelector('.polls');

// Add event listeners to buttons with throttling to limit the frequency of function calls.
storiesBtn.addEventListener('click', throttle(handleStories, 5000));
jobsBtn.addEventListener('click', throttle(handleJobs, 5000));
pollsBtn.addEventListener('click', throttle(handlePolls, 5000));

