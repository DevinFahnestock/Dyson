@import ./noise;

float fractalBrownianMotion(vec2 coord, int octaves, float size, float seed) {
    float value = 0.0;
    float scale = 0.5;

    for(int i = 0; i < octaves; i++) {
        value += noise(coord, size, seed) * scale;
        coord *= 2.0;
        scale *= 0.5;
    }

    return value;
}