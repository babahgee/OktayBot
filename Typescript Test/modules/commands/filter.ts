import { Player, QueueFilters } from "discord-player";
import { Client, Message, MessageEmbed } from "discord.js";

import { HelpDictionary, Prefix, TextEncodings } from "../utils";

interface UpdatedFilters {
    [key: string]: boolean;
}


function createNoPlayingEmbedMessage(): MessageEmbed {

    const message: MessageEmbed = new MessageEmbed();

    message.setTitle("Bruh");
    message.setDescription("Er worden momenteel geen nummers afgespeeld om een filter toe te passen.")
    message.setTimestamp();
    message.setColor("RANDOM");
    message.setThumbnail("https://i.ytimg.com/vi/P8KwMnA0P6g/hqdefault.jpg");

    return message;
}

function createNoArgsGivenEmbedMessage(): MessageEmbed {

    const message: MessageEmbed = new MessageEmbed();

    message.setTitle("Oof");
    message.setDescription("Er zijn geen filters aangegeven tijdens het uitvoeren van deze command. Als je niet weet welke filters er aanwezig zijn, voer dan de opdracht ``!bb help filter`` uit.");
    message.setTimestamp();
    message.setColor("RANDOM");
    message.setThumbnail("https://avatars.githubusercontent.com/u/61418505?s=400&u=58d6fcadb127bfb5dae4a3746dd062df06f0aa1f&v=4");

    return message;

}

function createInvalidFilterArgumentEmbedMessage(filters: Array<string>): MessageEmbed {

    const message: MessageEmbed = new MessageEmbed();

    message.setTitle("Uhhh?");
    message.setDescription(`De filter argument die zijn gebruikt tijdens het uitvoeren van deze opdrachten zijn geen bekende filters. ${filters.join(", ")}.`);
    message.setTimestamp();
    message.setColor("RANDOM");
    message.setThumbnail("https://www.expoxl.nl/wp-content/uploads/sex-bel-ring-for-sex.jpg");

    return message;

}

function createFilterApplySuccessEmbedMessage(filters: UpdatedFilters): MessageEmbed {

    const message: MessageEmbed = new MessageEmbed();

    message.setTitle("Sex!");
    message.setDescription(`De onderstaande filters zijn zojuist toegepast. Onthoud wel, de filters gaan terug naar 0 zodra de huidige afspeellijst klaar is met spelen.`);
    message.setTimestamp();
    message.setColor("RANDOM");
    message.setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbPPeKgnsQPesmDV8vFHXwlA6HaIhz8QVtu-tbslZ8PN9STvuBVLRZJw_xRTTAqRzCWmY&usqp=CAU");

    for (const filter in filters) {

        message.addField(filter, filters[filter] === true ? "Actief" : "Inactief");

    }


    return message;

}


export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "filter",
        description: `Past een filter toe aan een nummer dat gespeeld word. Je kunt een van de onderstaande argumenten gebruiken, bijboorbeeld zo: ${TextEncodings.graveAccent}${Prefix} filter -bassboost${TextEncodings.graveAccent}.`,
        arguments: ["bassboost_low", "bassboost", "bassboost_high", "8D", "vaporwave", "phaser", "tremolo", "vibrato", "reverse", "treble", "normalizer", "normalizer2", "surrounding", "pulsator", "subboost", "karaoke", "flanger", "gate", "haas", "mcompand", "mono", "mstrl", "mstrr", "compressor", "expander", "softlimiter", "chorus", "chorus2d", "chorus3d", "fadein", "dim", "earrape"]
    }

    return dict;
}

export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    if (message.guild == null) return;

    const queue = player.getQueue(message.guild.id);

    if (!queue || !queue.playing) return message.reply({ embeds: [createNoPlayingEmbedMessage()]});

    const args: Array<string> = []; 

    commandArguments.forEach(function (arg: string, index: number) {
        if (arg !== "" && arg !== " ") args.push(arg);
    });

    if (args.length === 0) return message.reply({ embeds: [createNoArgsGivenEmbedMessage()] });

    const allFilters: Array<string> = [];
    const undefinedFilters: Array<string> = [];

    queue.getFiltersDisabled().map(x => allFilters.push(x));
    queue.getFiltersEnabled().map(x => allFilters.push(x));

    args.forEach(function (arg) {

        if (!allFilters.includes(arg)) undefinedFilters.push(arg);

    });

    if (undefinedFilters.length !== 0) return message.reply({ embeds: [createInvalidFilterArgumentEmbedMessage(undefinedFilters)] });

    const updatedFilters: UpdatedFilters = {};

    args.forEach(function (arg: string) {

        //@ts-expect-error
        updatedFilters[arg] = queue.getFiltersEnabled().includes(arg) ? false : true;

    });

    await queue.setFilters(updatedFilters);

    message.reply({ embeds: [createFilterApplySuccessEmbedMessage(updatedFilters)] });
}