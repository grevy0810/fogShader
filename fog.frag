#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform float fogNear;
uniform float fogFar;
uniform vec3 fogFocus;
varying vec4 vertColor;
varying vec2 texCoord;

void main() {
    // Calcular la distancia del fragmento al punto de foco
    float distanceToFocus = distance(gl_FragCoord.xyz, vec3(fogFocus));

    // Calcular la intensidad de la niebla basada en la distancia al punto de foco
    float fogFactor = smoothstep(fogNear, fogFar, distanceToFocus);

    // Color del cubo
    vec4 texColor = texture2D(tex0, texCoord);

    // Color del fondo
    vec4 backgroundColor = vec4(200.0/255.0, 200.0/255.0, 200.0/255.0, 1.0);

    // Mezclar el color del cubo con el color de la niebla
    vec4 finalColor = mix(texColor, backgroundColor, fogFactor);

    gl_FragColor = finalColor * vertColor;
}
