export const LIQUID_FRAGMENT_SHADER = `#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_color_0;
uniform vec4 u_color_1;
uniform vec4 u_color_2;
uniform float u_noiseScale;
uniform float u_noiseSpeed;
uniform float u_noiseIntensity;
uniform vec3 u_noiseWeights;
uniform float u_blendSoftness;
uniform float u_flowSpeed;

// Improved noise function for smoother gradients
vec2 random2(vec2 st) {
    st = vec2(dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

// Smooth noise implementation
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    // Quintic interpolation curve
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    
    float a = dot(random2(i), f);
    float b = dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
    
    return mix(
        mix(a, b, u.x),
        mix(c, d, u.x),
        u.y
    );
}

// Smooth blend function
float smoothBlend(float value, float softness) {
    return smoothstep(0.0, softness, value) * (1.0 - smoothstep(1.0 - softness, 1.0, value));
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    
    // Create flowing movement
    float flowTime = u_time * u_flowSpeed;
    vec2 flow = vec2(
        sin(flowTime * 0.5) * 0.5,
        cos(flowTime * 0.3) * 0.5
    );
    
    // Layer multiple noise functions for organic movement
    float n1 = noise((uv + flow) * u_noiseScale);
    float n2 = noise((uv - flow * 0.8) * u_noiseScale * 1.5);
    float n3 = noise((uv + flow * 1.2) * u_noiseScale * 2.0);
    
    // Combine noise layers with weights
    float combined = (
        n1 * u_noiseWeights.x +
        n2 * u_noiseWeights.y +
        n3 * u_noiseWeights.z
    ) / (u_noiseWeights.x + u_noiseWeights.y + u_noiseWeights.z);
    
    // Apply intensity and smoothing
    combined = mix(0.5, combined, u_noiseIntensity);
    combined = smoothBlend(combined, u_blendSoftness);
    
    // Smooth color mixing
    vec4 color;
    if (combined < 0.5) {
        float t = smoothstep(0.0, 0.5, combined);
        color = mix(u_color_0, u_color_1, t);
    } else {
        float t = smoothstep(0.5, 1.0, combined);
        color = mix(u_color_1, u_color_2, t);
    }
    
    gl_FragColor = color;
}`;
