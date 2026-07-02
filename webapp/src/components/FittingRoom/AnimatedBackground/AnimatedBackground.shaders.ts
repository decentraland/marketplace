const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_overlayTex;

varying vec2 v_uv;

const vec4 innerColor = vec4(0.749, 0.0, 1.0, 1.0);
const vec4 outerColor = vec4(0.3176, 0.0235, 0.5176, 1.0);
const float vignetteRadius = 0.167;
const float vignetteSmoothness = 0.5;
const vec4 overlayColor = vec4(1.0, 1.0, 1.0, 1.0);
const float overlayTiling = 1.66;
const vec2 overlayDirection = vec2(1.0, -1.25);
const float overlaySpeed = 0.06;
const float overlayAlpha = 0.573;
const vec4 glowColor = vec4(0.5725, 0.0588, 0.6392, 1.0);
const float glowStrength = 0.17;
const vec2 glowRadiusVec = vec2(0.05, 0.13);
const float glowSmoothness = 3.61;
const vec2 glowCenter = vec2(0.68, 0.5);
const float luminosityStrength = 0.541;

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = v_uv;

  vec2 centerUV = uv - 0.5;
  float rad = length(centerUV);
  float mask = smoothstep(vignetteRadius + vignetteSmoothness, vignetteRadius, rad);
  vec4 vignette = mix(outerColor, innerColor, mask);

  float aspect = u_resolution.x / u_resolution.y;
  vec2 overlayUV = uv;
  overlayUV.x *= overlayTiling * aspect;
  overlayUV.y *= overlayTiling;
  overlayUV += u_time * overlayDirection * overlaySpeed;
  vec4 overlay = texture2D(u_overlayTex, overlayUV) * overlayColor;
  overlay.a *= overlayAlpha * mask;

  vec3 vignetteHSV = rgb2hsv(vignette.rgb);
  vec3 overlayHSV = rgb2hsv(overlay.rgb);
  float val = mix(0.5, 1.0, overlayHSV.z);
  vec3 luminosityBlend = hsv2rgb(vec3(vignetteHSV.x, vignetteHSV.y, val));
  float luminosityBlendAmount = overlay.a * luminosityStrength;
  vec4 result = vec4(mix(vignette.rgb, luminosityBlend, luminosityBlendAmount), 1.0);

  vec2 glowDelta = (uv - glowCenter) / glowRadiusVec;
  glowDelta.x *= aspect;
  float glowDist = length(glowDelta);
  float glowMask = 1.0 - smoothstep(1.0, 1.0 + glowSmoothness, glowDist);
  vec4 glow = glowColor * glowMask * glowStrength;
  result.rgb += glow.rgb * glow.a;

  gl_FragColor = result;
}
`

export { FRAGMENT_SHADER, VERTEX_SHADER }
