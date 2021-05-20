# I Learned WebGL
![image](https://user-images.githubusercontent.com/36866793/118912729-35dbe080-b8f6-11eb-832d-5a41da7ffd78.png)

If you know OpenGL you know WebGL, that's what I learned with this.
Shaders + GLSL are the same and a lot of the GL code stays similar.

The only difference with WebGL is you get access to the powerful web ecosystem of libraries on NPM.
For instance `gl-matrix` offers ways generate and do simple modifications to your matrices like scaling and multiplying as well as providing functions to generate either in orthographic (2D) or perspective (3D).

ViteJS was a nice bonus to make this work go really fast, reloads were essentially instantaneous and with the `?raw` import flag from vite, loading in raw text for the shaders was hassleless.

Overall, a very interesting experience considering I've done a bit with OpenGL in C++ & Java.
Also was fun using vite in a practical way for the first time.