import { Socket } from "socket.io-client"

export const upgradeClick = (planetID: string, currentSocket: Socket, user: any) => {
  currentSocket?.emit("upgradePlanet", {
    planetID: planetID,
    userID: user.uid,
  })
}

export const onUpgradeTimeComplete = (planetID: string, currentSocket: Socket, user: any) => {
  currentSocket?.emit("checkCompleteUpgrade", {
    planetID: planetID,
    userID: user.uid,
  })
}
