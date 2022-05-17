"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const dayjs_1 = __importDefault(require("dayjs"));
dayjs_1.default.extend(duration_1.default);
dayjs_1.default.extend(utc_1.default);
const checkForUpgradeComplete = async (admin, planetID) => {
    const planetRefString = planetID.toString();
    const docref = await admin.firestore().collection("admin").doc("gameData").collection("planetData").doc(planetRefString);
    const result = await docref.get();
    const planetData = result.data();
    if (planetData.upgrading) {
        const upgradeFinishedTime = dayjs_1.default.utc(planetData.upgradeFinishedTime);
        const durationLeft = dayjs_1.default.duration(upgradeFinishedTime.diff(dayjs_1.default.utc()));
        if (durationLeft.asSeconds() <= 0) {
            //upgrade is finished, update planet
            planetData.level++;
            planetData.upgradeFinishedTime = null;
            planetData.upgrading = false;
            console.log(`Planet ${planetData.id} finished upgrading to level ${planetData.level}`);
            await docref.set(planetData);
            return planetData;
        }
        return null;
    }
};
exports.default = checkForUpgradeComplete;
