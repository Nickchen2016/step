const db = require('../index');
const Day = require('./Day');
const Month = require('./Month');


Day.belongsTo(Month);
Month.hasMany(Day);

module.exports = {
    db,
    Day,
    Month
};