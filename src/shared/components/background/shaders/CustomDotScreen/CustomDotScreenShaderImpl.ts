import { BlendFunction, Effect } from 'postprocessing';

import { Uniform, Vector2 } from 'three';

import dotScreenVertex from './dotScreenVertex.glsl';
import dotScreenFragment from './dotScreenFragment.glsl';

export class CustomDotScreenShaderImpl extends Effect {
  constructor() {
    super(
      'CustomDotScreenShader', // Effect name
      dotScreenFragment, // Fragment shader
      {
        // Options
        blendFunction: BlendFunction.NORMAL,
        uniforms: new Map([
          ['tDiffuse', new Uniform(0)],
          ['tSize', new Uniform(new Vector2(256, 256))],
          ['center', new Uniform(new Vector2(0.5, 0.5))],
          ['angle', new Uniform(1.57)],
          ['scale', new Uniform(4)],
        ]),
        vertexShader: dotScreenVertex,
      },
    );
  }

  //   // You can add an update(renderer, inputBuffer, deltaTime) method
  //   // if your effect needs to update uniforms frame by frame based on logic
  //   // For simple uniform changes via props, the wrapper component handles it.
  //   update(renderer, inputBuffer, deltaTime) {
  //     // this.uniforms.get('intensity').value = ...; // if dynamically changing
  //   }
}
