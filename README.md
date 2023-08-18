# Innoscripta-Task

## Documentation About My Project

Hello, I am Mert Yılmaz.

Below you will find detailed information about the project I created for this FullStack web development task.

------------

### Overview:
- Despite my intense 9-6 work schedule, I still managed to complete the project.
- The project consists of two main parts: Backend (Laravel) and Frontend (React.js).

### API Connections:
- I have connected to a total of 3 different APIs, namely NewsAPI, The Guardian, and BBC News.
- Data fetched from these APIs is saved to the database by a cronjob that runs at specified intervals (every 12 hours).

### Database and Optimization:
- Users are provided with a personalized news feed based on the data retrieved from the database. To optimize the execution speed of PHP within the Docker environment, I moved the vendor directory to srv. Additionally, I deactivated xdebug to speed up the debugging processes.

### Docker and Deployment:
- Both projects were containerized using Docker, ensuring they are easily portable and reusable.

- The project can be started effortlessly, requiring no extra configuration. Simply use the command docker-compose up --build.
Migration processes are carried out automatically, eliminating the need for manual intervention.

### Design and Mobile Compatibility:
- This design adequately meets all criteria for the project.
- The project is tailored to be displayed seamlessly and user-friendly on mobile devices.

- Software Development Principles:
During the development process, coding was done adhering to software development principles such as DRY (Don't Repeat Yourself), KISS (Keep It Simple, Stupid), and SOLID (Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion).

Laravel's Performance in Docker:
- A noteworthy point about this project is the optimization concerning Laravel's performance in Docker. The primary reason behind Laravel's relatively slower performance in Docker is due to PHP's request model, combined with the latency when transferring data between Docker Desktop's Linux VM and the host MacOS machine.

- To maintain Docker's performance, it's crucial to minimize traversing between Docker Desktop's Linux VM and the host machine. An effective method for this is to store the Composer's vendor/ directory inside the Docker container rather than in the mounted project directory. This step has been implemented in our project to ensure optimal performance.

-----------------

This documentation provides a general summary of my project. For further detailed information or any queries, 
please feel free to contact me. Thank you for your attention.

## Filtering Data

![image](./documantation/Screenshot%202023-08-18%20215944.png)

## Click follow icon to follow a author, source and category this will be shown in the news feed

![image](./documantation/Screenshot%202023-08-18%20220024.png)

## Click x icon to unfollow a author, source and category this will be shown in the news feed

![image](./documantation/Screenshot%202023-08-18%20220134.png)
