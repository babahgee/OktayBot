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
        command: "exit",
        description: "Een administratieve opdracht waarmee je de bot kan sluiten."
    };
    return dict;
}
exports.GetHelp = GetHelp;
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (client.user === null)
            return message.channel.send("Bruh");
        if (!utils_1.CommandExecutionWhitelist.includes(message.author.id))
            return message.channel.send("bruh jij bent niet bevoegd om deze opdracht uit te voeren.");
        message.reply("Als jij de bot wilt gaan afsluiten, kun je dat doen via de openstaande opdracht-prompt tabblad. Voer de toetsenbordcombinatie CTRL+C uit (dubbel keer aub).");
    });
}
exports.Execute = Execute;
