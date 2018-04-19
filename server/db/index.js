const chalk = require('chalk');
const Sequelize = require('sequelize');
const pkg = require('../../package.json');

console.log(chalk.yellow('Opening dataBase now'));

module.exports = new Sequelize(`postgres://localhost:5432/${pkg.name}`,{
    logging: false
});