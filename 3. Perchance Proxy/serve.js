// serve.js
const express = require("express");
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();
const PORT = 3000;

// Simple homepage with instructions
app.get("/", (req, res) => {
  res.send(`
    <div style="font-family: monospace; line-height: 1.4rem;">
      <div>
        Use <span style="background: #e5e5e5;padding: 0.25rem;">
          <a style="text-decoration:none; color:inherit;" href="http://localhost:${PORT}/api?generator=animal-sentence&list=output">
            http://localhost:${PORT}/api?generator=<span style="background:#ffd04a;">animal-sentence</span>&amp;list=<span style="background:#ffd04a;">output</span>
          </a>
        </span> to generate some text.
        <br>Loading a new generator for the first time will take several seconds, but after that it will be cached and you should be able to generate results quickly.
      </div>
    </div>
  `);
});

// Generator caching
let generatorWindows = {};
let lastGeneratorUseTimes = {};
const maxNumberOfGeneratorsCached = 50;

// Helper to load and cache a generator
async function makeGeneratorWindow(generatorName) {
  const html = await fetch(`https://perchance.org/api/downloadGenerator?generatorName=${generatorName}&__cacheBust=${Math.random()}`).then(r => r.text());
  const { window } = new JSDOM(html, { runScripts: "dangerously" });
  return window;
}

// API endpoint for generator requests
app.get("/api", async (req, res) => {
  const generatorName = req.query.generator;
  const listName = req.query.list;

  if (!generatorName || !listName) {
    return res.status(400).send("Missing 'generator' or 'list' query parameter.");
  }

  // ... (load/caching code)

  const root = generatorWindows[generatorName].root;
  if (!root || !root[listName]) {
    return res.status(400).send(`The generator does not have a list or variable named "${listName}".`);
  }

  try {
    const result = root[listName].toString();
    res.send(result);
  } catch (err) {
    res.status(500).send(`Error generating result: ${err.message}`);
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Perchance proxy server running at http://localhost:${PORT}/`);
});
