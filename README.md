# Mailchimp-Newsletter-Microservice
This is my first experiment with Microservices in Node. This service allows you to add newsletter subscribers to your mailchimp account. All of the coommunication is done through a simple CRUD API.
<h2>How to Setup:</h2>
<ul>
  <li>Clone this repository.</li>
  <li>Open a Terminal in the destination folder and run "npm install".</li>
  <li>Run "npm app" to start the server.</li>
</ul>

<h2>How to Use:</h2>
You can either host this service and make http requests to it or if you have anything else in mind, surely use that.
Here is a list of the available requests and the methods of making them.<br>
First of all You need to make a GET request with your api information. The request should have a JSON object at the end. See example for details.

<ul>
  <li style="list-style-type: none">GET Request: (domain)/{"API_KEY":"Your mailchimp api key", "PREFIX":"server prefix"}</li>
  <li>The request needs to be exactly this. Just put your api key and server prefix.</li>
</ul>

Now you can make POST requests to add entries to your audience.

To add an entry through json:<br>
(domain)/json/{"firstName":"FName", "lastName":"LName", "email":"Valid Email", "listID":"audienceID"}

To add an entry through request body:<br>
(domain)/

<h2>Future Plans</h2>
I am planning to make a new Microservice each week. At the end I intend to connect these services in a couple of web applications. I am planning to continue this process until I am fluent with the Microservice Architecture.
