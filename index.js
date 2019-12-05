(function() {
    let THRESHOLD = 0.01;
    let pergerakanCharX = 0.005
    let pergerakanCharY = 0.005
    let pergerakanCharZ = 0.005
    let arahCharX = 1.0;
    let arahCharY = 1.0;
    let arahCharZ = 1.0;
    let minX, minY,minZ,maxX,maxY,maxZ;
    let rotater = 1;
    function quatToMat(quat) { // output: matrix 3x3
        var x = quat[0];
        var y = quat[1];
        var z = quat[2];
        var w = quat[3];
        var n = w * w + x * x + y * y + z * z;
        var s = n === 0 ? 0 : 2 / n;
        var xw = s * w * x, wy = s * w * y, wz = s * w * z;
        var xx = s * x * x, xy = s * x * y, xz = s * x * z;
        var yy = s * y * y, yz = s * y * z, zz = s * z * z;
    
        return [
            1 - (yy + zz), xy - wz, xz + wy,
            xy + wz, 1 - (xx + zz), yz - xw,
            xz - wy, yz + xw, 1 - (xx + yy)];
    }
    
    function threetofour(input) {
        return [
            input[0], input[3], input[6], 0.0,
            input[1], input[4], input[7], 0.0,
            input[2], input[5], input[8], 0.0,
            0.0, 0.0, 0.0, 1.0,
        ];
    }
    const matrixMultiplication = (a,b) => {
        let c1,c2,c3,c4;
        c1 = a[0]*b[0] + a[4]*b[1] + a[8]*b[2] + a[12]*b[3]
        c2 = a[1]*b[0] + a[5]*b[1] + a[9]*b[2] + a[13]*b[3]
        c3 = a[2]*b[0] + a[6]*b[1] + a[10]*b[2] + a[14]*b[3]
        c4 = a[3]*b[0] + a[7]*b[1] + a[11]*b[2] + a[15]*b[3]
        return [c1,c2,c3,c4]
    } 

    const distancePointToPlane = (persamaanBidang, titik) => {
        let titikBaru = titik.slice(0,3)
        let num = Math.abs(persamaanBidang[0]*titikBaru[0] + 
            persamaanBidang[1]*titikBaru[1] + 
            persamaanBidang[2]*titikBaru[2] + persamaanBidang[3])
        let denum = Math.sqrt(persamaanBidang.slice(0,3).map(x => x*x).reduce((a,b) => a+b, 0))
        return num/denum
    }

    const detectCollision = (positionChar, KUBUS) => {
        nabrak = false
        // TOP
        for(i = 0; i < positionChar.length; i++){
            if(distancePointToPlane(KUBUS.TOP, positionChar[i]) < THRESHOLD){
                if(arahCharY > 0){
                    arahCharY = -1.0
                }
            }
        }
        // BOTTOM
        for(i = 0; i < positionChar.length; i++){
            if(distancePointToPlane(KUBUS.BOTTOM, positionChar[i]) < THRESHOLD ){
                if(arahCharY < 0){
                    arahCharY = 1.0
                }
            }
        }
        // FRONT
        for(i = 0; i < positionChar.length; i++){
            if(distancePointToPlane(KUBUS.FRONT, positionChar[i]) < THRESHOLD){
                if(arahCharZ > 0) {
                    arahCharZ = -1.0
                }
            }
        }
        // BACK
        for(i = 0; i < positionChar.length; i++){
            if(
                distancePointToPlane(KUBUS.BACK, positionChar[i]) < THRESHOLD
            ){
                if(arahCharZ < 0) {
                    arahCharZ = 1.0
                }
            }
        }
        // Right
        for(i = 0; i < positionChar.length; i++){
            if(
                distancePointToPlane(KUBUS.RIGHT, positionChar[i]) < THRESHOLD
            ){
                if(arahCharX > 0){
                    arahCharX = -1.0
                }
            }
        }
        // Left
        for(i = 0; i < positionChar.length; i++){
            if(
                distancePointToPlane(KUBUS.LEFT, positionChar[i]) < THRESHOLD
            ){
                if(arahCharX < 0){
                    arahCharX = 1.0
                }
            }
        }
    }

    
    let KUBUS = {
        TOP : null,
        BOTTOM : null,
        FRONT : null,
        BACK : null,
        RIGHT : null,
        LEFT : null,
    }
    const planeFromPoint = (A ,B, C) => {
        // return 1;
        let n = [], temp = [], temp2 = [];
        temp = glMatrix.vec3.subtract(temp,B,A);
        temp2= glMatrix.vec3.subtract(temp2,C,B);
        n = glMatrix.vec3.cross(n,temp,temp2);
    
        let D = 0;
        D = glMatrix.vec3.dot(n.map(x =>-x), A);
        // Equation = n_x X + n_y Y + n_z Z - D = 0
        return n.concat(D);
    }

    glUtils.SL.init({ callback: function() { main(); }});
    function main() {
        var canvas = document.getElementById("glcanvas");
        var gl = glUtils.checkWebGL(canvas);
        var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
        var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
        var program = glUtils.createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(program);

    // Mendefinisikan verteks-verteks
        var vertices = [];
        nPoints= [
            -0.1, 0.1, 0.0, 1.0, 1.0, 1.0,
            -0.05, 0.1, 0.0, 1.0, 1.0, 1.0,
            0.0, 0.03, 0.0, 1.0, 1.0, 1.0,
            0.05, 0.1, 0.0, 1.0, 1.0, 1.0,
            0.1, 0.1, 0.0, 1.0, 1.0, 1.0,
            0.03, 0.0, 0.0, 1.0, 1.0, 1.0,
            0.03, -0.1, 0.0, 1.0, 1.0, 1.0,
            -0.03, -0.1, 0.0, 1.0, 1.0, 1.0,
            -0.03, 0.0, 0.0, 1.0, 1.0, 1.0,
        ];
        charVertices = [
            [-0.1, 0.1, 0.0, 1.0],
            [-0.05, 0.1, 0.0, 1.0],
            [0.0, 0.03, 0.0, 1.0],
            [0.05, 0.1, 0.0, 1.0],
            [0.1, 0.1, 0.0, 1.0],
            [0.03, 0.0, 0.0, 1.0],
            [0.03, -0.1, 0.0, 1.0],
            [-0.03, -0.1, 0.0, 1.0],
            [-0.03, 0.0, 0.0, 1.0],
        ];


        var cubePoints = [
            [ -0.5, -0.5,  0.5 ],
            [ -0.5,  0.5,  0.5 ],
            [  0.5,  0.5,  0.5 ],
            [  0.5, -0.5,  0.5 ],
            [ -0.5, -0.5, -0.5 ],
            [ -0.5,  0.5, -0.5 ],
            [  0.5,  0.5, -0.5 ],
            [  0.5, -0.5, -0.5 ]
        ];
        var cubeColors = [
            [0.0, 0.0, 1.0], // biru
            [0.0, 0.0, 1.0], // biru
            [0.0, 0.0, 1.0], // biru
            [0.0, 0.0, 1.0], // biru
            [0.0, 0.0, 1.0], // biru
            [0.0, 0.0, 1.0], // biru
            [0.0, 0.0, 1.0], // biru
            [0.0, 0.0, 1.0], // biru
        ];

        cubeVertices = [
            [ -0.5, -0.5,  0.5 , 1], //0
            [ -0.5,  0.5,  0.5 , 1], //1
            [  0.5,  0.5,  0.5 , 1], //2
            [  0.5, -0.5,  0.5 , 1], //3
            [ -0.5, -0.5, -0.5 , 1], //4
            [ -0.5,  0.5, -0.5 , 1], //5
            [  0.5,  0.5, -0.5 , 1], //6
            [  0.5, -0.5, -0.5 , 1] //7
        ];

        function quad(a, b, c, d) {
            var indices = [a, b, c, d];
            for (var i = 0; i < indices.length; i++) {
            for (var j = 0; j < 3; j++) {
                vertices.push(cubePoints[indices[i]][j]);
            }
            for (var j = 0; j < 3; j++) {
                vertices.push(cubeColors[a][j]);
            }
            }
        }
        quad(1, 0, 0, 3);
        quad(3, 2, 2, 1);
        quad(5, 4, 4, 7);
        quad(7, 6, 6, 5);
        quad(1, 5, 2, 6);
        quad(0, 4, 3, 7);
        var ab = [0,1,2,0,2,8,2,3,4,2,4,5,5,6,8,6,7,8,2,5,8];
        for(var i = 0; i < ab.length; i++){
            for(var j = 0; j < 6; j++){
                vertices.push(nPoints[ab[i]*6+j]);
            }
        }

        console.log(vertices.length);
        console.log(vertices);

        // Membuat vertex buffer object (CPU Memory <==> GPU Memory)
        var vertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Membuat sambungan untuk attribute
        var vPosition = gl.getAttribLocation(program, 'vPosition');
        var vColor = gl.getAttribLocation(program, 'vColor');
        gl.vertexAttribPointer(
            vPosition,    // variabel yang memegang posisi attribute di shader
            3,            // jumlah elemen per atribut
            gl.FLOAT,     // tipe data atribut
            gl.FALSE, 
            6 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
            0                                   // offset dari posisi elemen di array
        );
        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(vPosition);
        gl.enableVertexAttribArray(vColor);

        // Membuat sambungan untuk uniform
        var thetaUniformLocation = gl.getUniformLocation(program, 'theta');
        var theta = 0;
        var thetaSpeed = 0.0;
        var axis = [true, true, true];
        var x = 0;
        var y = 1;
        var z = 2;

        // Definisi untuk matriks model
        var mmLoc = gl.getUniformLocation(program, 'modelMatrix');
        var mm = glMatrix.mat4.create();
        var mm2 = glMatrix.mat4.create();
        glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);
        glMatrix.mat4.translate(mm2, mm2, [0.0, 0.0, -2.0]);

        // Kontrol menggunakan keyboard
        function onKeyDown(event) {
        if (event.keyCode == 189) thetaSpeed -= 0.01;       // key '-'
            else if (event.keyCode == 187) thetaSpeed += 0.01;  // key '='
            else if (event.keyCode == 48) thetaSpeed = 0;       // key '0'
            if (event.keyCode == 88) axis[x] = !axis[x];
            if (event.keyCode == 89) axis[y] = !axis[y];
            if (event.keyCode == 90) axis[z] = !axis[z];
        }
        document.addEventListener('keydown', onKeyDown);

        // Definisi untuk matrix view dan projection
        var vmLoc = gl.getUniformLocation(program, 'viewMatrix');
        var vm = glMatrix.mat4.create();
        var pmLoc = gl.getUniformLocation(program, 'projectionMatrix');
        var pm = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(vm,
            [0.0, 0.0, 0.0], // di mana posisi kamera (posisi)
            [0.0, 0.0, -2.0], // ke mana kamera menghadap (vektor)
            [0.0, 1.0, 0.0]  // ke mana arah atas kamera (vektor)
        );
        gl.uniformMatrix4fv(vmLoc, false, vm);
        glMatrix.mat4.perspective(pm,
            glMatrix.glMatrix.toRadian(90), // fovy dalam radian
            canvas.width/canvas.height,     // aspect ratio
            0.5,  // near
            10.0, // far  
        );
        gl.uniformMatrix4fv(pmLoc, false, pm);

    var quatModelMatrix = glMatrix.quat.create();

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        theta += thetaSpeed;
        if (axis[z]) {
            glMatrix.mat4.rotateZ(mm, mm, thetaSpeed);
            glMatrix.mat4.rotateZ(mm2, mm2,thetaSpeed);
        }
        if (axis[y]) {
            glMatrix.mat4.rotateY(mm, mm, thetaSpeed); 
            glMatrix.mat4.rotateY(mm2, mm2, thetaSpeed);
        }
        
        if (axis[x]) {
            glMatrix.mat4.rotateX(mm, mm, thetaSpeed);
            glMatrix.mat4.rotateX(mm2, mm2, thetaSpeed);
        }
        gl.uniformMatrix4fv(mmLoc, false, mm);
        gl.drawArrays(gl.LINES, 0, 24);
        glMatrix.mat4.translate(mm2, mm2, [pergerakanCharX * arahCharX, pergerakanCharY * arahCharY, pergerakanCharZ * arahCharZ]);
        var quatMatrix = threetofour(quatToMat(quatModelMatrix));
        var finalModelMatrix = glMatrix.mat4.create();
        glMatrix.quat.rotateY(quatModelMatrix, quatModelMatrix, 0.1);
        glMatrix.mat4.multiply(finalModelMatrix, mm2, quatMatrix);
        gl.uniformMatrix4fv(mmLoc, false, finalModelMatrix);
        gl.drawArrays(gl.TRIANGLES, 24, 21);
        let positionCube = [];
        let positionChar = [];
        for(v = 0; v < cubeVertices.length; v++){
            let temp = matrixMultiplication(mm,cubeVertices[v]);
            positionCube.push(temp);
        }
        for(v = 0; v < charVertices.length; v++){
            let temp = matrixMultiplication(mm2,charVertices[v]);
            positionChar.push(temp);
        }

        KUBUS.TOP = planeFromPoint(positionCube[1], positionCube[2], positionCube[6]);
        KUBUS.BOTTOM = planeFromPoint(positionCube[0], positionCube[3], positionCube[4]);
        KUBUS.RIGHT = planeFromPoint(positionCube[2], positionCube[3], positionCube[6]);
        KUBUS.LEFT = planeFromPoint(positionCube[0], positionCube[1], positionCube[4]);
        KUBUS.BACK = planeFromPoint(positionCube[4], positionCube[5], positionCube[6]);
        KUBUS.FRONT = planeFromPoint(positionCube[0], positionCube[1], positionCube[2]);
        detectCollision(positionChar, KUBUS);
        requestAnimationFrame(render);
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    render();
  }
})();