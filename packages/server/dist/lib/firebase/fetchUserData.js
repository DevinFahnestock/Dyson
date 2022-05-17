"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchUserData = async (admin, userUID) => {
    console.log("fetching user data for ID: ", userUID);
    const result = await admin.firestore().collection("admin").doc("gameData").collection("userData").doc(userUID).get("planets");
    if (!result.exists) {
        console.log("No user Data exists on the server, creating new user");
        return null;
    }
    return result.data();
};
exports.default = fetchUserData;
