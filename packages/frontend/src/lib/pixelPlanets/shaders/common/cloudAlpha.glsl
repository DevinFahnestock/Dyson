@import ./fractalBrownianMotion;

float cloudAlpha(vec2 uv, float time, float timeSpeed, int iterations, int octaves) {
    float c_noise = 0.0;

    // more iterations for more turbulence
    for(int i = 0; i < iterations; i++) {
        c_noise += circleNoise((uv * size * 0.3) + (float(i + 1) + 10.) + (vec2(time * timeSpeed, 0.0)));
    }
    
    float fbm = fractalBrownianMotion(uv * size + c_noise + vec2(time * timeSpeed, 0.0), octaves);

    return fbm;
}