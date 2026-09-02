/**
 * Шейдеры для фигуры на первом экране.
 *
 * Вершинный шейдер гонит точки сферы по фрактальному шуму и подтягивает
 * поверхность к курсору. Нормали пересчитываются вручную: без этого свет
 * ложится так, будто объект остался ровной сферой, и весь объём пропадает.
 */

// Симплекс-шум 3D — Ashima Arts / Stefan Gustavson, public domain.
const SIMPLEX_NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uPointerStrength;
uniform vec3  uPointer;
uniform float uScroll;

varying vec3  vNormalView;
varying vec3  vViewDir;
varying float vShade;

${SIMPLEX_NOISE}

// Три октавы дают рельеф: крупная форма плюс мелкая рябь поверх.
float fbm(vec3 p) {
  float n = snoise(p);
  n += 0.5 * snoise(p * 2.03);
  n += 0.25 * snoise(p * 4.01);
  return n / 1.75;
}

float shapeNoise(vec3 dir) {
  float t = uTime * 0.18;
  return fbm(dir * uFrequency + vec3(0.0, t, t * 0.6));
}

vec3 displace(vec3 p) {
  vec3 dir = normalize(p);
  float n = shapeNoise(dir);

  // Курсор мягко вытягивает поверхность в свою сторону.
  float d = distance(dir, normalize(uPointer));
  float pull = smoothstep(1.25, 0.0, d) * uPointerStrength;

  // На скролле фигура становится беспокойнее — связывает её с движением страницы.
  float amp = uAmplitude * (1.0 + uScroll * 0.6);
  return p + dir * (n * amp + pull * 0.18);
}

void main() {
  vec3 p = position;
  float radius = length(p);
  vec3 displaced = displace(p);

  // Ортонормированный базис в точке. vec3(0,1,0) вырождается на полюсах,
  // поэтому там подменяем опорный вектор.
  vec3 n = normalize(p);
  vec3 ref = abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 tangent = normalize(cross(n, ref));
  vec3 bitangent = normalize(cross(n, tangent));

  // Смещаем двух соседей по касательной и берём нормаль к получившейся плоскости.
  float eps = 0.035;
  vec3 pa = displace(normalize(p + tangent * eps) * radius);
  vec3 pb = displace(normalize(p + bitangent * eps) * radius);
  vec3 newNormal = normalize(cross(pa - displaced, pb - displaced));

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);

  vNormalView = normalize(normalMatrix * newNormal);
  vViewDir = normalize(-mvPosition.xyz);
  vShade = shapeNoise(n);

  gl_Position = projectionMatrix * mvPosition;
}
`

export const fragmentShader = /* glsl */ `
uniform vec3 uColorDeep;
uniform vec3 uColorMid;
uniform vec3 uColorRim;

varying vec3  vNormalView;
varying vec3  vViewDir;
varying float vShade;

void main() {
  vec3 n = normalize(vNormalView);
  vec3 v = normalize(vViewDir);

  // Френель: края светятся, центр остаётся тёмным. Отсюда ощущение объёма
  // на почти чёрном фоне, где обычное освещение не читается.
  float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.6);
  float shade = clamp(vShade * 0.5 + 0.5, 0.0, 1.0);

  vec3 color = mix(uColorDeep, uColorMid, smoothstep(0.15, 0.9, shade));
  color += uColorRim * fresnel * 1.35;

  vec3 lightDir = normalize(vec3(0.4, 0.9, 0.6));
  float spec = pow(max(dot(reflect(-v, n), lightDir), 0.0), 32.0);
  color += vec3(1.0, 0.92, 0.85) * spec * 0.35;

  gl_FragColor = vec4(color, 1.0);

  #include <colorspace_fragment>
}
`
