const chalk = require('chalk');
const Sequelize = require('sequelize');
const pkg = require('../../package.json');

console.log(chalk.yellow('Opening dataBase now'));

// module.exports = new Sequelize(`postgres://localhost:5432/${pkg.name}`);
const db = new Sequelize(`postgres://localhost:5432/${pkg.name}`);

const Day = db.define('day',{
        steps:{
            type:Sequelize.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        miles:{
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        }
    })

const Month = db.define('month',{
        monthName:{
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        totalSteps:{
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        totalMiles:{
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });

    Day.belongsTo(Month);
    Month.hasMany(Day);

    module.exports = {
        Day,
        Month
    }