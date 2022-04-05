import fs from "fs";
import path from "path";

import { Client, Message } from "discord.js";
import { TextEncodings, Prefix } from "../utils";
import { Player } from "discord-player";


export function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    const people: Array<string> = fs.readFileSync(path.join(__dirname, "../../", "data", "mannen.txt"), {encoding: "utf-8"}).split("\n");

    const randomDude = people[Math.floor(Math.random() * people.length)];

    message.channel.send(`Yo waddup. Het prefix van mij is ${Prefix}. Syntax ziet er als volgt uit: ${TextEncodings.graveAccent}${Prefix} [Opdracht] -Argument1 -Argument2 -Argument3 [ArgumentWaarde] ${TextEncodings.graveAccent}. Oktay is schattig btw. ${randomDude}`);


}