uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653509793238;


float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

mat2 rotate2D(float angle){
    return mat2(
        cos(angle),-sin(angle),
        sin(angle),cos(angle)
    );
}

float lines(vec2 uv, float offset) {
    return smoothstep(
        0.,
        0.5 + offset*0.5,
        abs(0.5*(sin(uv.x*20.) + offset*2.))
    );
}

void main() {
    float n = noise(vPosition + time);

    // vec3 color1 = vec3(120./255.,158./255.,113./255.);
    // vec3 color3 = vec3(0.,0.,0.);
    // vec3 color2 = vec3(224./255.,148./255.,66./255.);

    vec3 color1 = vec3(2./255.,103./255.,93./255.);
    vec3 color3 = vec3(39./255.,36./255.,33./255.);
    vec3 color2 = vec3(20./255.,204./255.,96./255.);

    vec2 b_uv = rotate2D(n)*vPosition.xy*0.1;

    float pattern = lines(b_uv, 0.5);

    float pattern2 = lines(b_uv, 0.1);


    vec3 mixedColors = mix(color1,color2,pattern);
    vec3 mixedColors2 = mix(mixedColors,color3,pattern2);
    // gl_FragColor = vec4(n, 0.,0.0,1.);
    // gl_FragColor = vec4(b_uv,0.0,1.);
    gl_FragColor = vec4(vec3(mixedColors2),1.);
}