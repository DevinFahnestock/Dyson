"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const planet_names_json_1 = __importDefault(require("../../resources/planet-names.json"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const dayjs_1 = __importDefault(require("dayjs"));
const starterPlanets = [
    {
        id: null,
        imgsrc: "assets/planets/3064649268.gif",
        name: null,
        level: 0,
        owner: null,
        created: null,
        upgrading: false,
        upgradeFinishedTime: null,
    },
    {
        id: null,
        imgsrc: "assets/planets/3445279529.gif",
        name: null,
        level: 0,
        owner: null,
        created: null,
        upgrading: false,
        upgradeFinishedTime: null,
    },
    {
        id: null,
        imgsrc: "assets/planets/3847122958.gif",
        name: null,
        level: 0,
        owner: null,
        created: null,
        upgrading: false,
        upgradeFinishedTime: null,
    },
    {
        id: null,
        imgsrc: "assets/planets/1143784589.gif",
        name: null,
        level: 0,
        owner: null,
        created: null,
        upgrading: false,
        upgradeFinishedTime: null,
    },
];
dayjs_1.default.extend(utc_1.default);
const createNewUserStarterPlanets = async (admin, userUID) => {
    const batch = admin.firestore().batch();
    await starterPlanets.map(async (planet) => {
        const docref = await admin.firestore().collection("admin").doc("gameData").collection("planetData").doc();
        const writeData = planet;
        writeData.id = docref.id;
        writeData.name = planet_names_json_1.default[Math.floor(Math.random() * planet_names_json_1.default.length)];
        writeData.owner = userUID;
        writeData.created = (0, dayjs_1.default)().utc().toISOString();
        batch.set(docref, writeData);
    });
    await batch.commit();
    console.log("Starter Planet creation successful");
};
exports.default = createNewUserStarterPlanets;
