export const CONE_FRAGMENT_SHADER = `#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Shadow parameters
uniform float u_shadowIntensity;  // Overall shadow darkness
uniform float u_shadowSoftness;   // How soft the shadow edges are
uniform float u_coneShape;        // Controls the cone-like shape of shadows
uniform vec2 u_lightPosition;     // Dynamic light position based on mouse

// Color uniforms
uniform vec4 u_color1;  // Primary shadow color
uniform vec4 u_color2;  // Secondary shadow color
uniform float u_colorBlend;  // How much to blend between colors

float createShadowGradient(vec2 position, vec2 lightPos, float intensity, float softness) {
    // Calculate distance from current pixel to light source
    vec2 delta = position - lightPos;
    float dist = length(delta);
    
    // Create base shadow gradient
    float shadow = smoothstep(0.0, 1.0 - softness, dist);
    
    // Apply cone shape
    float angle = atan(delta.y, delta.x);
    float cone = cos(angle) * u_coneShape;
    shadow = mix(shadow, shadow * (1.0 + cone), u_coneShape);
    
    // Intensify shadows
    shadow = pow(shadow, 1.0 + intensity);
    
    return shadow;
}

void main() {
    // Normalize pixel coordinates
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 pos = uv * 2.0 - 1.0;
    pos.x *= u_resolution.x / u_resolution.y;
    
    // Create base shadow
    float shadow = createShadowGradient(
        pos,
        u_lightPosition,
        u_shadowIntensity,
        u_shadowSoftness
    );
    
    // Add subtle variation over time
    float timeVariation = sin(u_time * 0.2) * 0.02;
    shadow += timeVariation;
    
    // Create vignette effect
    float vignette = 1.0 - length(uv - 0.5) * 1.2;
    vignette = smoothstep(0.0, 1.0, vignette);
    
    // Blend colors based on shadow value
    vec4 finalColor = mix(u_color1, u_color2, shadow * u_colorBlend);
    finalColor.a *= shadow * vignette;
    
    gl_FragColor = finalColor;
}`;
