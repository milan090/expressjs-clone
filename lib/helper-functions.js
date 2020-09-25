function createResponse(res){
  res.send = msg => res.end(msg);
  res.json = msg => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(msg));
  };
  res.html = msg => {
    res.setHeader('Content-Type',"text/html");
    res.end(msg);
  };
  return res;
}

module.exports = createResponse;