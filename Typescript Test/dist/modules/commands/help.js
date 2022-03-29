"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execute = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
function Execute(message, commandArguments, client, player) {
    const people = fs_1.default.readFileSync(path_1.default.join(__dirname, "../", "mannen.txt"), { encoding: "utf-8" }).split("\n");
    const randomDude = people[Math.floor(Math.random() * people.length)];
    message.channel.send(`Yo waddup. Het prefix van mij is ${utils_1.Prefix}. Syntax ziet er als volgt uit: ${utils_1.TextEncodings.graveAccent}${utils_1.Prefix} [Opdracht] -Argument1 -Argument2 -Argument3 [ArgumentWaarde] ${utils_1.TextEncodings.graveAccent}. Oktay is schattig btw. ${randomDude}`);
}
exports.Execute = Execute;
