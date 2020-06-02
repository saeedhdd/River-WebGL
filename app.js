const CYLINDER_POINT_COUNT = 20;

var vertexShaderText =
    [




        'precision mediump float;',
        '',

        // 'attribute vec4 a_Normal;' ,      // Normal
        'attribute vec3 vertPosition;',
        'attribute vec3 vertColor;',

        ' attribute vec3 aVertexNormal;',


        'varying vec3 fragColor;',

        // 'uniform vec3 u_LightColor;' , // Light color
        // 'uniform vec3 u_LightDirection;' , // Light direction (in the world coordinate, normalized)
        'uniform mat4 u_MvpMatrix ;',
        'uniform mat4 uNormalMatrix ;',
        // 'varying highp vec3 vLighting;\n ;',
        '',

        'void main()',
        '{',
        '  gl_Position = u_MvpMatrix*vec4(vertPosition, 1.0);',
        '      highp vec3 ambientLight = vec3(0.15, 0.15, 0.15);\n' ,
        // '      highp vec3 aVertexNormal = vec3(0, 1, 1);\n' ,
        '      highp vec3 directionalLightColor = vec3(1, 1, 1);\n' ,
        '      highp vec3 directionalVector = normalize(vec3(.5, 0.5, 1));\n' ,
        '\n' ,
        '      highp float directional = max(dot(aVertexNormal.xyz, directionalVector), 0.0);\n' ,
        '      fragColor = ambientLight + (directionalLightColor * vertColor*directional);\n',
        '}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
// 'varying highp vec3 vLighting;\n',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 7.0);',

'}'
].join('\n');

var prevtime ;
var waveStart = -0.25;
var RiverWidth = 95;
var RiverHight = 80;
var numberOfElementsPerVertex = 9;
var a ;


function draw() {
    // var a = triangleNormal([0,0,0],[1,0,0],[0,1,0]);
    // console.log(canvas.width);
    var program = gl.createProgram();
    gl.clearColor(204.0/256, 1, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    gl.useProgram(program);
	var currentTime= performance.now();
    var dif = currentTime-prevtime;
    prevtime = currentTime;
    if (waveStart>=1.25){waveStart=-0.25;}
    if (dif>=40){
    	waveStart+= 0.01;
	}

    var c = makeLandscape();
    var b = makeRiverSurface([waveStart, waveStart+0.05], [waveStart+0.05, waveStart+0.2], [waveStart+0.2, waveStart+0.25], 1.5);
    var triangleVertices = a.concat(c).concat(b).concat(d).concat(f).concat(e);
    // var normals = RiverNormals(triangleVertices);

    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    // var u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
    // var u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection');
    //
    //
    // gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    // Set the light direction (in the world coordinate)
    // var lightDirection = new Vector3([-10.0,-5.0, -10.0]);
    // lightDirection.normalize();     // Normalize
    // gl.uniform3fv(u_LightDirection, lightDirection.elements);


    var g_MvpMatrix = new Matrix4(); // Model view projection matrix
    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 1000.0);
    // viewProjMatrix.lookAt(100, -10.0, 45.0, 40.0, 40.0, 0.0, 0.0, 0.0, 1.0);
    // viewProjMatrix.lookAt(-10, 20, 25.0, 100.0, 80.0, 0.0, 0.0, 0.0, 1.0);
    // viewProjMatrix.lookAt(-99, 50, 50.0, 30.0, 25.0, 5.0, 0.0, 0.0, 1.0);
    viewProjMatrix.lookAt(-30, -30, 30.0, 80.0, 80.0, 5.0, 0.0, 0.0, 1.0);
    g_MvpMatrix.set(viewProjMatrix);
    // g_MvpMatrix.rotate(90, 0.0, 0.0, 1.0); // Rotation around x-axis
    // g_MvpMatrix.rotate(-90, 0.0, 1.0, 0.0); // Rotation around y-axis
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);


    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    gl.enable(gl.DEPTH_TEST);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    var normalAttribLoacation = gl.getAttribLocation(program, 'aVertexNormal');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
            normalAttribLoacation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            6 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );




    // initArrayBuffer(gl, program,'a_Normal', normals, 3, gl.FLOAT);

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    gl.enableVertexAttribArray(normalAttribLoacation);



    //
    // Main render loop
    //
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length / numberOfElementsPerVertex);

    var tree = new FractalTree([0.164, 0.349, 0.149], [60.0, -5.0, 0.0], [0.0, 0.0, 1.0], 8.0, 0, 4, 5, 60, 0.75, 0.3);
    tree.draw(gl, g_MvpMatrix);
    // var tree2 = new FractalTree([0.164, 0.349, 0.149], [85.0, 50.0, 0.0], [0.0, 0.0, 1.0], 6.0, 0, 4, 5, 60, 0.75, 0.25);
    // tree2.draw(gl, g_MvpMatrix);
    // var tree2 = new FractalTree([200.0/256, 100.0/256, 0.0], [40.0, 100.0, 0.0], [0.0, 0.0, 1.0], 5.0, 0, 4, 5, 60, 0.75, 0.15);
    // tree2.draw(gl, g_MvpMatrix);
    // var tree3 = new FractalTree([0.164, 0.349, 0.149], [60.0, 90.0, 0.0], [0.0, 0.0, 1.0], 5.0, 0, 4, 5, 60, 0.75, 0.1);
    // tree3.draw(gl, g_MvpMatrix);
    // var tree4 = new FractalTree([0.164, 0.349, 0.149], [90.0, 25.0, 0.0], [0.0, 0.0, 1.0], 5.0, 0, 4, 5, 60, 0.75, 0.20);
    // tree4.draw(gl, g_MvpMatrix);
    // var tree5 = new FractalTree([0.164, 0.349, 0.149], [85, 40.0, 0.0], [0.0, 0.0, 1.0], 5.0, 0, 4, 5, 60, 0.75, 0.1);
    // tree5.draw(gl, g_MvpMatrix);

    requestAnimationFrame(draw);

}





var d,f,e;

var canvas, vertexShader,fragmentShader ,gl;
var InitDemo = function () {
	console.log('This is working');
    a=makeHillSurface(60,-5,1,40, new Float32Array([ 204.0/256,178.0/256, 178.0/256]));
    d=makeHillSurface(55,45,0.8,30, new Float32Array([ 204.0/256,178.0/256, 158.0/256]));
    f=makeHillSurface(10,70,1,40, new Float32Array([ 204.0/256,178.0/256, 178.0/256]));
    e =makeHillSurface(-30,40,1.5,10, new Float32Array([ 204.0/256,178.0/256, 178.0/256]));

	 canvas = document.getElementById('game-surface');
	 gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

    //
	// Create shaders
	// 
	 vertexShader = gl.createShader(gl.VERTEX_SHADER);
	 fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

    //
	// Create buffer
	//




    draw();

};





function createGrid(RiverWidth, RiverHight, initialHight , waveFirstPart , waveSecondPart, waveThirdPart,WaveSize) {
	let Grid = [];
    for (let i = 0; i < RiverWidth; i++) {
        let a = [];
        for (let j = 0; j < RiverHight; j++) {
            if (i > (waveFirstPart[0] * RiverWidth) & i < (waveFirstPart[1] * RiverWidth)) {
                scaledX = (i - waveFirstPart[0] * RiverWidth) / (waveFirstPart[1]-waveFirstPart[0]) / RiverWidth;
                a.push([i, j, initialHight - Math.sin(Math.PI * scaledX) / 2.5]);
            }
            else if (i > (waveSecondPart[0] * RiverWidth) & i < (waveSecondPart[1] * RiverWidth)) {
                scaledX = (i - waveSecondPart[0] * RiverWidth) / (waveSecondPart[1]-waveSecondPart[0]) / RiverWidth;
                a.push([i, j, initialHight + WaveSize * Math.sin(Math.PI * scaledX)]);
            }
            else if (i > (waveThirdPart[0] * RiverWidth) & i < (waveThirdPart[1] * RiverWidth)) {
                scaledX = (i - waveThirdPart[0] * RiverWidth) / (waveThirdPart[1]-waveThirdPart[0]) / RiverWidth;
                a.push([i, j, initialHight - Math.sin(Math.PI * scaledX) / 2.5]);
            }
            else {
                a.push([i, j, initialHight]);
            }
        }

        Grid.push(a);
    }
    return Grid;
}



var makeRiverSurface = function (waveFirstPart , waveSecondPart, waveThirdPart,WaveSize){
    var RGB = new Float32Array([0.25, 0.64, 0.87]);
    var RGB2 = new Float32Array([0.25, 0.64, 0.87]);
	var initialHight = 1;
	let RiverCoordinatess = [];
	let RiverCoordinates = [];

    let Grid = createGrid(RiverWidth, RiverHight, initialHight,waveFirstPart , waveSecondPart, waveThirdPart ,WaveSize);
    // console.log(Grid);

    Grid = variateHights(Grid);
    var i = 0; var j=0;




    for (let i = 0; i < Grid.length-1 ; i++) {
        for (let j = 0; j < Grid[0].length-1 ; j++) {

			RiverCoordinatess.push(Grid[i][j]);
			RiverCoordinatess.push(RGB);
            RiverCoordinatess.push(triangleNormal(Grid[i][j],Grid[i+1][j],Grid[i][j+1]));

            RiverCoordinatess.push(Grid[i+1][j]);
            RiverCoordinatess.push(RGB);
            RiverCoordinatess.push(triangleNormal(Grid[i][j],Grid[i+1][j],Grid[i][j+1]));

            RiverCoordinatess.push(Grid[i][j+1]);
            RiverCoordinatess.push(RGB);
            RiverCoordinatess.push(triangleNormal(Grid[i][j],Grid[i+1][j],Grid[i][j+1]));

            RiverCoordinatess.push(Grid[i+1][j]);
            RiverCoordinatess.push(RGB2);
            RiverCoordinatess.push(triangleNormal(Grid[i+1][j+1],Grid[i][j+1],Grid[i+1][j]));

            RiverCoordinatess.push(Grid[i][j+1]);
            RiverCoordinatess.push(RGB2);
            RiverCoordinatess.push(triangleNormal(Grid[i+1][j+1],Grid[i][j+1],Grid[i+1][j]));

            RiverCoordinatess.push(Grid[i+1][j+1]);
            RiverCoordinatess.push(RGB2);
            RiverCoordinatess.push(triangleNormal(Grid[i+1][j+1],Grid[i][j+1],Grid[i+1][j]));

        }
    }

    for (let i = 0; i < RiverCoordinatess.length ; i++) {
        for (let j = 0; j <3 ; j++) {
			RiverCoordinates.push(RiverCoordinatess[i][j]);
        }
    }

    // console.log(RiverCoordinates);
    for (let i = 0; i < RiverCoordinates.length; i++) {
    	if(i % numberOfElementsPerVertex <= 0 ){
			RiverCoordinates[i] = RiverCoordinates[i]-15;

        }
    }
    // console.log(RiverCoordinates);
  	return RiverCoordinates;

}
var Variated = false

var makeHillSurface = function (a,b,r,h,RGB){
    var RGB2 = RGB;
    // var RGB2 = new Float32Array([ 105.0/256,77.0/256, 77.0/256]);
	var initialHight = 0;


    let Grid = createGrid(RiverWidth, RiverHight, initialHight,[0,0] , [0,0], [0,0] ,0);
    for (let k = 0; k < Grid.length ; k++) {
        for (let l = 0; l <Grid[0].length ; l++) {
            Grid[k][l][2] = Math.sqrt((Math.pow(Grid[k][l][0]-40,2)+Math.pow(Grid[k][l][1]-40,2)))/(-r)+h;
        }
    }
    for (let k = 0; k < Grid.length ; k++) {
        for (let l = 0; l <Grid[0].length ; l++) {
            Grid[k][l][0] += a;
            Grid[k][l][1] += b;
        }
    }
    // for (let k = 0; k < Grid.length ; k++) {
    //     for (let l = 0; l <Grid[0].length ; l++) {
    //         rotateX(Grid[k][l],5);
    //     }
    // }
	let RiverCoordinatess = [];
	let RiverCoordinates = [];

    // console.log(Grid);
        Grid = variateHightsHill(Grid);
    var i = 0; var j=0;



    for (let i = 0; i < Grid.length-1 ; i++) {
        for (let j = 0; j < Grid[0].length-1 ; j++) {

			RiverCoordinatess.push(Grid[i][j]);
			RiverCoordinatess.push(RGB);
            RiverCoordinatess.push(triangleNormal(Grid[i][j],Grid[i+1][j],Grid[i][j+1]));

            RiverCoordinatess.push(Grid[i+1][j]);
            RiverCoordinatess.push(RGB);
            RiverCoordinatess.push(triangleNormal(Grid[i][j],Grid[i+1][j],Grid[i][j+1]));

            RiverCoordinatess.push(Grid[i][j+1]);
            RiverCoordinatess.push(RGB);
            RiverCoordinatess.push(triangleNormal(Grid[i][j],Grid[i+1][j],Grid[i][j+1]));

            RiverCoordinatess.push(Grid[i+1][j]);
            RiverCoordinatess.push(RGB2);
            RiverCoordinatess.push(triangleNormal(Grid[i+1][j+1],Grid[i][j+1],Grid[i+1][j]));

            RiverCoordinatess.push(Grid[i][j+1]);
            RiverCoordinatess.push(RGB2);
            RiverCoordinatess.push(triangleNormal(Grid[i+1][j+1],Grid[i][j+1],Grid[i+1][j]));

            RiverCoordinatess.push(Grid[i+1][j+1]);
            RiverCoordinatess.push(RGB2);
            RiverCoordinatess.push(triangleNormal(Grid[i+1][j+1],Grid[i][j+1],Grid[i+1][j]));

        }
    }

    for (let i = 0; i < RiverCoordinatess.length ; i++) {
        for (let j = 0; j <3 ; j++) {
			RiverCoordinates.push(RiverCoordinatess[i][j]);
        }
    }

    // console.log(RiverCoordinates);
    // for (let i = 0; i < RiverCoordinates.length; i++) {
    // 	if(i % numberOfElementsPerVertex <= 1 ){
		// 	RiverCoordinates[i] = RiverCoordinates[i]*80/RiverWidth;
    //
		// }
    // }
    // console.log(RiverCoordinates);
  	return RiverCoordinates;

}

var makeLandscape = function () {
    var RGB = new Float32Array([0.375, 0.5, 0.219]);
    var RGB2 = new Float32Array([0.25, 0.64, 0.87]);
    var result = [];
    result.push([-40,-40,0]);
    result.push(RGB);
    result.push([0,0,1]);

    result.push([canvas.width-1,-40,0]);
    result.push(RGB);
    result.push([0,0,1]);

    result.push([-40,canvas.height-1,0]);
    result.push(RGB);
    result.push([0,0,1]);

    result.push([canvas.width-1,canvas.height,0]);
    result.push(RGB);
    result.push([0,0,1]);

    result.push([-40,canvas.height-1,0]);
    result.push(RGB);
    result.push([0,0,1]);

    result.push([canvas.width-1,-40,0]);
    result.push(RGB);
    result.push([0,0,1]);



    //

    result.push([0,0,0.1]);
    result.push(RGB2);
    result.push([0,0,1]);

    result.push([80,0,0.1]);
    result.push(RGB2);
    result.push([0,0,1]);

    result.push([0,80,0.1]);
    result.push(RGB2);
    result.push([0,0,1]);

    result.push([80,80,0.1]);
    result.push(RGB2);
    result.push([0,0,1]);

    result.push([0,80,0.1]);
    result.push(RGB2);
    result.push([0,0,1]);

    result.push([80,0,0.1]);
    result.push(RGB2);
    result.push([0,0,1]);

    var finalRes=[];
    for (let i = 0; i < result.length ; i++) {
        for (let j = 0; j <3 ; j++) {
            finalRes.push(result[i][j]);
        }
    }
    return finalRes;
}

var variateHights = function(Grid){
    for (let i = 0; i < Grid.length-1 ; i++) {
        for (let j = 0; j < Grid[0].length-1 ; j++) {
			Grid[i][j][2] += (Math.random()-0.5)*0.3;
        }
    }
	return Grid;
}
var variateHightsHill = function(Grid){
    for (let i = 0; i < Grid.length-1 ; i++) {
        for (let j = 0; j < Grid[0].length-1 ; j++) {
			Grid[i][j][2] += (Math.random()-0.7)*2;
        }
    }
	return Grid;
}


function initArrayBuffer (gl, program ,attribute, data, num, type) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return true;
}

function triangleNormal(v1,v2,v3) {
    var output = new Float32Array(3);
    var x0 = v1[0];
    var y0 = v1[1];
    var z0 = v1[2];
    var x1 = v2[0];
    var y1 = v2[1];
    var z1 = v2[2];
    var x2 = v3[0];
    var y2 = v3[1];
    var z2 = v3[2];




    var p1x = x1 - x0
    var p1y = y1 - y0
    var p1z = z1 - z0

    var p2x = x2 - x0
    var p2y = y2 - y0
    var p2z = z2 - z0

    var p3x = p1y * p2z - p1z * p2y
    var p3y = p1z * p2x - p1x * p2z
    var p3z = p1x * p2y - p1y * p2x

    var mag = Math.sqrt(p3x * p3x + p3y * p3y + p3z * p3z)
    if (mag === 0) {
        output[0] = 0
        output[1] = 0
        output[2] = 1
    } else {
        output[0] = p3x / mag
        output[1] = p3y / mag
        output[2] = p3z / mag
    }

    return output;
}



function rotateZ(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c*m[0]-s*m[1];
    m[4] = c*m[4]-s*m[5];
    m[8] = c*m[8]-s*m[9];

    m[1]=c*m[1]+s*mv0;
    m[5]=c*m[5]+s*mv4;
    m[9]=c*m[9]+s*mv8;
}

function rotateX(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[1], mv5 = m[5], mv9 = m[9];

    m[1] = m[1]*c-m[2]*s;
    m[5] = m[5]*c-m[6]*s;
    m[9] = m[9]*c-m[10]*s;

    m[2] = m[2]*c+mv1*s;
    m[6] = m[6]*c+mv5*s;
    m[10] = m[10]*c+mv9*s;
}

function rotateY(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c*m[0]+s*m[2];
    m[4] = c*m[4]+s*m[6];
    m[8] = c*m[8]+s*m[10];

    m[2] = c*m[2]-s*mv0;
    m[6] = c*m[6]-s*mv4;
    m[10] = c*m[10]-s*mv8;
}
