# HackerNews API UI

_Project Objective_

Technology evolves rapidly, and keeping up-to-date as a programmer can be challenging. Tech news platforms like Hacker News provide an excellent way to stay informed about the latest advancements, tech jobs, and much more. However, some websites lack a user-friendly interface, making it harder to consume their content.

The objective of this project is to build a user interface (UI) for the HackerNews API that presents stories, jobs, polls, and comments in a more accessible and engaging way.
Features

#### The UI will handle the following core functionalities:

1. Posts

    Stories: Retrieve and display the latest stories from HackerNews.
    Jobs: Show available job postings.
    Polls: Display polls with their respective results and options.

2. Comments

    Display comments associated with each post.
    Ensure that each comment is linked to its parent post.
    Comments must be ordered by the newest to oldest.

3. Pagination and Lazy Loading

    Posts should not be loaded all at once.
    Posts are loaded dynamically as the user scrolls or requests more content, using event-driven loading.

4. Live Data Updates

    The UI must keep users updated with live data.
    Automatically notify users of new posts or comments at least every 5 seconds, when new data is available.

5. Performance Optimization

To ensure we avoid overloading the HackerNews API (even though it currently has no rate limit), we’ll implement:
- Throttling/Debouncing: Limit the number of API requests made in a short time period.
- Code Optimization: Reduce unnecessary requests to the API.

#### Optional Features

1. Nested Comments

    Handle sub-comments for stories, jobs, and polls, allowing users to view nested comment threads.

#### Technology Stack

This project will leverage the following technologies:

- *`Frontend:`* HTML, CSS, JavaScript (or any modern framework/library like React, Vue, Angular)
- *`API:`* HackerNews API
- *`Live Updates:`*  WebSockets or polling mechanism to notify users of real-time changes.

### How to Use the Project

1. Clone the repository

```bash
git clone https://learn.zone01kisumu.ke/git/barraotieno/clonernews
cd clonernews
```

2. Install dependencies

Make sure you have the necessary dependencies installed. If you're using a JavaScript framework like React, you might use npm or yarn.

```bash
npm install
```

3. Run the project

Start the project by running the development server:

```bash
npm start
```

4. Open the application

Navigate to http://localhost:3000 in your browser to interact with the HackerNews UI.

#### Development Guidelines

* Load posts dynamically as users scroll or interact with the page to improve performance and user experience.
* Notify users of new data at regular intervals (every 5 seconds).
* Use event-driven loading to load more posts when the user scrolls to the bottom or requests more content.
* Optimize API requests by eliminating unnecessary calls and using throttling/debouncing techniques.
* Ensure that the user experience is smooth and responsive, without overloading the HackerNews API.

#### Contributing

Feel free to fork the repository and make pull requests with improvements, bug fixes, or additional features (e.g., handling nested comments). Please follow best practices for code structure and formatting.

#### License

This project is licensed under the MIT License.

#### Authors
- [Ray Muiruri](https://github.com/rayinzhagijones)
- [Barrack Otieno](https://github.com/Baraq23)
- [Allan Kamau]()

#### Contact

For questions or suggestions, feel free to contact the project maintainers mensioned above.
