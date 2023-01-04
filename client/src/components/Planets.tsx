import React, { useEffect } from 'react';
import { useScene } from 'babylonjs-hook';
import { StandardMaterial, Texture, MeshBuilder, Color3, Vector3, HighlightLayer } from '@babylonjs/core';

function Planets() {

  const scene = useScene();

  useEffect(() => {
    if (scene) {
      const sunMaterial = new StandardMaterial('sunMaterial', scene);
      sunMaterial.emissiveTexture = new Texture('assets/images/sun.png', scene);
      sunMaterial.diffuseColor = Color3.Black();
      sunMaterial.specularColor = Color3.Black();

      const sun = MeshBuilder.CreateSphere('sun', { segments: 16, diameter: 8 }, scene);
      sun.material = sunMaterial;

      const hl = new HighlightLayer('hl1', scene, { blurHorizontalSize: 1.5, blurVerticalSize: 1.5 });
      hl.addMesh(sun, Color3.White(), true);

      scene.registerBeforeRender(() => {
        sun.rotate(Vector3.Up(), 0.001);
      });

      const speeds = [0.005, -0.005, 0.0025];

      for (let i = 0; i < 5; i++) {
        const planetMaterial = new StandardMaterial('planetMaterial', scene);
        planetMaterial.diffuseTexture = new Texture(`assets/images/planet_${i + 1}.png`, scene);
        planetMaterial.specularColor = Color3.Black();

        const planet = MeshBuilder.CreateSphere(`planet${i}`, { segments: 16, diameter: 2 }, scene);
        planet.position.x = 4 * i + 16;
        planet.material = planetMaterial;

        const orbit = {
          radius: planet.position.x,
          speed: speeds[i],
          angle: 0
        }

        scene.registerBeforeRender(() => {
          planet.position.x = orbit.radius * Math.sin(orbit.angle);
          planet.position.z = orbit.radius * Math.cos(orbit.angle);
          orbit.angle += orbit.speed;
        });
      }
    }
  }, [scene]);

  return null;
}

export default Planets;
