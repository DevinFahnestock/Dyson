@import ../common/random;

float noise(vec2 coord, float size, float seed) {
    vec2 i = floor(coord);
    vec2 f = fract(coord);

    float a = random(i, size, seed);
    float b = random(i + vec2(1.0, 0.0), size, seed);
    float c = random(i + vec2(0.0, 1.0), size, seed);
    float d = random(i + vec2(1.0, 1.0), size, seed);

    vec2 cubic = f * f * (3.0 - 2.0 * f);

    return mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;
}