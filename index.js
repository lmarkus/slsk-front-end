const express = require('express');
const { spawn } = require('child_process');
const {body, query, matchedData, validationResult } = require('express-validator');
const app = express()
const port = 3000

app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
  res.send(`
    <html>
        <body>
            <form action="/" method="POST">
                <input type="text" name="link"></input>
                <input value="Download" type="submit">
            </form>
        </body>
    </html>
    `);
})

app.get('/a',handle);

app.post('/', body("link").notEmpty().escape(), (req,res) =>{

    const result = validationResult(req);
  if (result.isEmpty()) {
    return handle(req,res);
  }

  return res.send({ errors: result.array() });


});


function handle(req,res){


        // Force disable buffering
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked'
          });

        /*/ Set headers for streaming
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');
//*/

        try {
            // Spawn the external process
            // Replace 'your-program' with the actual program name
        // Spawn a shell process
        // Using 'shell' option to properly handle shell scripts
        const ssk = spawn('sh', ['./ssk.sh', req.body.link], {
            shell: true,
            env: {
               // ...process.env,
               // LINK_PARAM: link
            }
        });
        // Stream stdout to response
        ssk.stdout.on('data', (data) => {
            res.write(data);
        });

        // Handle stderr
        ssk.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
            // Optionally stream stderr to client as well
            res.write(`Error: ${data}\n`);
        });

        // Handle process completion
        ssk.on('close', (code) => {
            console.log(`Shell script exited with code ${code}`);
            if (code !== 0) {
                res.write(`Script exited with code ${code}\n`);
            }
            res.end();
        });

        // Handle process errors
        ssk.on('error', (err) => {
            console.error('Failed to start shell script:', err);
            res.status(500).end(`Process error: ${err.message}`);
        });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).end(`Server error: ${error.message}`);
        }
      return res.write(`Received` + JSON.stringify(req.body))
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
