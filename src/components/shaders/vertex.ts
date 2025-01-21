export const VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float u_time;
uniform float u_time_offset;

float amount = 0.095;

void main() {
    vUv = uv;
    
    // Base time for consistent speed
    float baseTime = u_time * 0.2;
    
    // Use time offset to create phase differences
    float phaseOffset = u_time_offset * 6.28318; // Multiply by 2π for full rotation
    
    // Create wave motion with phase offsets but consistent speed
    float wave1 = sin(position.x * 3.0 + baseTime * 2.0 + phaseOffset) * amount;
    float wave2 = sin(position.y * 2.0 + baseTime * 2.0 + phaseOffset * 1.5) * amount;
    float wave3 = sin(position.z * 4.0 + baseTime * 2.0 + phaseOffset * 0.7) * amount;
    
    // Combine waves for more organic movement
    vec3 newPosition = vec3(
      position.x + normal.x * (wave1 + wave2 + wave3),
      position.y + normal.y * (wave1 + wave2 + wave3),
      // no movement in z direction
      position.z
    );
    
    // Update normal for lighting
    vNormal = normalize(normalMatrix * normal);

    vPosition = position;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;
