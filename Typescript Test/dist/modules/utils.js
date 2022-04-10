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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadImageFromURL = exports.UniqueID = exports.DegreesToCompass = exports.CreateErrorMessageAttachment = exports.CreateErrorEmbedMessage = exports.Prefix = exports.TextEncodings = void 0;
const fs_1 = __importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const https_1 = __importDefault(require("https"));
// ================= Constant variables =================
exports.TextEncodings = {
    graveAccent: "\u0060",
    whiteSpace: "\u200b"
};
exports.Prefix = "!bb";
// ================= Public functions =================
/**
 * Creates an error embed message.
 * @param title Error title.
 * @param message Error message.
 * @param solution Error solution if available.
 */
function CreateErrorEmbedMessage(title, message, solution) {
    const embedMessage = new discord_js_1.MessageEmbed();
    embedMessage.setColor("#ff4d4d")
        .setTitle(title)
        .setDescription(message)
        .setImage("https://static.truckersmp.com/images/vtc/logo/21823.1594940844.png")
        .setFooter({ text: "Oktay Bot" });
    return embedMessage;
}
exports.CreateErrorEmbedMessage = CreateErrorEmbedMessage;
function CreateErrorMessageAttachment(title, message) {
    const attachment = new discord_js_1.MessageAttachment("../../data/error/attachment.notfound.txt");
    return attachment;
}
exports.CreateErrorMessageAttachment = CreateErrorMessageAttachment;
/**
 * Uses the given angle to return the right compass value.
 * @param num Given degrees to calculate the compass results.
 */
function DegreesToCompass(angle) {
    const val = Math.floor((angle / 22.5) + 0.5);
    const arr = ["Noord", "Noord NO", "Noord oost", "Oost NO", "Oost", "Oost ZO", "Zuid oost", "Zuid SO", "Zuid", "Zuid ZW", "Zuid west", "West ZW", "West", "West NW", "Noord west", "Noord NW"];
    return arr[(val % 16)];
}
exports.DegreesToCompass = DegreesToCompass;
/**
 * Generates an unique id.
 * @param len Length of the generated id.
 */
function UniqueID(len) {
    const chars = "abdefghhijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ134567890";
    let id = "", i = 0;
    while (i < len) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
        i += 1;
    }
    return id;
}
exports.UniqueID = UniqueID;
/**
 * Downloads an online image in a specific directory.
 * @param url URL of the provided image.
 * @param filePath Path where the file has to be stored.
 * @returns {ImageDownloadState}
 */
function DownloadImageFromURL(url, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const out = fs_1.default.createWriteStream(filePath);
            https_1.default.get(url, function (res) {
                const statusCode = typeof res.statusCode === "number" ? res.statusCode : 0;
                const statusMessage = typeof res.statusMessage === "string" ? res.statusMessage : "null";
                if (res.statusCode === statusCode) {
                    res.pipe(out);
                    res.on("error", reject);
                    res.once("close", function () {
                        const responseEndState = {
                            status: 200,
                            contents: filePath,
                            message: statusMessage
                        };
                        resolve(responseEndState);
                    });
                }
                else {
                    const responseErrorState = {
                        status: statusCode,
                        message: statusMessage,
                    };
                    res.resume();
                    resolve(responseErrorState);
                }
            });
        });
    });
}
exports.DownloadImageFromURL = DownloadImageFromURL;
