import React, { useEffect, useRef } from "react";
import {
  Clock,
  // Group,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Vector2,
} from "three";

import BasePlanet from "../../lib/pixelPlanets/bodies/planets/BasePlanet";
import { Color } from "../../lib/pixelPlanets/core";

const GlRender = () => {
  const renderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id: any = null;
    let rendererElement: any = null
    const containerElement = renderContainerRef?.current

    if (containerElement) {
      const aspect =
      containerElement.clientWidth /
      containerElement.clientHeight;

      const renderer = new WebGLRenderer();

      renderer.setSize(
        containerElement.clientWidth,
        containerElement.clientHeight
      );

      renderer.setPixelRatio(window.devicePixelRatio);

      const camera = new PerspectiveCamera(75, aspect, 0.1, 100000);
      camera.position.z = 1;

      const clock = new Clock();
      const scene = new Scene();
      const planet = new BasePlanet(
        12345,
        {
          color1: new Color(155, 158, 184),
          color2: new Color(71, 97, 124),
          color3: new Color(53, 57, 85),
        },
        { position: new Vector2(), intensity: 0.1 }
      );

      scene.add(planet.createNode());

      function animate() {
        id = window.requestAnimationFrame(animate);

        planet.update(clock.getElapsedTime());

        //update camera
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      }

      rendererElement = renderer.domElement
      renderContainerRef.current.appendChild(rendererElement);
      animate();
    }

    return () => {
      rendererElement && containerElement?.removeChild(rendererElement)
      id && window.cancelAnimationFrame(id);
    };
  }, [renderContainerRef]);

  return (
    <div
      ref={renderContainerRef}
      style={{ height: "300px", width: "300px" }}
      className="renderer"
    ></div>
  );
};

export default GlRender;
