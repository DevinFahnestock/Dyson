"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const dayjs_1 = __importDefault(require("dayjs"));
const upgrade_times_json_1 = __importDefault(require("../../resources/upgrade-times.json"));
dayjs_1.default.extend(utc_1.default);
const updatePlanet = async (admin, planetID, userUID) => {
    const planetRefString = planetID.toString();
    const docref = await admin.firestore().collection("admin").doc("gameData").collection("planetData").doc(planetRefString);
    const result = await docref.get();
    const planetData = result.data();
    if (!planetData.owner === userUID) {
        console.log("User doesnt own the planet they are trying to update");
        return;
    }
    const batch = admin.firestore().batch();
    if (planetData.upgrading)
        return planetData;
    const timed = upgrade_times_json_1.default[planetData.level].split(':');
    planetData.upgrading = true;
    planetData.upgradeFinishedTime = dayjs_1.default.utc()
        .add(parseInt(timed[0]), 'hour')
        .add(parseInt(timed[1]), 'minute')
        .add(parseInt(timed[2]), 'second')
        .toISOString();
    batch.set(docref, planetData);
    await batch.commit();
    return planetData;
};
exports.default = updatePlanet;
