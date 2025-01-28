export const FRAGMENT_SHADER = `#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_noiseScale;
uniform float u_noiseSpeed;
uniform float u_noiseIntensity;
uniform vec3 u_noiseWeights;
uniform float u_blendSoftness;
uniform float u_flowSpeed;
uniform vec2 u_offset;
uniform vec3 u_camera_position;
uniform vec3 u_light_position;

uniform vec4 u_color_0_start;
uniform vec4 u_color_0_end;
uniform vec4 u_color_1_start;
uniform vec4 u_color_1_end;
uniform vec4 u_color_2_start;
uniform vec4 u_color_2_end;

uniform vec3 u_ball1_pos;
uniform vec3 u_ball2_pos;
uniform vec3 u_ball3_pos;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

vec2 random2(vec2 st) {
    st = vec2(dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
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

float smoothBlend(float value, float softness) {
    return smoothstep(0.0, softness, value) * (1.0 - smoothstep(1.0 - softness, 1.0, value));
}

// Function to calculate ambient occlusion
float calculateAO(vec3 normal, vec3 position) {
    float ao = 0.0;
    float scale = 0.5;
    float intensity = 0.8;
    
    // Sample points in a hemisphere around the normal
    for(int i = 0; i < 4; i++) {
        vec3 samplePos = position + normal * float(i) * scale;
        float dist = length(samplePos - position);
        ao += smoothstep(0.0, 1.0, dist) * intensity / float(i + 1);
    }
    
    return 1.0 - ao * 0.25;
}

void main() {
    // Calculate distances to each ball center
    float d1 = length(vPosition - u_ball1_pos);
    float d2 = length(vPosition - u_ball2_pos);
    float d3 = length(vPosition - u_ball3_pos);

    // Get UV coordinates and create noise pattern
    vec2 uv = vUv;
    float rotation = 0.25;
    float angle = atan(vPosition.z, vPosition.x) / (2.0 * 3.14159) + 0.5;
    uv.x = fract(uv.x + rotation);
    uv += u_offset;

    // Create flowing movement
    float flowTime = u_time * u_flowSpeed;
    vec2 flow = vec2(
        sin(flowTime * 0.5 + uv.x * 6.28318) * 0.5,
        cos(flowTime * 0.3 + uv.y * 3.14159) * 0.5
    );

    // Layer noise functions
    float n1 = noise((uv + flow) * u_noiseScale * 4.0);
    float n2 = noise((uv - flow * 0.8) * u_noiseScale * 6.0);
    float n3 = noise((uv + flow * 1.2) * u_noiseScale * 8.0);

    float noisePattern = (
        n1 * u_noiseWeights.x +
        n2 * u_noiseWeights.y +
        n3 * u_noiseWeights.z
    ) / (u_noiseWeights.x + u_noiseWeights.y + u_noiseWeights.z);

    noisePattern = mix(0.5, noisePattern, u_noiseIntensity);
    noisePattern = smoothBlend(noisePattern, u_blendSoftness);

    // Choose gradient based on closest ball
    vec4 baseColor;
  if (d1 <= d2 && d1 <= d3) {
    baseColor = mix(u_color_0_start, u_color_0_end, noisePattern);
} else if (d2 <= d3) {
    baseColor = mix(u_color_1_start, u_color_1_end, noisePattern);
} else {
    baseColor = mix(u_color_2_start, u_color_2_end, noisePattern);
}


    // Basic lighting
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(u_light_position - vPosition);
    vec3 viewDir = normalize(u_camera_position - vPosition);
    
    float diffuse = max(dot(normal, lightDir), 0.0);
    float ambient = 0.3;
    
    vec3 finalColor = baseColor.rgb * (ambient + diffuse);
    finalColor = clamp(finalColor, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

export const VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

uniform float u_time;
uniform float u_time_offset;
uniform float u_distortionAmount;
uniform float u_timeScale;
uniform vec3 u_distortionWeights;
uniform bool u_merge;
uniform float u_mergeProgress;
uniform vec3 u_targetPosition;
uniform int u_sphereIndex;

void main() {
    vUv = uv;
    
    // Base time for consistent speed
    float baseTime = u_time * u_timeScale;
    
    // Use time offset to create phase differences
    float phaseOffset = u_time_offset * 6.28318;
    
    // Create wave motion with phase offsets but consistent speed
    float wave1 = sin(position.x * 3.0 + baseTime * 2.0 + phaseOffset) * u_distortionAmount * u_distortionWeights.x;
    float wave2 = sin(position.y * 2.0 + baseTime * 2.0 + phaseOffset * 1.5) * u_distortionAmount * u_distortionWeights.y;
    float wave3 = sin(position.z * 4.0 + baseTime * 2.0 + phaseOffset * 0.7) * u_distortionAmount * u_distortionWeights.z;
    
    // Combine waves for more organic movement
    vec3 newPosition = vec3(
        position.x + (normal.x * (wave1 + wave2 + wave3)) * 0.001,
        position.y + (normal.y * (wave1 + wave2 + wave3)) * 0.001,
        position.z + (normal.z * (wave1 + wave2 + wave3)) * 0.001
    );
    
    // Transform vertex to world space
    vec4 worldPos = modelMatrix * vec4(newPosition, 1.0);
    
    // If merging and not the center sphere, move towards center
    if (u_merge && u_sphereIndex != 1) {
        vec3 moveDir = normalize(u_targetPosition - worldPos.xyz);
        worldPos.xyz = mix(worldPos.xyz, u_targetPosition, u_mergeProgress);
    }
    
    vWorldPosition = worldPos.xyz;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;
