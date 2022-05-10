import "./App.css"
import PlanetTile from "./components/PlanetTile/PlanetTile"

function App() {
  const planets = [
    {
      imgsrc: "assets/planets/Baren.png",
      type: "Baren",
    },
    {
      imgsrc: "assets/planets/Ice.png",
      type: "Ice",
    },
    {
      imgsrc: "assets/planets/Lava.png",
      type: "Lava",
    },
    {
      imgsrc: "assets/planets/Terran.png",
      type: "Terran",
    },
  ]

  return (
    <div className="App">
      <nav>
        <a href="">Home</a>
      </nav>
      <header>
        <h1>Dyson</h1>
      </header>
      <div className="Planetview">
        <h3>Planets:</h3>
        <div className="Planetgrid">
          {planets.map((planet) => (
            <PlanetTile planet={planet} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
