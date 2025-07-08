import { BlendFunction, Effect } from 'postprocessing';

import { Uniform, Vector2 } from 'three';

import dotScreenVertex from './dotScreenVertex.glsl';
import dotScreenFragment from './dotScreenFragment.glsl';

export class CustomDotScreenShaderImpl extends Effect {
  constructor({ strength = 0.25 } = {}) {
    super(
      'CustomDotScreenShader', // Effect name
      dotScreenFragment, // Fragment shader
      {
        // Options
        blendFunction: BlendFunction.ADD,
        uniforms: new Map([
          ['u_strength', new Uniform(strength)],
          ['u_time', new Uniform(0)]
        ]),
        vertexShader: dotScreenVertex,
      },
    );
  }

  update(renderer, inputBuffer, deltaTime) {
    // Increment the time uniform on each frame
    this.uniforms.get('u_time').value += deltaTime;
  }
  //   // You can add an update(renderer, inputBuffer, deltaTime) method
  //   // if your effect needs to update uniforms frame by frame based on logic
  //   // For simple uniform changes via props, the wrapper component handles it.
  //   update(renderer, inputBuffer, deltaTime) {
  //     // this.uniforms.get('intensity').value = ...; // if dynamically changing
  //   }
}
