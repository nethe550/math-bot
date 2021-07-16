/*
* MathBot
*   a discord bot capable of a variety of mathematical operations,
*   implemented in Node.js and discord.js
*
* Author: nethe550
* Version: <check config.json>
*/

class Utils {
    // error handling
    static invalidSyntax(msg) {
        msg.channel.send(`Invalid syntax. See ${config.prefix}help for help.`);
    }

    static isNumber(n) {
        if (n == 0) return true;
        if (n % 1 === 0) return true;
        if (Number(n) === n && n % 1 !== 0) return true;
        if (n == null) return true; // support nullvalue
        return false;
    }

    static isOperator(o) {
        switch (o) {
            // mathematical operators
            case '+':
            case '-':
            case '*':
            case 'x':
            case '/':
            case '%':
            case '**':
            // bitwise operators
            case '&':
            case '|':
            case '^':
            case '<<':
            case '>>':
            case '>>>':
            // comparison operators
            case '==':
            case '!=':
            case '>':
            case '<':
            case '>=':
            case '<=':
                return true;
            default:
                return false;
        }
    }

    // equation

    static getExpression(args) {
        return [
            Utils.isNumber(args[1]) ? args[1] : '',
            Utils.isOperator(args[2]) ? args[2] : '',
            Utils.isNumber(args[3]) ? args[3] : ''
        ];
    }

    static validExpression(e) {
        for (let a in e) {
            if (e[a] === '') {
                return false;
            }
        }
        return true;
    }

    // triginometry

    static getLegLengths(args) {
        return [
            Utils.isNumber(args[1]) ? args[1] : '',
            Utils.isNumber(args[2]) ? args[2] : ''
        ];
    }

    static validLegLengths(l) {
        for (let a in l) {
            if (l[a] === '') {
                return false;
            }
        }
        return true;
    }

    static getTheta(args) {
        return Utils.isNumber(args[1]) ? args[1] : '';
    }
}


const discord = require('discord.js');
const config = require('./config.json');

const client = new discord.Client();

client.on('ready', () => {
    console.log(`MathBot v${config.version}`);
    console.log(`Logged in as ${client.user.tag}.`);
});

client.on('message', (msg) => {
    if (msg.author.bot) return; // ignore other bots

    let args = msg.content.split(' '); // split msg into args
    if (!args[0].indexOf(config.prefix) == 0) return; // ignore msgs without prefix

    let command = args[0].replace(config.prefix, ''); // get command without prefix

    switch (command) {
        case 'help':
        case 'h':
            var embed = {
                title: `MathBot v${config.version}`,
                createdAt: new Date(),
                timestamp: new Date(),
                type: "rich",
                url: "https://github.com/nethe550/math-bot",
                author: client.user.tag,
                description: "A math bot.",
                fields: [
                    {
                        name: "Operations:",
                        value: `\`${config.prefix}operation <num1> <operator> <num2>\`
                                Aliases: \`[comparison, o, e, c]\``
                    },
                    {
                        name: "Hypotenuse of a Right Triangle:",
                        value: `\`${config.prefix}hypotenuse <leg1> <leg2>\`
                                Aliases: \`[hy]\``
                    },
                    {
                        name: "Sine of Theta:",
                        value: `\`${config.prefix}sine <theta in radians> [inverse]\`
                                Aliases: \`[sin]\``
                    },
                    {
                        name: "Cosine of Theta:",
                        value: `\`${config.prefix}cosine <theta in radians> [inverse]\`
                                Aliases: \`[cos]\``
                    },
                    {
                        name: "Tangent of Theta:",
                        value: `\`${config.prefix}tangent <theta in radians> [inverse]\`
                                Aliases: \`[tan]\``
                    },
                    {
                        name: "Radians to Degrees:",
                        value: `\`${config.prefix}rad2deg <radians>\`
                                Aliases: \`[r2d]\``
                    },
                    {
                        name: "Degrees to Radians:",
                        value: `\`${config.prefix}deg2rad <degrees>\`
                                Aliases: \`[d2r]\``
                    },
                    {
                        name: "Quadratic Solver:",
                        value: `\`${config.prefix}quadratic <a> <b> <c>\`
                                Aliases: \`[q]\``
                    }
                ],
                footer: {
                    text: `version ${config.version} | developed by nethe550`
                }
            };
            embed = new discord.MessageEmbed(embed);
            embed.setColor('RANDOM');
            msg.channel.send(embed);
            break;

        // === expression evaluations ===
        case 'operation':
        case 'compare':
        case 'o':
        case 'e':
        case 'c':
            // prevent eval() exploitation with checks
            var equation = Utils.getExpression(args);
            
            if (Utils.validExpression(equation)) {
                equation = equation.join(' ');
                msg.channel.send(eval(equation));
            }
            else {
                Utils.invalidSyntax(msg);
            }
            break;

        // === trigonometry ===
        case 'hypotenuse':
        case 'hy':
            var leg_lengths = Utils.getLegLengths(args);

            if (Utils.validLegLengths(leg_lengths)) {
                var hypotenuse = Math.sqrt((leg_lengths[0] ** 2) + (leg_lengths[1] ** 2));
                msg.channel.send(`The hypotenuse of a right triangle with side lengths of ${leg_lengths[0]} and ${leg_lengths[1]} is ${hypotenuse}.`);
            }
            else {
                Utils.invalidSyntax(msg);
            }
            break;
        
        case 'sine':
        case 'sin':
            var theta = Utils.getTheta(args);
            var inverse = args[2] === 'inverse' ? true : false;
            if (theta != '') {
                if (inverse) {
                    var asin = Math.asin(theta);
                    msg.channel.send(`The arc-sine of ${theta}rad is ${asin}.`);
                }
                else {
                    var sin = Math.sin(theta);
                    msg.channel.send(`The sine of ${theta}rad is ${sin}.`);
                }
            }
            else {
                Utils.invalidSyntax(msg);
            }
            break;
        
        case 'cosine':
        case 'cos':
            var theta = Utils.getTheta(args);
            var inverse = args[2] === 'inverse' ? true : false;
            if (theta != '') {
                if (inverse) {
                    var acos = Math.acos(theta);
                    msg.channel.send(`The arc-cosine of ${theta}rad is ${acos}`);
                }
                else {
                    var cos = Math.cos(theta);
                    msg.channel.send(`The cosine of ${theta}rad is ${cos}.`);
                }
            }
            else {
                Utils.invalidSyntax(msg);
            }
            break;
        
        case 'tangent':
        case 'tan':
            var theta = Utils.getTheta(args);
            var inverse = args[2] === 'inverse' ? true : false;
            if (theta != '') {
                if (inverse) {
                    var atan = Math.atan(theta);
                    msg.channel.send(`The arc-tangent of ${theta}rad is ${atan}.`);
                }
                else {
                    var tan = Math.tan(theta);
                    msg.channel.send(`The tangent of ${theta}rad is ${tan}.`);
                }
            }
            else {
                Utils.invalidSyntax(msg);
            }
            break;
        
        case 'rad2deg':
        case 'r2d':
            var rad = Utils.getTheta(args);
            if (rad != '') {
                var deg = rad * (180 / Math.PI);
                msg.channel.send(`${rad} radians is equal to ${deg} degrees.`);
            }
            else {
                Utils.invalidSyntax(msg);
            }
            break;

        case 'deg2rad':
        case 'd2r':
            var deg = Utils.getTheta(args);
            if (deg != '') {
                var rad = deg * (Math.PI / 180);
                msg.channel.send(`${deg} degrees is equal to ${rad} radians.`);
            }
            else {
                Utils.invalidSyntax(msg);
            }
            break;
    
        case 'quadratic':
        case 'q':
            var a = Utils.isNumber(parseFloat(args[1])) ? parseFloat(args[1]) : 'n';
            var b = Utils.isNumber(parseFloat(args[2])) ? parseFloat(args[2]) : 'n';
            var c = Utils.isNumber(parseFloat(args[3])) ? parseFloat(args[3]) : 'n';

            if (a != 'n' && b != 'n' && c != 'n') {
                var solve_sqrt = Math.sqrt((b ** 2) - (4 * a * c));
                var neg_intercept = -b - solve_sqrt;
                var pos_intercept = -b + solve_sqrt;
                
                neg_intercept = neg_intercept / (2 * a);
                pos_intercept = pos_intercept / (2 * a);

                if (isNaN(neg_intercept) || isNaN(neg_intercept)) {
                    msg.channel.send(`The x-intercepts of ${a}x^2 + ${b}x + ${c} are imaginary.`)
                }
                else {
                    if (neg_intercept == pos_intercept) {
                        msg.channel.send(`The only x-intercept of ${a}x^2 + ${b}x + ${c} is (${pos_intercept}).`);
                    }
                    else {
                        msg.channel.send(`The x-intercepts of ${a}x^2 + ${b}x + ${c} are (${neg_intercept}, ${pos_intercept}).`);
                    }
                }

            }
            else {
                Utils.invalidSyntax(msg);
            }
    }

});

client.login(config.token);