const server = require('./app');
const app = new server.App();

app.get('/', (req, res) => {
  res.send("Hello");
})


app.get('/product/:id', (req,res) => {
  res.json({
    message: "Your Product",
    id: req.params.id
  })
})

app.get('/products/', (req, res) => {
  res.json("Hello")
})

app.post('/products/', (req, res) => {
  res.send("Helloooo");
})


app.listen(8000, () => {
  console.log("Server running at PORT: 8000");
})