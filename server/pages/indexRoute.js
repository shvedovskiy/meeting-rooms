module.exports.index = (req, res) => {
  res.send(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Meeting Rooms</title>
        <script src="/scripts/test.js"></script>
      </head>
      <body>
        <h1>Hello</h1>
      </body>
    </html>
  `);
};
