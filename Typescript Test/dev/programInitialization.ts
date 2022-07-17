import fs from "fs";
import path from "path";
import url from "url";
import os from "os";
import cp from "child_process";

(async function (p: NodeJS.Process) {

	let workingDirectory: string = path.dirname(process.argv[0]);

	console.log(workingDirectory);

	if (!fs.existsSync(path.join(workingDirectory, "package.json"))) workingDirectory = path.join(workingDirectory, "../../");

	const distDirectory = fs.readdirSync(path.join(workingDirectory, "dist"));

	distDirectory.forEach(function (dir: string) {

		if (dir === "data") return;

		try {
			fs.unlinkSync(path.join(workingDirectory, "dist", dir));
		} catch (err) {
			console.log((err as Error).message);
		}
	});

	const compilationProcess = cp.execSync("npm run build", {
		cwd: path.join(workingDirectory)
	});

	const mainProcess = cp.exec("TREE && title OktayBot && node -r dotenv/config ./dist/index.js", {
		cwd: path.join(workingDirectory)
	});

	if (mainProcess.stdout === null) return;
	if (mainProcess.stderr === null) return;

	mainProcess.stdout.on("data", function (chunk: Buffer) {
		console.log(chunk.toString());
	});

	mainProcess.stderr.on("data", function (chunk: Buffer) {
		console.log(chunk.toString());
	});

})(process as NodeJS.Process);