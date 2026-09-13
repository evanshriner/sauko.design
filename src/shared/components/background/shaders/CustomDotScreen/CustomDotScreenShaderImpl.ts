import { BlendFunction, Effect } from 'postprocessing';

import { Uniform, WebGLRenderer, WebGLRenderTarget } from 'three';

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

  update(_renderer: WebGLRenderer, _inputBuffer: WebGLRenderTarget, deltaTime = 0) {
    // Increment the time uniform on each frame
    const timeUniform = this.uniforms.get('u_time');

    if (timeUniform !== undefined) {
      timeUniform.value += deltaTime;
    }
  }
}
