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
function GetHelp() {
    const dict = {
        command: "clear",
        description: "Met deze opdracht kun jij een afspeellijst leegmaken."
    };
    return dict;
}
exports.GetHelp = GetHelp;
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.guild === null)
            return message.channel.send("Kan opdracht niet uitvoeren. ``MESSAGE_GUILD_UNDEFINED``");
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing)
            return message.channel.send("Er spelen momenteel geen nummers af.");
        if (!queue.tracks[0])
            return message.channel.send("Er zijn geen nummers meer in de wachtrij die leeg kunnen worden gemaakt.");
        yield queue.clear();
        return message.channel.send("Afspeellijst succesvol leeggemaakt.");
    });
}
exports.Execute = Execute;
