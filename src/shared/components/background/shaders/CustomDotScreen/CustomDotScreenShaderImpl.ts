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
        blendFunction: BlendFunction.NORMAL,
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
}
