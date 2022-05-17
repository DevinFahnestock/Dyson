"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchAllPlanetDataByUser = async (admin, userUID) => {
    console.log("fetching planet data for user ID: ", userUID);
    const planetData = await admin.firestore().collection("admin").doc("gameData").collection("planetData");
    const planets = await planetData.where('owner', '==', userUID).get();
    const results = [];
    planets.docs.map(doc => {
        results.push(doc.data());
    });
    return results;
};
exports.default = fetchAllPlanetDataByUser;
