precision mediump float;

attribute vec2 vPosition;
attribute vec3 vColor;
varying vec3 fColor;
uniform vec3 theta;
uniform float scale;
uniform vec3 translate;
uniform float middle_coorinates;
uniform mat4 projection;
uniform mat4 view;

void main() {
  fColor = vColor;
  gl_Position = vec4(vPosition, 0.0, 1.0);

  mat4 translasi_perspektif = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, -2.0, 1.0         // Kita geser setiap verteks sejau 2 unit menjauhi kamera, untuk memastikan seluruh bagian kubus ada di antara near dan far.
  );

  mat4 translasi = mat4(
      1, 0, 0, translate.x,
      0, 1, 0, translate.y,
      0, 0, 1, translate.z,
      0, 0, 0, 1
  );

  
  vec3 angle = radians(theta);
  vec3 c = cos(angle);
  vec3 s = sin(angle);
  
  mat4 rx = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, c.x, s.x, 0.0,
    0.0, -s.x, c.x, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
  
  mat4 ry = mat4(
    c.y, 0.0, -s.y, 0.0,
    0.0, 1.0, 0.0, 0.0,
    s.y, 0.0, c.y, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
  
  mat4 rz = mat4(
    c.z, s.z, 0.0, 0.0,
    -s.z, c.z, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  vec4 rotated_position = vec4(vPosition, 0.0, 1.0);
  vec4 middle_x = vec4(middle_coorinates, 0, 0, 1.0);
  vec4 middle_vector = middle_x;

  mat4 Skalasi = mat4(
      0.2       , 0             , 0, 0,
      0           , 0.2             , 0, 0,
      0           , 0             , 1, 0,
      0           , 0             , 0, 1
  );

  mat4 pseudo_rotate = mat4(
      scale       , 0             , 0, -(middle_vector.x)*scale+middle_vector.x,
      0           , 1             , 0, 0,
      0           , 0             , 1, 0,
      0           , 0             , 0, 1
  );
  vec4 final_position = rotated_position * translasi * pseudo_rotate * Skalasi;
  gl_Position = projection * view * translasi_perspektif * final_position;
}
