var express = require('express');
var router = express.Router();
const axios=require('axios')
const { createEventAdapter } = require('@slack/events-api');
const slackSigningSecret = "c6591ee94afa784c9d71a784d29047e8";
const slackEvents = createEventAdapter(slackSigningSecret);
/* GET home page. */
const port = 3000
router.use('/slack/events', slackEvents.expressMiddleware());
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
slackEvents.on('message',async (event)=>{
  const res = await axios.post('https://slack.com/api/chat.postMessage',
    channel=event.channel,
    text='Hello, World!')
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

slackEvents.on('member_joined_channel',(event)=>{
  console.log(`New Member user ${event.user} in channel ${event.channel}`);
});

slackEvents.on('app_mention',(event)=>{
  console.log(`user ${event.user} in channel ${event.channel} mentioned you`);
});



slackEvents.on('error', console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  // Listening on path '/slack/events' by default
  console.log(`server listening on port ${port}`);
});


/*router.post('/slack/events', function(req, res, next) {
  console.log(req.body.type)
  switch (req.body.type) {
    case 'url_verification': {
      // verify Events API endpoint by returning challenge if present
      res.send({ challenge: req.body.challenge });
      break;
    }
  }
})*/
router.get('/', function(req, res) {
  res.send('Ngrok is working! Path Hit: ' + req.url);
});








  
module.exports = router;
