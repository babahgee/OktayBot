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
exports.createTrackPlayerImage = void 0;
require("colors");
const posix_1 = __importDefault(require("node:path/posix"));
const fs_1 = __importDefault(require("fs"));
const canvas_1 = require("canvas");
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const webp = require("webp-converter");
const canvas = (0, canvas_1.createCanvas)(1280, 720);
const ctx = canvas.getContext("2d");
console.log("Registering fonts...".yellow);
(0, canvas_1.registerFont)(posix_1.default.join(__dirname, "../dist", "data", "fonts", "Montserrat-Bold.ttf"), { family: "Montserrat" });
(0, canvas_1.registerFont)(posix_1.default.join(__dirname, "../dist", "data", "fonts", "Roboto-Thin.ttf"), { family: "RobotoThin" });
console.log("Succesfully registered fonts.".green);
function createTrackPlayerImage(trackName, trackAuthor, trackTimestamp, trackDuration, trackThumbnail) {
    return __awaiter(this, void 0, void 0, function* () {
        const destination = posix_1.default.join(__dirname, "../dist", "cache", (0, utils_1.UniqueID)(18));
        const downloadedImage = yield (0, utils_1.downloadImage)(trackThumbnail, destination);
        const converting = yield webp.cwebp(destination, posix_1.default.join(destination + ".png"));
        yield fs_1.default.unlinkSync(destination);
        console.log();
        const image = yield (0, canvas_1.loadImage)(posix_1.default.join(__dirname, "../dist", "cache", "bbg.png"), {
            format: "png"
        });
        fs_1.default.unlinkSync(posix_1.default.join(destination + ".png"));
        console.log(`Succesfully loaded image ${image.src}.`.green);
        ctx.save();
        ctx.beginPath();
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        const file = fs_1.default.writeFileSync(destination + ".png", canvas.toDataURL('image/png'));
        const attachment = new discord_js_1.MessageAttachment(destination + ".png", "bruh.png");
        console.log(`Attachement succesfully created.`.green);
        return attachment;
    });
}
exports.createTrackPlayerImage = createTrackPlayerImage;
