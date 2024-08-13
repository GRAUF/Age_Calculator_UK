#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
const spinner = ora('Calculating your age...');
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
// Function to calculate the age
const calculateAge = (day, month, year) => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageDays = today.getDate() - birthDate.getDate();
    if (ageDays < 0) {
        ageMonths--;
        ageDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
    }
    return { years: ageYears, months: ageMonths, days: ageDays };
};
// Function to display data in a table format
const displayTable = (day, month, year, age) => {
    const table = new Table({
        head: [chalk.blueBright('Detail'), chalk.blueBright('Value')],
        colWidths: [20, 30]
    });
    table.push([chalk.green('Day of Birth'), chalk.yellow(day.toString())], [chalk.green('Month of Birth'), chalk.yellow(months[month - 1])], [chalk.green('Year of Birth'), chalk.yellow(year.toString())], [chalk.green('Age in Years'), chalk.yellow(age.years.toString())], [chalk.green('Age in Months'), chalk.yellow(age.months.toString())], [chalk.green('Age in Days'), chalk.yellow(age.days.toString())]);
    console.log(table.toString());
};
// Function to ask user questions
const askQuestions = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'day',
            message: 'Enter your birth day (1-31):',
            validate: (input) => {
                const day = parseInt(input);
                return day > 0 && day <= 31 ? true : 'Please enter a valid day';
            }
        },
        {
            type: 'input',
            name: 'month',
            message: 'Enter your birth month (1-12):',
            validate: (input) => {
                const month = parseInt(input);
                return month > 0 && month <= 12 ? true : 'Please enter a valid month';
            }
        },
        {
            type: 'input',
            name: 'year',
            message: 'Enter your birth year:',
            validate: (input) => {
                const year = parseInt(input);
                return year > 1900 && year <= new Date().getFullYear() ? true : 'Please enter a valid year';
            }
        }
    ]);
    return {
        Name: parseInt(answers.Name),
        day: parseInt(answers.day),
        month: parseInt(answers.month),
        year: parseInt(answers.year)
    };
};
// Main function to execute the age calculation
const main = async () => {
    let continueFlag = true;
    while (continueFlag) {
        const { day, month, year } = await askQuestions();
        spinner.start();
        const age = calculateAge(day, month, year);
        spinner.succeed('Age calculated successfully!');
        console.log(chalk.cyan.bold('\nYour Age Details:\n'));
        displayTable(day, month, year, age);
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do next?',
                choices: ['Calculate Again', 'Exit'],
                default: 'Exit'
            }
        ]);
        continueFlag = choice === 'Calculate Again';
        if (choice === 'Exit') {
            console.log(chalk.magentaBright.bold('\nThank you for using the Age Calculator!'));
            const exitTable = new Table({
                head: [chalk.blueBright('Summary')],
                colWidths: [50]
            });
            exitTable.push([chalk.green(`Your Date of Birth: ${day} ${months[month - 1]} ${year}`)], [chalk.green(`Your Age: ${age.years} Years, ${age.months} Months, ${age.days} Days`)]);
            console.log(exitTable.toString());
        }
    }
};
main();
