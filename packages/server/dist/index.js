"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const firebase_1 = require("./lib/firebase/");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fetchAllPlanetsByUser_1 = __importDefault(require("./lib/firebase/fetchAllPlanetsByUser"));
const checkForUpgradeComplete_1 = __importDefault(require("./lib/firebase/checkForUpgradeComplete"));
require("dotenv").config();
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert({
        projectId: process.env.PROJECT_ID,
        privateKey: (_a = process.env.PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"),
        clientEmail: process.env.CLIENT_EMAIL,
    }),
    databaseURL: process.env.DATABASE_URL,
});
const port = 25145;
const server = new socket_io_1.Server(port);
console.log("Server Started on port", port);
server.on("connection", (socket) => {
    console.log("Connection established with socket ID: ", socket.handshake.address);
    socket.on("checkCompleteUpgrade", async (planetID) => {
        const newPlanetData = await (0, checkForUpgradeComplete_1.default)(firebase_admin_1.default, planetID);
        if (newPlanetData) {
            socket.emit("planetUpdate", newPlanetData);
        }
        else {
            //planet is not finished upgrading yet
            console.log('planet upgrade not finished yet');
        }
    });
    socket.on("userStateChanged", async (userUID) => {
        // if user has account, send back the save data, otherwise create a new account
        const userGameData = await (0, firebase_1.fetchUserData)(firebase_admin_1.default, userUID);
        console.log("logging in with id:", userUID);
        if (userGameData) {
            socket.emit("updateAllGameData", await (0, fetchAllPlanetsByUser_1.default)(firebase_admin_1.default, userUID));
        }
        else {
            console.log("fetching user data from client to create account");
            socket.emit("NoUserExists");
        }
    });
    socket.on("CreateNewUserData", async (data) => {
        console.log("Creating a new user");
        const newData = await (0, firebase_1.createUser)(firebase_admin_1.default, data);
        await (0, firebase_1.createNewUserStarterPlanets)(firebase_admin_1.default, newData.uid);
        socket.emit("updateAllGameData", await (0, fetchAllPlanetsByUser_1.default)(firebase_admin_1.default, newData.uid));
    });
    socket.on("upgradePlanet", async ({ planetID, userUID }) => {
        const updatedPlanet = await (0, firebase_1.updatePlanet)(firebase_admin_1.default, planetID, userUID);
        socket.emit("planetUpdate", updatedPlanet);
    });
});
