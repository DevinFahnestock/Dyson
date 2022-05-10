import "./App.css"
import PlanetTile from "./components/PlanetTile/PlanetTile"

function App() {
  const planets = [
    {
      id: 1,
      imgsrc: "assets/planets/Baren.png",
      type: "Baren",
      level: 1,
    },
    {
      id: 2,
      imgsrc: "assets/planets/Ice.png",
      type: "Ice",
      level: 1,
    },
    {
      id: 3,
      imgsrc: "assets/planets/Lava.png",
      type: "Lava",
      level: 1,
    },
    {
      id: 4,
      imgsrc: "assets/planets/Terran.png",
      type: "Terran",
      level: 1,
    },
  ]

  return (
    <div className="App">
      <nav>
        <a href="http://localhost:3000/">Home</a>
      </nav>
      <header>
        <h1>Dyson</h1>
      </header>
      <div className="Planetview">
        <h3>Planets:</h3>
        <div className="Planetgrid">
          {planets.map((planet) => (
            <PlanetTile key={planet.id} planet={planet} upgradeClick={() => {
              
            }}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
