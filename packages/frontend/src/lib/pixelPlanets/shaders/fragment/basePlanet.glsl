@import ../common/fractalBrownianMotion;
@import ../common/dither;
@import ../common/rotate;

varying vec3 vUv;
uniform float lightIntensity;
uniform float pixels;
uniform float rotation;
uniform vec2 light_origin;
uniform float time_speed;
float dither_size = 2.0;
float light_border_1 = 0.4;
float light_border_2 = 0.6;
uniform vec4 color1;
uniform vec4 color2;
uniform vec4 color3;
float size = 10.0;
int OCTAVES = 20;
uniform float seed;
uniform float time;
bool should_dither = true;

void main() {
    vec2 uv = (floor(vUv.xy * pixels) / pixels) + 0.5;

    // check distance from center & distance to light
    float d_circle = distance(uv, vec2(0.5));
    float d_light = distance(uv, vec2(light_origin));

    // cut out a circle
    // stepping over 0.5 instead of 0.49999 makes some pixels a little buggy
    float a = step(d_circle, 0.49999);

    bool dith = dither(uv, vUv.xy, pixels);
    uv = rotate(uv, rotation);

    // get a noise value with light distance added
    // this creates a moving dynamic shape
    float fbm1 = fractalBrownianMotion(uv, OCTAVES, size, seed);
    d_light += fractalBrownianMotion(uv * size + fbm1 + vec2(time * 0.1 + time_speed, 0.0), OCTAVES, size, seed) * lightIntensity;

    // size of edge in which colors should be dithered
    float dither_border = (1.0 / pixels) * dither_size;

    // now we can assign colors based on distance to light origin
    vec4 col = color1;

    if(d_light > light_border_1) {
        col = color2;
        if(d_light < light_border_1 + dither_border && (dith || !should_dither)) {
            col = color1;
        }
    }

    if(d_light > light_border_2) {
        col = color3;
        if(d_light < light_border_2 + dither_border && (dith || !should_dither)) {
            col = color2;
        }
    }

    gl_FragColor = vec4(col.rgb, a * col.a);
}