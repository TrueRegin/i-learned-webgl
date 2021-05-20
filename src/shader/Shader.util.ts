export function initShaderProgram(gl: WebGLRenderingContext, vSource: string, fSource: string) {
    const vsHandle = loadShader(gl, gl.VERTEX_SHADER, vSource);
    const fsHandle = loadShader(gl, gl.FRAGMENT_SHADER, fSource);

    const shaderHandle = gl.createProgram();
    gl.attachShader(shaderHandle, vsHandle);
    gl.attachShader(shaderHandle, fsHandle);
    gl.linkProgram(shaderHandle);

    if(!gl.getProgramParameter(shaderHandle, gl.LINK_STATUS)) {
        alert(`Unable to initialize shader program: ${gl.getProgramInfoLog(shaderHandle)}`)
        return null;
    }

    return shaderHandle;
}

export function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`Error while compiling shader "${gl.getShaderInfoLog(shader)}"`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}