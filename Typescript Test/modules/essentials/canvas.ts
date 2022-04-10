import "colors";

import path from "node:path/posix";
import fs from "fs";

import { Canvas, createCanvas, Image, loadImage, CanvasRenderingContext2D, registerFont } from "canvas";
import { Message, MessageAttachment } from "discord.js";
import { CreateErrorMessageAttachment, DownloadImageFromURL, ImageDownloadState, UniqueID } from "../utils";

const webp = require("webp-converter");




const canvas = createCanvas(1280, 720) as Canvas;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

console.log("Registering fonts...".yellow);

registerFont(path.join(__dirname, "../dist", "data", "fonts", "Montserrat-Bold.ttf"), { family: "Montserrat" });
registerFont(path.join(__dirname, "../dist", "data", "fonts", "Roboto-Thin.ttf"), { family: "RobotoThin" });

console.log("Succesfully registered fonts.".green);


export async function createTrackPlayerImage(trackName: string, trackAuthor: string, trackTimestamp: string, trackDuration: string, trackThumbnail: string): Promise<MessageAttachment>{

    const destination: string = path.join(__dirname, "../dist", "cache", UniqueID(18));
    const filePath: string = destination + ".png";


    const downloadedImage: ImageDownloadState = await DownloadImageFromURL(trackThumbnail, destination);

    if (downloadedImage.status !== 200) return CreateErrorMessageAttachment(`Foutcode: ${downloadedImage.status}`);

    const converting = await webp.cwebp(destination, filePath);

    await fs.unlinkSync(trackThumbnail);

    console.log(fs.existsSync(filePath));

    const image: Image = await loadImage("https://zeilmakerijdeoversteek.nl/wp-content/uploads/2019/06/test-elonisas.jpg");

    fs.unlinkSync(filePath);

    console.log(`Succesfully loaded image ${image.src}.`.green);

    ctx.save();
    ctx.beginPath();
 
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.restore();

    const file = fs.writeFileSync(filePath, canvas.toBuffer());

    const attachment: MessageAttachment = new MessageAttachment(filePath);

    console.log(`Attachement succesfully created.`.green);

    return attachment;
}