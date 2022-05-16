@import ../common/fractalBrownianMotion;
@import ../common/rotate;
@import ../common/spherify;

float pixels = 100.0;
float light_border_1 = 0.4;
float light_border_2 = 0.6;
float size = 10.0;
int OCTAVES = 5;

varying vec3 vUv;

uniform float rotation;
uniform vec2 light_origin;
uniform float time_speed;
uniform float river_cutoff;
uniform vec4 color1;
uniform vec4 color2;
uniform vec4 color3;
uniform float seed;
uniform float time;

void main() {
     // pixelize uv
    vec2 uv = (floor(vUv.xy * pixels) / pixels) + 0.5;

    float d_light = distance(uv, light_origin);

    // cut out a circle
    float d_circle = distance(uv, vec2(0.5));

    // stepping over 0.5 instead of 0.49999 makes some pixels a little buggy
    float a = step(d_circle, 0.49999);

    // give planet a tilt
    uv = rotate(uv, rotation);

    // map to sphere
    uv = spherify(uv);

    // some scrolling noise for landmasses
    float fbm1 = fractalBrownianMotion(uv * size + vec2(time * time_speed, 0.0), OCTAVES, size, seed);
    float river_fbm = fractalBrownianMotion(uv + fbm1 * 2.5, OCTAVES, size, seed);

    river_fbm = step(river_cutoff, river_fbm);

    // apply colors
    vec4 col = color1;
    if(d_light > light_border_1) {
        col = color2;
    }

    if(d_light > light_border_2) {
        col = color3;
    }

    a *= step(river_cutoff, river_fbm);
    gl_FragColor = vec4(col.rgb, a * col.a);
}