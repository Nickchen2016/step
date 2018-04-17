const express = require('express');
// var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
// var request = require('request');

// var requestSettings = {
//     method: 'GET',
//     url: ' http://datamine.mta.info/mta_esi.php?key=7b99a964d1e99eda248f749b773051d8&feed_id=16',
//     encoding: null
//   };

// module.exports = mta;

var Mta = require('mta-gtfs');
var mta = new Mta({
  key: '7b99a964d1e99eda248f749b773051d8', // only needed for mta.schedule() method
  feed_id: 1                  // optional, default = 1
});

const app = express();
const port = process.env.PORT || 5000;
// console.log(process.env);


app.get('/', (req, res) => {
  res.send('Hello From Express' );
});


// app.get('/mta', function(req, res){
//     request(requestSettings, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//           var feed = GtfsRealtimeBindings.FeedMessage.decode(body);
//           res.send(feed)
//         //   feed.entity.forEach(function(entity) {
//         //     if (entity.trip_update) {
//         //       res.send(entity.trip_update);
//         //     }
//         //   })
//         }
//       })
//   });


app.get('/mtab', function(req, res){
    mta.schedule('N08',16).then(function (result) {
    res.send(result)
  });

  // mta.stop().then(function (result) {
  //   res.send(result);
  // });

// mta.status('subway').then(function (result) {
//     res.send(result);
//   });
  });



app.listen(port, () => console.log(`Listening on port ${port}`));

