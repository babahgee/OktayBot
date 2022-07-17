import fs from "fs";
import path from "path";

import { IncomingMessage } from "http";
import { MessageAttachment, MessageEmbed } from "discord.js";
import https from "https";

import { stripJsonComments } from "./essentials/stripJson";


// ================= Interfaces =================

export interface PlayerTimestamp {
    current: string;
    end: string;
    progress: number;
}

export interface CommandExecution {
    Execute: Function
}

export interface ITextEncodings {
    readonly graveAccent: string;
    readonly whiteSpace: string;
}

export interface ImageDownloadState {
    readonly status: number;
    readonly message?: string;
    readonly contents?: string;
}

export interface HelpDictionary {
    command: string;
    prefix?: string;
    description: string;
    keyword?: string;
    arguments?: Array<string>;
}

export interface BotPermissions {
    command_execution_whitelist: Array<string>;
    https_whitelist: Array<string>;
    tokens: Array<string>;
}

// ================= Constant variables =================


export const TextEncodings: ITextEncodings = {
    graveAccent: "\u0060",
    whiteSpace: "\u200b"
}

export const Prefix: string = ";ok"; 


// ================= Permissions =================

const permissionsFile = fs.readFileSync(path.join(__dirname, "../../", "bot.permissions.json"), { encoding: "utf-8" });
const formattedFile: any = JSON.parse(stripJsonComments(permissionsFile));

export const AllPermissions: BotPermissions = formattedFile.permissions;

export const HTTPSWhitelist: Array<string> = AllPermissions.https_whitelist;
export const CommandExecutionWhitelist: Array<string> = AllPermissions.command_execution_whitelist;
export const Tokens: Array<string> = AllPermissions.tokens;


// ================= Public functions =================

/**
 * Creates an error embed message.
 * @param title Error title.
 * @param message Error message.
 * @param solution Error solution if available.
 */
export function CreateErrorEmbedMessage(title: string, message: string, solution?: string): MessageEmbed {

    const embedMessage: MessageEmbed = new MessageEmbed();

    embedMessage.setColor("#ff4d4d")
        .setTitle(title)
        .setDescription(message)
        .setImage("https://static.truckersmp.com/images/vtc/logo/21823.1594940844.png")
        .setFooter({ text: "Oktay Bot" });


    return embedMessage;
}

export function CreateErrorMessageAttachment(title: string, message?: string): MessageAttachment {

    const attachment = new MessageAttachment("../../data/error/attachment.notfound.txt") as MessageAttachment;

    return attachment;
}

/**
 * Uses the given angle to return the right compass value.
 * @param num Given degrees to calculate the compass results.
 */
export function DegreesToCompass(angle: number): string {

    const val = Math.floor((angle / 22.5) + 0.5);

    const arr = ["Noord", "Noord NO", "Noord oost", "Oost NO", "Oost", "Oost ZO", "Zuid oost", "Zuid SO", "Zuid", "Zuid ZW", "Zuid west", "West ZW", "West", "West NW", "Noord west", "Noord NW"];

    return arr[(val % 16)];
}

/**
 * Generates an unique id.
 * @param len Length of the generated id.
 */
export function UniqueID(len: number): string {

    const chars: string = "abdefghhijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ134567890";

    let id: string = "",
        i: number = 0;

    while (i < len) {

        id += chars.charAt(Math.floor(Math.random() * chars.length));

        i += 1;

    }

    return id;
}

/**
 * Downloads an online image in a specific directory.
 * @param url URL of the provided image.
 * @param filePath Path where the file has to be stored.
 * @returns {ImageDownloadState}
 */
export async function DownloadImageFromURL(url: string, filePath: string): Promise<ImageDownloadState> {

    return new Promise(function (resolve, reject) {

        const out = fs.createWriteStream(filePath);

        https.get(url, function (res: IncomingMessage) {

            const statusCode: number = typeof res.statusCode === "number" ? res.statusCode : 0;
            const statusMessage: string = typeof res.statusMessage === "string" ? res.statusMessage : "null";
            
            if (res.statusCode === statusCode) {

                res.pipe(out);

                res.on("error", reject);

                res.once("close", function () {

                    const responseEndState: ImageDownloadState = {
                        status: 200,
                        contents: filePath,
                        message: statusMessage
                    }

                    resolve(responseEndState);
                });

            } else {

                const responseErrorState: ImageDownloadState = {
                    status: statusCode,
                    message: statusMessage,
                }

                res.resume();
                resolve(responseErrorState);

            }

        });

    });

}

export function BytesToSize(bytes: number): string | number {

    const sizes: Array<string> = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (bytes == 0) return '0 Byte';

    //@ts-expect-error
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    //@ts-expect-error
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function CodeFormatTokens(): Array<string> {

    const arr: Array<string> = [];

    Tokens.forEach(function (token: string) {
        arr.push("```" + token + "```");
    });

    return arr;
}

export function SaveChangedBotPermissions(): BotPermissions | boolean {

    if (!fs.existsSync(path.join(__dirname, "../../", "bot.permissions.json"))) {

        console.log(`Failed to change bot server permission file since file does not exist or may not be readable.`.red);

        return false;
    }

    const temp = {
        permissions: AllPermissions
    }

    fs.writeFileSync(path.join(__dirname, "../../", "bot.permissions.json"), JSON.stringify(temp, null, 3), { encoding: "utf-8" });

    return AllPermissions as BotPermissions;
}