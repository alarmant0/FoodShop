const http = require('http');
const url = require('url');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'db_orders',
  host: 'database2',
  database: 'orders_database',
  password: 'randompassword',
  port: 5432,
});

const server = http.createServer((req, res) => {

  //setting CORS headers to allow the frontend to reach enpoints
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  //handling OPTIONS request for preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }


  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === '/orders') {
    const action = query.action;
    if (action === 'delete') {
        const orderId = parseInt(query.id);

        if (isNaN(orderId)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid order ID');
            return;
        }

        pool.query('DELETE FROM orders WHERE order_id = $1', [orderId], (error, result) => {
            if (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            if (result.rowCount === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`Order with ID ${orderId} not found`);
                return;
            }

            pool.query('UPDATE orders SET order_id = order_id - 1 WHERE order_id > $1', [orderId], (updateError) => {
                if (updateError) {
                    console.error(updateError);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(`Order with ID ${orderId} deleted successfully`);
                }
            });
        });
    } else if (action === 'print') {
      pool.query('SELECT * FROM orders', (error, results) => {
        if (error) {
          console.error(error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(results.rows));
        }
      });
    } else if (action === 'add') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const content = data.content;
          const price = parseFloat(data.price);

          if (isNaN(price) || !Array.isArray(content)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid price or content');
          } else {
              pool.query('INSERT INTO orders (order_id, order_content, total_price) VALUES ((SELECT COALESCE(MAX(order_id), 0) + 1 FROM orders), $1, $2)', [JSON.stringify(content), price], (error) => {
              if (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
              } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Order added successfully');
              }
            });
          }
        } catch (error) {
          console.error(error);
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid request body');
        }
      });
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid action. Available actions: print, add, delete');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Working! Use /orders?action=help to display actions!');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

