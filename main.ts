import vsRaw from './assets/shaders/vs.glsl?raw';
import fsRaw from './assets/shaders/fs.glsl?raw';
import { initShaderProgram } from './src/shader/Shader.util';
import { initBuffers } from './src/buffer/Buffer.util';
import { mat4, ReadonlyVec3 } from 'gl-matrix';

const dims = {width: document.body.clientWidth, height: document.body.clientHeight}
const zoom = {value: 1, min: 0.1, max: 100};
const translate = [0, 0, -6];

function main() {
    const canvas = document.querySelector('canvas')!;
    canvas.width = dims.width;
    canvas.height = dims.height;
    const gl = canvas.getContext('webgl');

    if (gl === null) {
        alert('Unable to initialize WebGL');
        return;
    }

    const shaderProgram = initShaderProgram(gl, vsRaw, fsRaw)!;
    const programInfo: ProgramInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')!,
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')!,
        },
    };

    renderScene(gl, programInfo, initBuffers(gl));
    window.addEventListener('resize', (event) => {
        canvas.width = dims.width = document.body.clientWidth;
        canvas.height = dims.height = document.body.clientHeight;
        renderScene(gl, programInfo, initBuffers(gl));
    })
    
    window.addEventListener('wheel', (e: WheelEvent) => {
        zoom.value += e.deltaY / 500;
        if(zoom.value > zoom.max) zoom.value = zoom.max;
        if(zoom.value < zoom.min) zoom.value = zoom.min;
        renderScene(gl, programInfo, initBuffers(gl));
    })

    let mousedown = false;
    window.addEventListener('mousedown', () => {
        mousedown = true;
    })

    window.addEventListener('mouseup', () => {
        mousedown = false;
    })
    
    window.addEventListener('mousemove', (e) => {
        if(mousedown) {
            translate[0] += e.movementX ;
            translate[1] += -e.movementY;
            renderScene(gl, programInfo, initBuffers(gl));
        }
    })

    window.addEventListener('keyup', (e) => {
        if(e.key === "Escape") {
            translate[0] = 0
            translate[1] = 0
        }
    })
}

type ProgramInfo = {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: number;
    };
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation;
        modelViewMatrix: WebGLUniformLocation;
    };
};

function renderScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: any) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 45 * Math.PI / 180;
    const canvas = gl.canvas as HTMLCanvasElement;
    const aspect = dims.width / dims.height;
    const zNear = 0.1;
    const zFar = 100.0;

    // # Projection Matrix
    const projectionMatrix = mat4.create();
    // mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    mat4.ortho(projectionMatrix, -dims.width/2, dims.width/2, -dims.height/2, dims.height/2, zNear, zFar);
    
    // # Model View Matrix
    const modelViewMatrix = mat4.create();
    const translateCopy:ReadonlyVec3 = [translate[0], translate[1], translate[2]];
    mat4.translate(modelViewMatrix, modelViewMatrix, translateCopy)
    mat4.scale(modelViewMatrix, modelViewMatrix, [100, 100, zoom.value])

    {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

        gl.useProgram(programInfo.program);

        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)

        {
            const offset = 0;
            const vertexCount = 4;
            gl.viewport(0, 0, dims.width, dims.height)
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }
}

window.onload = main;
