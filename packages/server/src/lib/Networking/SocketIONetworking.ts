import { INetworking } from "./INetworking";
import { Server, Socket } from "socket.io";
import { IPlanetService, IUserService, IWarehouseService } from "../service";
import { PlanetType } from "../shared";

export class SocketIONetworking implements INetworking {
  protected readonly port: number;
  protected readonly server: Server;
  protected readonly planetService: IPlanetService;
  protected readonly userService: IUserService;
  protected readonly warehouseService: IWarehouseService


  constructor(
    port: number,
    planetService: IPlanetService,
    userService: IUserService,
    warehouseService: IWarehouseService
  ) {
    this.port = port;
    this.server = new Server(this.port);
    this.planetService = planetService;
    this.userService = userService;
    this.warehouseService = warehouseService
  }

  public listenForConnections() {
    console.log("waiting on connection");
    this.server.on("connection", (socket) => {
      console.log(
        "Connection established with socket ID: ",
        socket.handshake.address
      );

      this.onUpgradePlanet(socket);
      this.onUserStateChange(socket);
      this.onStartPlanetUpgrade(socket);
    });
  }

  private onUpgradePlanet(socket: Socket) {
    socket.on("checkCompleteUpgrade", async ({ planetID, userID }) => {
      const newPlanetData = await this.planetService.checkForUpgradeCompleted(
        userID,
        planetID
      );

      if (newPlanetData) {
        socket.emit("planetUpdate", newPlanetData);
      }
    });
  }

  private onUserStateChange(socket: Socket) {
    socket.on("userStateChanged", async (user: User) => {
      const userData = await this.userService.fetchUser(user);

      if (userData) {
        socket.emit(
          "updateAllPlanets",
          await this.planetService.getUserPlanets(user.uid)
        );

        return userData;
      }

      //create starter planets
      await this.planetService.createPlanet(user.uid, PlanetType.Lava);
      await this.planetService.createPlanet(user.uid, PlanetType.Wet);
      await this.planetService.createPlanet(user.uid, PlanetType.NoAtmosphere);
      await this.planetService.createPlanet(user.uid, PlanetType.Lava);

      //create warehouse
      const warehouseID = await this.warehouseService.createWarehouse(user.uid)

      console.log(await this.warehouseService.getWarehouse(warehouseID, user.uid))
      socket.emit(
        "updateAllPlanets",
        await this.planetService.getUserPlanets(user.uid)
      );
    });
  }

  private onStartPlanetUpgrade(socket: Socket) {
    socket.on("upgradePlanet", async ({ planetID, userID }) => {
      const data = await this.planetService.startPlanetUpgrade(
        planetID,
        userID
      );

      socket.emit("planetUpdate", data);
    });
  }
}
