(function() {

  glUtils.SL.init({ callback: function() { main(); } });

  var shaders = [];
  var canvas = document.getElementById("glcanvas");
  var gl = glUtils.checkWebGL(canvas);
  
  var scale = 0;
  var adder = 0.0088;

  var xAdders = 0.04;
  var yAdders = 0.03;
  var zAdders = 0.02;
  var translate = [0.0, 0.0, 0.0];
  var rotAdder = 0.5;

  var theta = [0.0, 0.0, 0.0];
  var axis = 0;
  var xAxis = 0;
  var yAxis = 1;
  var zAxis = 2;

  function initShaders() {
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    var vertexShader2 = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
        fragmentShader2 = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);

    shaders.push(glUtils.createProgram(gl, vertexShader, fragmentShader));
    shaders.push(glUtils.createProgram(gl, vertexShader2, fragmentShader2));
  }

  function main() {
  
    // Inisialisasi shaders dan program
    initShaders();

    // gl.useProgram(shaders[0]);

    // Definisi verteks dan buffer
    /**
     * A (  -0.5, -0.5, 0.5)
     * B (  -0.5, 0.5,  0.5)
     * C (  0.5,  0.5,  0.5)
     * D (  0.5, -0.5,  0.5)
     * E (  -0.5, -0.5, -0.5)
     * F (  -0.5, 0.5,  -0.5)
     * G (  0.5,  0.5,  -0.5)
     * H (  0.5, -0.5,  -0.5)
     */
    var cubeVertices = [
      // x, y, z      r, g, b
      -0.5, 0.5,  0.5,   1.0, 0.0, 0.0, //BAD BDC MERAH DEPAN //keempat ganti sama kedua
      -0.5, -0.5, 0.5,   1.0, 0.0, 0.0,
      0.5, -0.5,  0.5,   1.0, 0.0, 0.0,
      -0.5, -0.5, 0.5,   1.0, 0.0, 0.0,
      0.5, -0.5,  0.5,   1.0, 0.0, 0.0,// Pertama dan terakhir ditambah diakhir
      0.5,  0.5,  0.5,   1.0, 0.0, 0.0,
      -0.5, 0.5,  0.5,   1.0, 0.0, 0.0,
      0.5,  0.5,  0.5,   1.0, 0.0, 0.0,

      0.5,  0.5,  0.5,   0.0, 1.0, 0.0, //CDH CHG HIJAU KANAN
      0.5, -0.5,  0.5,   0.0, 1.0, 0.0,
      0.5, -0.5,  -0.5,   0.0, 1.0, 0.0,
      0.5, -0.5,  0.5,   0.0, 1.0, 0.0,
      0.5, -0.5,  -0.5,   0.0, 1.0, 0.0,
      0.5,  0.5,  -0.5,   0.0, 1.0, 0.0,
      0.5,  0.5,  0.5,   0.0, 1.0, 0.0,
      0.5,  0.5,  -0.5,   0.0, 1.0, 0.0,

      0.5, -0.5,  0.5,   0.0, 0.0, 1.0, //DAE DEH BIRU BAWAH
      -0.5, -0.5, 0.5,   0.0, 0.0, 1.0,
      -0.5, -0.5, -0.5,   0.0, 0.0, 1.0,
      -0.5, -0.5, 0.5,   0.0, 0.0, 1.0,
      -0.5, -0.5, -0.5,   0.0, 0.0, 1.0,
      0.5, -0.5,  -0.5,   0.0, 0.0, 1.0,
      0.5, -0.5,  0.5,   0.0, 0.0, 1.0,
      0.5, -0.5,  -0.5,   0.0, 0.0, 1.0,

      -0.5, -0.5, -0.5,   1.0, 1.0, 0.0, //EFG EGH KUNING BELAKANG
      -0.5, 0.5,  -0.5,   1.0, 1.0, 0.0,
      0.5,  0.5,  -0.5,   1.0, 1.0, 0.0,
      -0.5, 0.5,  -0.5,   1.0, 1.0, 0.0,
      0.5,  0.5,  -0.5,   1.0, 1.0, 0.0,
      0.5, -0.5,  -0.5,   1.0, 1.0, 0.0,
      -0.5, -0.5, -0.5,   1.0, 1.0, 0.0,
      0.5, -0.5,  -0.5,   1.0, 1.0, 0.0,

      -0.5, 0.5,  -0.5,   0.0, 1.0, 1.0, //FEA FAB CYAN KIRI
      -0.5, -0.5, -0.5,   0.0, 1.0, 1.0,
      -0.5, -0.5, 0.5,   0.0, 1.0, 1.0,
      -0.5, -0.5, -0.5,   0.0, 1.0, 1.0,
      -0.5, -0.5, 0.5,   0.0, 1.0, 1.0,
      -0.5, 0.5,  0.5,   0.0, 1.0, 1.0,
      -0.5, 0.5,  -0.5,   0.0, 1.0, 1.0,
      -0.5, 0.5,  0.5,   0.0, 1.0, 1.0,

       0.5,  0.5, -0.5,  1.0, 0.0, 1.0, //GFB GBC MAGENTA ATAS
      -0.5, 0.5,  -0.5,  1.0, 0.0, 1.0,
      -0.5, 0.5,  0.5,   1.0, 0.0, 1.0,
      -0.5, 0.5,  -0.5,  1.0, 0.0, 1.0,
      -0.5, 0.5,  0.5,   1.0, 0.0, 1.0,
       0.5, 0.5,  0.5,   1.0, 0.0, 1.0,
       0.5,  0.5, -0.5,  1.0, 0.0, 1.0,
       0.5, 0.5,  0.5,   1.0, 0.0, 1.0,

    ];

    
    var triangleVertices = new Float32Array([
      +0.2, -0.5,   1,1,1, //1  
      +0.2, +0.5,   1,1,1, //2
      +0.3, -0.5,   1,1,1, //3
      +0.3, +0.5,   1,1,1, //3
      +0.3, -0.0,   1,1,1, //11
      +0.35, +0.2,  1,1,1, //4 titik tengah
      +0.35, -0.2,  1,1,1, //10 titik tengah
      +0.35, +0.2,  1,1,1, //4 titik tengah
      +0.4, -0.0,   1,1,1,//9
      +0.4, +0.5,   1,1,1,//5
      +0.5, +0.5,   1,1,1,//6
      +0.5, -0.5,   1,1,1,//7
      +0.4, -0.5,   1,1,1,//8
      +0.4, +0.5,   1,1,1,//5 
    ]);

    function render() {

      // Bersihkan buffernya canvas
      gl.clear(gl.COLOR_BUFFER_BIT);
    
      drawA(gl.TRIANGLE_STRIP, triangleVertices, 1, shaders[1])
      drawA(gl.LINES, cubeVertices, 0, shaders[0])
      
      // gl.drawArrays(gl.LINES, 0, 48);
      requestAnimationFrame(render); 
    }
    // Bersihkan layar jadi hitam
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    render();
  }

  function drawA(type, vertices, mode, program) {
    var n = initBuffers(mode, vertices, program);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }
    gl.drawArrays(type, 0, n);
  }

  function initBuffers(mode, vertices, program) {
    var n;
    if (mode) {
      n = vertices.length/5;
    } else {
      n = vertices.length/6;
    }
    // console.log(n)

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Definisi view dan projection
    var vmLoc = gl.getUniformLocation(program, 'view');
    var pmLoc = gl.getUniformLocation(program, 'projection');
    var vm = glMatrix.mat4.create();
    var pm = glMatrix.mat4.create();
    // console.log(pm);

    glMatrix.mat4.lookAt(vm,
      glMatrix.vec3.fromValues(0.0, 0.0, -0.5),    // posisi kamera
      glMatrix.vec3.fromValues(0.0, 0.0, -2.0),  // titik yang dilihat; pusat kubus akan kita pindah ke z=-2
      glMatrix.vec3.fromValues(0.0, 1.0, 0.0)   // arah atas dari kamera
    );

    var fovy = glMatrix.glMatrix.toRadian(90.0);
    var aspect = canvas.width / canvas.height;
    var near = 0.5;
    var far = 10.0;
    glMatrix.mat4.perspective(pm,
      fovy,
      aspect,
      near,
      far
    );

    gl.uniformMatrix4fv(vmLoc, false, vm);
    gl.uniformMatrix4fv(pmLoc, false, pm);

    var vPosition = gl.getAttribLocation(program, 'vPosition');
    var vColor = gl.getAttribLocation(program, 'vColor');

    function onKeyPress(event) {
      if (event.keyCode == 83 || event.keyCode == 115) {
        rotAdder = 0.0;
      } else if (event.keyCode == 80 || event.keyCode == 112) {
        rotAdder = 0.5;
      }

      if (event.keyCode == 88 || event.keyCode == 120) {
        axis = xAxis;
      } else if (event.keyCode == 89 || event.keyCode == 121) {
        axis = yAxis;
      } else if (event.keyCode == 90 || event.keyCode == 122) {
        axis = zAxis;
      }
    }
    document.addEventListener('keypress', onKeyPress);

    theta[axis] += rotAdder;  // dalam derajat

    if (mode) {
        var scaleLocation = gl.getUniformLocation(program, 'scale');
        gl.uniform1f(scaleLocation, scale);
        if (scale > 1){
          adder = -0.0088
        }
        else if (scale < -1){
          adder = 0.0088
        }

        scale += adder;
        // console.log(scale);
        
        gl.vertexAttribPointer(
            vPosition, // Variable yang memegang posisi atribut di shader
            2, // Jumlah element per attribut
            gl.FLOAT, // tipe data attribut
            gl.FALSE, 
            5 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex
            0 //offset dari posisi elemen di array
        );
    
        gl.vertexAttribPointer(
            vColor,
            3,
            gl.FLOAT,
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT,
            2 * Float32Array.BYTES_PER_ELEMENT
        );

        //Translasi X
        if (translate[0] + 0.5 + xAdders > 0.5*5 || translate[0] + 0.2 + xAdders < -0.5*5 ) {
          xAdders *= -1;
        }
        translate[0] += xAdders;

        var middleLoc = gl.getUniformLocation(program, 'middle_coorinates');
        middle_coordinates = 0.35 + translate[0];

        gl.uniform1f(middleLoc, middle_coordinates);
        // console.log(translate[0])

        //Translasi Y
        if (translate[1] + 0.5 + yAdders> 0.5*5 || translate[1] + -0.5 + yAdders < -0.5*5 ) {
          yAdders *= -1;
        }
        translate[1] += yAdders;

        //Translasi Z
        if (translate[2] + zAdders > 0.5*0.5 || translate[2] + zAdders < -0.5*0.5 ) {
          zAdders *= -1;
        }
        translate[2] += zAdders;

        var translationLoc = gl.getUniformLocation(program, 'translate');

        gl.uniform3fv(translationLoc, translate);

        var thetaLoc = gl.getUniformLocation(program, 'theta');

        gl.uniform3fv(thetaLoc, theta);
    } else{
        gl.vertexAttribPointer(
          vPosition,  // variabel yang memegang posisi attribute di shader
          3,          // jumlah elemen per attribute
          gl.FLOAT,   // tipe data atribut
          gl.FALSE,
          6 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks 
          0                                   // offset dari posisi elemen di array
        );
        
        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE, 
          6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

        var thetaLoc = gl.getUniformLocation(program, 'theta');

        gl.uniform3fv(thetaLoc, theta);

    }

    gl.enableVertexAttribArray(vPosition);
    gl.enableVertexAttribArray(vColor);
    return n;
  }

})();
