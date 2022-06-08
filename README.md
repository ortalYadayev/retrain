# Retrain Entry Level Exam

Hi there!  
In this exam you will extend and add new features to a simplified ticketing system.
The task's main purpose is to test your ability to learn new topics and deliver high quality digital products. It combines building UI components and a touch of server development as well.

While no previous background is required to complete this task or to apply to this position, we do recommend getting to a basic level on the following subjects:
- JavaScript
- HTML & CSS
- React
- Node js

## Getting Started
1. Make sure you have *Node.js* 16 or higher and *npm* 8 or higher installed
2. Install the project dependencies by running `npm install` from the project's directory (using a terminal)
3. Run the project by running `npm start`. This runs both the server and the client.
4. Notice this project uses lerna to manage the packages inside this monorepo. If you need to add dependencies please use `lerna add <pkg> <server|client>` command.

You should now have the development version running on your computer and accessible via http://localhost:3000

## Tasks

The exam is split into 3 parts. The first part is about adding UI functionality. The second part goes a bit broader into the client-server integration and business logic.
The third part is about testing and good practices. 

### Part 1 - Ticket item improvements

##### 1a.
Our tickets list is only showing the title. Make it show the content as well.

##### 1b.
Some agents can't answer all tickets, and want an option to hide some.
Add a hide button that will hide a ticket from the view. The button should appear when hovering the ticket. Make sure there is an option to restore all hidden tickets as well.
use "Hide" and "Restore" for those buttons respectively.


##### 1c. Agents use this system all day, white can be quite a tiring color on the eyes 😫.

1.Add a "dark mode" button or clickable text that will change the background of the UI to `black` and the basic font of the outline to `white`.
2.When the "dark mode" is enabled let the user revert it with a button or clickable text that will change the background of the UI to `white` and the basic font of the outline to `black`. use "dark mode" and "light mode" as the text for those different button states. 

### Part 2 - List functionality

## 2a. 
It's pretty common that we need to clone tickets in our system.

1.Add a clone button or text, in the client.
2.Add a clone method in the API and server and add an in memory item to the collection
3.Connect your client side "clone" button to that API call


## 2b.
We're showing only 20 tickets but agents can swear there are more. Solve this problem.  
**Keep in mind the number of tickets is planned to grow exponentially very soon so make sure to think of a proper solution.**


## 2c
Add support in the client side for fix you did in task 2b. 


## Part 3 - Tests
choose 1-2 of the features you implemented, and write a tests for them. Can be either server or client.
### Part 3b (**bonus**) - more tests
as a bonus task, whatever test you wrote in the previous task, write another one in a different methodology. For example, if you did a server test, write a test for the client. Or if you did a unit test, do an integration test. 

For all tests, it's important that tests won't affect "production" data. 

### Some help regarding server tests
If you write tests for server, you need to handle the db in your tests somehow. It's up to you on how to exactly handle it, it can be mocks/stubs/spies, or you can use in-memory db, whatever you prefer and what you feel is more suitable for your test. 

To connect using knex to an in memory db, this code can be used. (It's up to you to make sure the correct setting arrives is used when testing.)

  `const knex = Knex({
    client: 'sqlite3',
    connection: ":memory:",
  });`
## General notes
- The entire task should take around 5 hours. The task is meant most of all to give us something to talk about in the interview. Bonus tasks are ** really ** bonus, it will just give us a larger sample size. If you already spent 5 hours on the task, you can stop. Quality > Quantity

- Test your work well. Think of edge cases. Think of how users will use it, and make sure your work is of high quality
- Stick to the best practices of the libraries used as much as possible
- This task involves both client and server code, in the end you should have touched both areas. If you haven't - you probably are not covering all our requirements.
- If you have any questions regarding the task itself or its environment, feel free to ask us. For general coding / technology questions, please consult stack overflow, forums and other sources of your choice.


## Submitting

1. Replace `yours@email.com` with your real email address in the `meta.txt` file.
2. Delete any `node_modules` directory from the project.
3. Zip the root directory (`entry-level-exam`) to a file called `entry-level-exam_{yourname}.zip` and send it back to us.
4. You can describe your extra touch (part 3), and any general notes you may have.
   Can be anything from challenges to something you feel was not done perfect,
   to something you're specially proud of.

good luck!
