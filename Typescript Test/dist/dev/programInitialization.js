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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = __importDefault(require("child_process"));
(function (p) {
    return __awaiter(this, void 0, void 0, function* () {
        let workingDirectory = path_1.default.dirname(process.argv[0]);
        console.log(workingDirectory);
        if (!fs_1.default.existsSync(path_1.default.join(workingDirectory, "package.json")))
            workingDirectory = path_1.default.join(workingDirectory, "../../");
        const distDirectory = fs_1.default.readdirSync(path_1.default.join(workingDirectory, "dist"));
        distDirectory.forEach(function (dir) {
            if (dir === "data")
                return;
            try {
                fs_1.default.unlinkSync(path_1.default.join(workingDirectory, "dist", dir));
            }
            catch (err) {
                console.log(err.message);
            }
        });
        const compilationProcess = child_process_1.default.execSync("npm run build", {
            cwd: path_1.default.join(workingDirectory)
        });
        const mainProcess = child_process_1.default.exec("TREE && title OktayBot && node -r dotenv/config ./dist/index.js", {
            cwd: path_1.default.join(workingDirectory)
        });
        if (mainProcess.stdout === null)
            return;
        if (mainProcess.stderr === null)
            return;
        mainProcess.stdout.on("data", function (chunk) {
            console.log(chunk.toString());
        });
        mainProcess.stderr.on("data", function (chunk) {
            console.log(chunk.toString());
        });
    });
})(process);
