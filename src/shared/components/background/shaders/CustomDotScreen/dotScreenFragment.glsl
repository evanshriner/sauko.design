uniform vec2 center;
uniform float angle;
uniform float scale;
uniform vec2 tSize;

uniform sampler2D tDiffuse;

varying vec2 vUv;

float pattern() {

    float s = sin( angle ), c = cos( angle );

    vec2 tex = vUv * tSize - center;
    vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

    return ( sin( point.x ) * sin( point.y ) ) * 4.0;

}


float random(vec2 p) {

    vec2 k1 = vec2(23.14069263277926, 2.665144142690225);
    
    return fract( cos(dot(p, k1)) * 12345.6789 );
}

void mainUv(inout vec2 uv) {

    vec4 color = texture2D( tDiffuse, vUv );

    vec2 uvrandom = vUv;

    uvrandom.y *= random(vec2(uvrandom.y, 0.4));

    color.rgb += random(uvrandom) *0.3;

    gl_FragColor = color;
}