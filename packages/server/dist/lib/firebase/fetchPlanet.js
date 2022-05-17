"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchPlanetData = async (admin, planetID) => {
    console.log("fetching planet data for ID: ", planetID);
    const planetData = await admin.firestore().collection("admin").doc("gameData").collection("planetData").doc(planetID);
    return planetData;
};
exports.default = fetchPlanetData;
