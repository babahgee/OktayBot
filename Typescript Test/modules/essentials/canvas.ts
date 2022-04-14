import "colors";

import path from "node:path/posix";
import fs, { createWriteStream, WriteStream } from "fs";

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

export async function createOktay(url: string): Promise<string> {

    const destinationOutPath: string = path.join(__dirname, "../dist", "cache", UniqueID(18) + ".png");

    const image: Image = await loadImage(url);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = 720;
    canvas.height = 1280;

    // Save current state.
    ctx.save();

    // Draw background
    ctx.beginPath();
    ctx.fillStyle = "#030303";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();

    // Draw image
    ctx.beginPath();
    ctx.filter = "blur(20px)";
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.closePath();


    // Draw text
    for (let i = 0; i < 220; i++) {

        const x: number = Math.floor(Math.random() * canvas.width);
        const y: number = Math.floor(Math.random() * canvas.height);
        const rotation: number = Math.floor(Math.random() * 180);
        const size: number = Math.floor(Math.random() * 60);

        //ctx.translate(x, y);
        //ctx.rotate(rotation * Math.PI / 180);

        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.shadowColor = "#000";
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
        ctx.shadowBlur = 0;
        ctx.font = `${size}px Montserrat`;
        ctx.fillText("OKTAY", x, y);

    }

    // Restore states.
    ctx.restore();

    return new Promise(function (resolve, reject) {

        const out: WriteStream = fs.createWriteStream(destinationOutPath);
        const stream = canvas.createPNGStream();

        stream.pipe(out);

        out.on("finish", function () {

            resolve(destinationOutPath);

        });

    });
}
