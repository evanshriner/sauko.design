uniform float u_strength;
uniform float u_time; 

float random(vec2 p, float time) {
    vec2 k1 = vec2(23.14069263277926, 2.665144142690225);
    return fract(sin(dot(p, k1) + time) * 43758.5453);
}

void mainUv(inout vec2 uv) {
    // Multiply time by a small value to slow down the animation
    float slowTime = u_time * 0.00001;
    float distortion = (random(vec2(uv.y, 0.9), slowTime) - 0.5) * 0.01;
    uv.y += distortion * u_strength;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float slowTime = u_time * 0.1;
    outputColor = inputColor;
    outputColor.rgb += random(uv, slowTime) * (0.1 * u_strength);
}