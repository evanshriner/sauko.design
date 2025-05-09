varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653509793238;
void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}