const browserObject = require('./browser');
const scraperController = require('./pageController');
const { v4: uuidv4 } = require('uuid')
const timeout = require('connect-timeout')
const express = require('express')
const app = express()
const PORT = 4000

app.use(timeout('60s'))
app.use(express.json())
app.use(haltOnTimedout)

function haltOnTimedout(req, res, next) {
  if (!req.timedout) return next()
}

app.use((err, req, res, next) => {
  if (err.status === 503) {
    res.status(503).send('Request timeout');
  } else {
    next(err);
  }
});

app.post('/', async (req, res) => {
  const link = req.body.link
  if (!link)
    return res.status(400).json({
      status: false,
      message: 'link is empty',
      results: ''
    })

  try {
    //Start the browser and create a browser instance
    const browserInstance = await browserObject.startBrowser();
    // Pass the browser instance to the scraper controller
    const data = await scraperController(browserInstance, link)

    return res.status(200).json({
      status: true,
      message: 'success',
      results: {
        links: data.data,
        source: "FB-Vid",
        thumbnail: data.img,
        title: `Facebook Video${uuidv4()}`
      }
    })
  }
  catch (error) {
    console.log(error)
    res.status(500).json({
      status: false,
      message: error,
      results: ''
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`)
})