import * as DiscordJS from "discord.js";
import * as DiscordPlayer from "discord-player";
import * as FS from "fs";
import * as Path from "path";
import * as URL from "url";

import "colors";

import { TextEncodings, CommandExecution, Prefix } from "./modules/utils";

const client = new DiscordJS.Client({
    intents: [
        DiscordJS.Intents.FLAGS.GUILDS,
        DiscordJS.Intents.FLAGS.GUILD_MEMBERS,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
        DiscordJS.Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});
const player = new DiscordPlayer.Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});



const commands: Array<string> = FS.readdirSync(Path.join(__dirname, "modules", "commands"), { encoding: "utf-8" });


client.on("messageCreate", function (message: DiscordJS.Message) {

    //if (message.mentions.has(client.user.id)) {
    //    message.channel.send(`Yo waddup. Het prefix van mij is ${Prefix}. Syntax ziet er als volgt uit: ${TextEncodings.graveAccent}${Prefix} [Opdracht] -Argument1 -Argument2 -Argument3 [ArgumentWaarde] ${TextEncodings.graveAccent}. Oktay is schattig btw`);
    //}


});

client.on("message", async function (message: DiscordJS.Message) {

    if (message.author.id === client.user?.id || message.author.bot) return;
    if (!message.content.startsWith(Prefix)) return;


    const msg: string = message.content,
        format: Array<string> = msg.split(" ");

    const command: (string | null) = typeof format[1] === "string" ? format[1].toLowerCase() : "no_command_given";
    const commandArguments: Array<string> = msg.substring(command.length + (Prefix.length + 1)).split("-");

    if (command === "no_command_given") {

        message.channel.send("Please enter a command.");

        return;
    }
    if (!commands.includes(command + ".js")) {

        message.channel.send(`${TextEncodings.graveAccent}Kan opdracht '${command}' niet uitvoeren sinds opdracht niet bestaat in codebase.${TextEncodings.graveAccent}`);

        return;
    }

    const commandExecution: CommandExecution = await import(Path.join(__dirname, "modules", "commands", command + ".js"));

    await commandExecution.Execute(message, commandArguments, client, player);
});



client.on("ready", function (client: DiscordJS.Client) {

    console.log("Client succesfully has been initialized.".green);

    client.user?.setPresence({
        status: "online",
        activities: [{
            name: `Prefix: ${Prefix}`
        }]
    });
   
});


client.login(process.env.BOT_TOKEN);