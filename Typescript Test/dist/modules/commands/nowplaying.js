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
const discord_js_1 = require("discord.js");
function GetHelp() {
    const dict = {
        command: "nowplaying",
        description: "Als er nummer word afgespeeld, en jij wilt graag weten welk nummer er word afgespeeld, kun jij dat doen met deze opdracht.",
        arguments: ["all", "fancy"]
    };
    return dict;
}
exports.GetHelp = GetHelp;
/**
 * Executes the nowplaying function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.guild === null)
            return;
        console.log(commandArguments);
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing)
            return message.channel.send(`Momenteel worden er geen nummers afgespeeld!`);
        const currentTrack = queue.current;
        const trackTimestamp = queue.getPlayerTimestamp();
        const trackDuration = currentTrack.duration;
        const trackVolume = queue.volume.toString();
        const methods = ["uitgeschakeld", "huidige nummer", "afspeellijst"];
        const filters = queue.getFiltersEnabled().length > 0 ? queue.getFiltersEnabled().join(", ") : "geen filters";
        const embedMessage = new discord_js_1.MessageEmbed();
        embedMessage.setTitle(currentTrack.title)
            .setThumbnail(currentTrack.thumbnail)
            .setColor("#03fc94")
            .setDescription(`van ${currentTrack.author}. ${trackTimestamp.current} - ${trackDuration}`)
            .setFooter(`Opdracht uitgevoerd door ${message.author.username}`);
        switch (true) {
            case commandArguments.includes("all"):
                embedMessage.addFields([
                    {
                        name: "Volume",
                        value: trackVolume + "%"
                    },
                    {
                        name: "Herhaalmodus",
                        value: methods[queue.repeatMode]
                    },
                    {
                        name: "Link naar nummer",
                        value: currentTrack.url
                    },
                    {
                        name: "Filters",
                        value: filters
                    },
                    {
                        name: "Opgevraagd door",
                        value: currentTrack.requestedBy.username
                    }
                ]);
                break;
            case commandArguments.includes("fancy"):
                return message.channel.send("Deze feature is momenteel niet beschikbaar.");
                break;
        }
        message.channel.send({ embeds: [embedMessage] });
    });
}
exports.Execute = Execute;
