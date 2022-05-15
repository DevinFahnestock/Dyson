@import ../common/fractalBrownianMotion;
@import ../common/dither;
@import ../common/rotate;
@import ../common/spherify;

float cloud_curve = 1.3;
float light_border_1 = 0.4;
float light_border_2 = 0.6;
int OCTAVES = 4;

varying vec3 vUv;
uniform float size;
uniform float pixels;
uniform float rotation;
uniform float cloud_cover;
uniform vec2 light_origin;
uniform float time_speed;
uniform float stretch;
uniform vec4 base_color;
uniform vec4 outline_color;
uniform vec4 shadow_base_color;
uniform vec4 shadow_outline_color;
uniform float seed;
uniform float time;

float circleNoise(vec2 uv) {
    float uv_y = floor(uv.y);
    uv.x += uv_y * .31;
    vec2 f = fract(uv);
    float h = random(vec2(floor(uv.x), floor(uv_y)), size, seed);
    float m = (length(f - 0.25 - (h * 0.5)));
    float r = h * 0.25;

    return smoothstep(0.0, r, m * 0.75);
}

float cloud_alpha(vec2 uv) {
    float c_noise = 0.0;

     // more iterations for more turbulence
    for(int i = 0; i < 9; i++) {
        c_noise += circleNoise((uv * size * 0.3) + (float(i + 1) + 10.) + (vec2(time * time_speed, 0.0)));
    }

    float fbm = fractalBrownianMotion(uv * size + c_noise + vec2(time * time_speed, 0.0), OCTAVES, size, seed);

    return fbm;
}

void main() {
    // pixelize uv
    vec2 uv = (floor(vUv.xy * pixels) / pixels) + 0.5;

    // distance to light source
    float d_light = distance(uv, light_origin);

    // cut out a circle
    float d_circle = distance(uv, vec2(0.5));
    float a = step(d_circle, 0.5);

    float d_to_center = distance(uv, vec2(0.5));
    uv = rotate(uv, rotation);

    // map to sphere
    uv = spherify(uv);

    // slightly make uv go down on the right, and up in the left
    uv.y += smoothstep(0.0, cloud_curve, abs(uv.x - 0.4));
    float c = cloud_alpha(uv * vec2(1.0, stretch));

    // assign some colors based on cloud depth & distance from light
    vec4 col = base_color;
    if(c < cloud_cover + 0.03) {
        col = outline_color;
    }
    if(d_light + c * 0.2 > light_border_1) {
        col = shadow_base_color;

    }
    if(d_light + c * 0.2 > light_border_2) {
        col = shadow_outline_color;
    }

    c *= step(d_to_center, 0.5);
    gl_FragColor = vec4(col.rgb, step(cloud_cover, c) * a * col.a);
}

