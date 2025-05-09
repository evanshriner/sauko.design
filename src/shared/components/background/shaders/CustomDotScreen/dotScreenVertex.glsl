varying vec2 vUv;

// this needs to be 'mainSupport' to be supported by the three postprocessing pipeline
void mainSupport(const in vec2 uv) {

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}