import fs from "fs";
import { IncomingMessage } from "http";
import https from "https";


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


// ================= Constant variables =================


export const TextEncodings: ITextEncodings = {
    graveAccent: "\u0060",
    whiteSpace: "\u200b"
}
export const Prefix: string = "!bb"; 






// ================= Public functions =================

/**
 * Uses the given angle to return the right compass value.
 * @param num {number}
 */
export function DegreesToCompass(angle: number): string {

    const val = Math.floor((angle / 22.5) + 0.5);

    const arr = ["Noord", "Noord NO", "Noord oost", "Oost NO", "Oost", "Oost ZO", "Zuid oost", "Zuid SO", "Zuid", "Zuid ZW", "Zuid west", "West ZW", "West", "West NW", "Noord west", "Noord NW"];

    return arr[(val % 16)];
}

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


export async function downloadImage(url: string, filePath: string): Promise<string> {

    return new Promise(function (resolve, reject) {

        const out = fs.createWriteStream(filePath);

        https.get(url, function (res: IncomingMessage) {

            if (res.statusCode === 200) {

                res.pipe(out);

                res.on("error", reject);
                res.once("close", function () {
                    resolve(filePath);
                });

            } else {

                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }

        });

    });

}