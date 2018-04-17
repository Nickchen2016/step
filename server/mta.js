var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');

var requestSettings = {
  method: 'GET',
  url: ' http://datamine.mta.info/mta_esi.php?key=7b99a964d1e99eda248f749b773051d8&feed_id=16',
  encoding: null
};

var mta = request(requestSettings, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var feed = GtfsRealtimeBindings.FeedMessage.decode(body);
    feed.entity.forEach(function(entity) {
      if (entity.trip_update) {
        console.log(entity.trip_update);
        return entity.trip_update;
      }
    });
  }
});

// module.exports = mta;

// var Mta = require('mta-gtfs');
// var mta = new Mta({
//   key: '7b99a964d1e99eda248f749b773051d8', // only needed for mta.schedule() method
//   feed_id: 1                  // optional, default = 1
// });

// mta.schedule(613, 1).then(function (result) {
//     console.log(result);
//   });

//   mta.stop(635).then(function (result) {
//     console.log(result);
//   });
// mta.status('subway').then(function (result) {
//     console.log(result);
//   });