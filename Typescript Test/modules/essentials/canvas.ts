import "colors";

import path from "node:path/posix";
import fs from "fs";

import { Canvas, createCanvas, Image, loadImage, CanvasRenderingContext2D, registerFont } from "canvas";
import { MessageAttachment } from "discord.js";
import { downloadImage, UniqueID } from "../utils";

const webp = require("webp-converter");




const canvas: Canvas = createCanvas(1280, 720);
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

console.log("Registering fonts...".yellow);

registerFont(path.join(__dirname, "../dist", "data", "fonts", "Montserrat-Bold.ttf"), { family: "Montserrat" });
registerFont(path.join(__dirname, "../dist", "data", "fonts", "Roboto-Thin.ttf"), { family: "RobotoThin" });

console.log("Succesfully registered fonts.".green);


export async function createTrackPlayerImage(trackName: string, trackAuthor: string, trackTimestamp: string, trackDuration: string, trackThumbnail: string): Promise<MessageAttachment> {

    const destination = path.join(__dirname, "../dist", "cache", UniqueID(18));

    const downloadedImage: string = await downloadImage(trackThumbnail, destination);

    const converting = await webp.cwebp(destination, path.join(destination + ".png"));

    await fs.unlinkSync(destination);

    console.log();

    const image: Image = await loadImage(path.join(__dirname, "../dist", "cache", "bbg.png"), {
        format: "png"
    });

    fs.unlinkSync(path.join(destination + ".png"));

    console.log(`Succesfully loaded image ${image.src}.`.green);

    ctx.save();
    ctx.beginPath();
 
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.restore();

    const file = fs.writeFileSync(destination + ".png", canvas.toDataURL('image/png'));

    const attachment: MessageAttachment = new MessageAttachment(destination + ".png", "bruh.png");

    console.log(`Attachement succesfully created.`.green);

    return attachment;
}