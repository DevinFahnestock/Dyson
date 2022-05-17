bool dither(vec2 uv1, vec2 uv2, float pixels) {
    return mod(uv1.x + uv2.y, 2.0 / pixels) <= 1.0 / pixels;
}