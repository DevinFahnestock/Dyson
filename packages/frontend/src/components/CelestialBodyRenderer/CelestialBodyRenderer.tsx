import React, { useEffect, useRef } from 'react'
import { Clock, Scene, WebGLRenderer, PerspectiveCamera } from 'three'

import type { CelestialBody } from '../../lib/pixelPlanets/core'

type CelestialBodyRendererProps = {
  celestialBody: CelestialBody
}

const CelestialBodyRenderer = ({ celestialBody }: CelestialBodyRendererProps) => {
  const renderContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rendererElement: any = null
    let animationFrameHandle: any = null
    const containerElement = renderContainerRef?.current

    if (containerElement) {
      const aspect = containerElement.clientWidth / containerElement.clientHeight

      const clock = new Clock()
      const scene = new Scene()

      scene.add(celestialBody.createNode())

      const renderer = new WebGLRenderer({ alpha: true })

      renderer.setSize(containerElement.clientWidth, containerElement.clientHeight)

      renderer.setPixelRatio(window.devicePixelRatio)

      const camera = new PerspectiveCamera(55, aspect, 0.1, 100000)
      camera.position.z = 1

      function animate() {
        animationFrameHandle = window.requestAnimationFrame(animate)

        celestialBody.update(clock.getElapsedTime())

        //update camera
        camera.updateProjectionMatrix()
        renderer.render(scene, camera)
      }

      rendererElement = renderer.domElement
      renderContainerRef.current.appendChild(rendererElement)
      animate()
    }

    return () => {
      rendererElement && containerElement?.removeChild(rendererElement)
      animationFrameHandle && window.cancelAnimationFrame(animationFrameHandle)
    }
  }, [renderContainerRef, celestialBody])

  return (
    <div
      ref={renderContainerRef}
      style={{ height: '100px', width: '100px', minHeight: '100px', minWidth: '100px' }}
      className='renderer'
    ></div>
  )
}

export default React.memo(CelestialBodyRenderer)
