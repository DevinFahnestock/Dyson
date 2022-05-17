float random(vec2 coord, float size, float seed) {
    coord = mod(coord, vec2(1.0, 1.0) * floor(size + 0.5));

    return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);
}