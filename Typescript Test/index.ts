import * as DiscordJS from "discord.js";
import * as DiscordPlayer from "discord-player";
import * as DiscordVoice from "@discordjs/voice";
import * as FS from "fs";
import * as Path from "path";
import * as URL from "url";

import "colors";
import "dotenv";

import { TextEncodings, CommandExecution, Prefix } from "./modules/utils";

if (typeof process.env.BOT_TOKEN !== "string") {

    console.log("Failed to run program since bot token has not been defined in the process environment.".red);

    process.exit();

}

console.log("Initializing Discord client, YTDL DiscordPlayer client and main program...".yellow);

const client: DiscordJS.Client = new DiscordJS.Client({
    intents: [
        DiscordJS.Intents.FLAGS.GUILDS,
        DiscordJS.Intents.FLAGS.GUILD_MEMBERS,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
        DiscordJS.Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

const player: DiscordPlayer.Player = new DiscordPlayer.Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    }
});

const commands: Array<string> = FS.readdirSync(Path.join(__dirname, "modules", "commands"), { encoding: "utf-8" });


function createInvalidCommandEmbedMessage(): DiscordJS.MessageEmbed {

    const msg: DiscordJS.MessageEmbed = new DiscordJS.MessageEmbed();

    msg.setColor("RANDOM");
    msg.setTimestamp();

    if (client.user !== null) msg.setAuthor(client.user.username, client.user.displayAvatarURL());

    msg.setTitle("Onbekende opdracht");
    msg.setDescription(`De ingevoerde opdracht bestaat niet in mijn codebase. Voer ${Prefix} help uit om te zien tot welke opdrachten ter beschikking zijn.`);

    return msg;
}
function createNoGivenCommandEmbedMessage(): DiscordJS.MessageEmbed {

    const msg: DiscordJS.MessageEmbed = new DiscordJS.MessageEmbed();

    msg.setColor("RANDOM");
    msg.setTimestamp();

    if (client.user !== null) msg.setAuthor(client.user.username, client.user.displayAvatarURL());

    msg.setTitle("Ulan");
    msg.setDescription(`Er zijn geen opdrachten ingevoerd. Voer ${Prefix} help uit om te zien tot welke opdrachten ter beschikking zijn.`);

    return msg;

}




client.on("messageCreate", async function (message: DiscordJS.Message) {

    if (message.author.id === client.user?.id || message.author.bot) return;
    if (!message.content.startsWith(Prefix)) return;

    const msg: string = message.content,
        format: Array<string> = msg.split(" ");

    const command: (string | null) = typeof format[1] === "string" ? format[1].toLowerCase() : "no_command_given";
    const commandArguments: Array<string> = msg.substring(command.length + (Prefix.length + 1)).split("-");

    if (command === "no_command_given") {

        console.log(`User '${message.author.username}' tried executing a non-given command at ${new Date()}`.yellow);
        
        message.channel.send({ embeds: [createNoGivenCommandEmbedMessage()]});

        return;
    }
    if (!commands.includes(command + ".js")) {

        console.log(`User '${message.author.username}' tried executing a non-existing command '${command}' at ${new Date()}`.yellow);

        message.channel.send({ embeds: [createInvalidCommandEmbedMessage()]});

        return;
    }

    const commandExecution: CommandExecution = await import(Path.join(__dirname, "modules", "commands", command + ".js"));

    try {
        await commandExecution.Execute(message, commandArguments, client, player);
    } catch (err: any) {

        const error: Error = err as Error;

        console.log(`Failed to execute command '${command}'. Error message: ${error.message}. Error stack: ${error.stack}`.bgBlack.red);

        message.channel.send(error.message);

    }
});

client.on("ready", function (client: DiscordJS.Client) {

    console.log(`Client succesfully has been initialized at ${new Date()}. Now ready to execute commands. To close this window, hit CTRL + C twice and the process should kill itself.`.green);

    client.user?.setPresence({
        status: "online",
        activities: [{
            name: `Mijn prefix is ${Prefix}`,
            type: "PLAYING",
        }]
    });
   
});


client.login(process.env.BOT_TOKEN).then(function (value: string) {

    console.log(`Client succesfully logged in at ${new Date()}.`.rainbow.bgBlack);
    
});