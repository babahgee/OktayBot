import url from "url";
import path from "path";
import fs from "fs";
import os from "os";
import dotenv from "dotenv";

import { Client, Collection, Guild, GuildMember, Intents } from "discord.js";

(async function _(p: NodeJS.Process) {

	const args = p.argv;

	const envPath: string | undefined = args[2];

	if (!envPath) return;

	const fileExists: boolean = fs.existsSync(path.join(__dirname, envPath));

	dotenv.config({ path: path.join(__dirname, envPath) });

	if (typeof p.env["BOT_TOKEN"] === "undefined") return;

	const botToken: string = p.env["BOT_TOKEN"];

	const client: Client = new Client({
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MEMBERS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_VOICE_STATES,
			Intents.FLAGS.DIRECT_MESSAGES
		]
	});

	client.once("ready", async function (client: Client) {

		const members: Array<Collection<string, GuildMember>> = [];

		client.guilds.cache.forEach(async function (guild: Guild) {

			const guildMember = await guild.members.fetch();

			members.push(guildMember);

			handle();
		});


		function handle() {


			console.log(JSON.stringify(members));

		}
	});

	client.login(botToken as string);
})(process as NodeJS.Process);