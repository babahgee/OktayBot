"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execute = exports.GetHelp = void 0;
const utils_1 = require("../utils");
function GetHelp() {
    const dict = {
        command: "eval",
        description: "Een administratieve opdracht waarmee jij JavaScript opdrachten kun uitvoeren binnen de bot zelf. Let op: de token ``bot.permission.allowEval`` moet beschikbaar zijn in het ``bot.permissions.json`` bestand. Let er ook op dat alleen gemachtige gebruikers deze opdracht kunnen uitvoeren!"
    };
    return dict;
}
exports.GetHelp = GetHelp;
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (client.user === null)
            return message.channel.send("Bruh");
        if (!utils_1.Tokens.includes("bot.permission.allowEval"))
            return message.channel.send("Deze opdracht kan niet worden uitgevoerd omdat het token ``bot.permission.allowEval`` niet beschikbaar is. De bothoster kan deze optie beschikbaar maken");
        if (!utils_1.CommandExecutionWhitelist.includes(message.author.id))
            return message.channel.send("bruh jij bent niet bevoegd om deze opdracht uit te voeren.");
        const evalReturnStatus = eval(commandArguments[0]);
        const messageFormat = `[${new Date()}]: ${evalReturnStatus}`;
        console.log(`User '${message.author.username}' executed inline JS function: ${commandArguments[0]}`.yellow);
        return message.channel.send("```" + messageFormat + "```");
    });
}
exports.Execute = Execute;
