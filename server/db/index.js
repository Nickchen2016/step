const chalk = require('chalk');
const Sequelize = require('sequelize');
const pkg = require('../../package.json');

console.log(chalk.yellow('Opening dataBase now'));

// module.exports = new Sequelize(`postgres://localhost:5432/${pkg.name}`);
const db = new Sequelize(`postgres://localhost:5432/${pkg.name}`);

const Day = db.define('day',{
        weekName:{
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        steps:{
            type:Sequelize.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        }
    })

const Week = db.define('week',{
        totalSteps:{
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });

    Day.belongsTo(Week);
    Week.hasMany(Day, {onDelete:'CASCADE', hooks: true});

    module.exports = {
        Day,
        Week
    }