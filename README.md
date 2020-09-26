#My attempt at recreating the Expressjs framework
(Without deep knowledge of Expressjs)

##How to Use
###Prerequisites
- Nodejs installed on your PC
- Basic knowledge of js

###Creating A Server
```
const server = require('./expressjs-clone/app.js');
const app = server.App();

app.listen(8000, () => {
  console.log('Listening to requests on localhost:8000');
})
```
And there you have it!. A simple http server up and running.

###Creating Routes
####GET
```
app.get('/path', middleware[optional], (req,res) => {
  res.statusCode = 200;
  res.json({
    message: "Hello World",
    id: 92D08S
  })
})
```
^The MiddleWare used here is a Route Level MiddleWare;

**Other Route Methods: POST, PUT, DELETE (All follow the same format)**


###MiddleWares
Middlewares (just like in expressjs) can be used to modify the request/response objects before they are passed down to Route Level callbacks;

Using Custom Middlewares:
```
app.use((req,res,next) => {
  req.ID = Math.random() * 1000000;
  next();
})
```