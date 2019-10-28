# GL Architecture Notes

OpenGL and by extension WebGL are extremely flexible rendering API's. Consequently there are a vast amount of ways to program OpenGL.

This program uses the following model/architecture/assumptions

## Pipeline

This program uses a "Forward Rendering" model. In other words for each object in a scene we run a vertex and a fragment shader. Web GL 1.0's limitations make it more complex to defer shading or pursue other strategies.

## Alpha/Transparency

For now alpha is disabled. The complexity of arranging verticies and sorting by `z` is out of scope.

## Shaders

- Shaders are almost entirely hand written
- Shaders allow for template literals in `${yourVariable}`, this saves on constants, _beware of using these to specify array sizes_
- Template literals used to specify array size will lead to trouble with the exception of three hard coded cases:
  - `u_dirLight[${n}]` will be filled with `DirLight` structs
  - `u_posLight[${n}]` will be filled with `PosLight` structs
  - `u_spotLight[${n}]` will be filled with `SpotLight` structs

## GPU Memory

This program puts _everything_ in GPU memory. During the render loop the correct buffer/attribute pointers are activated if they're not already active. Uniforms are copied each loop, in some cases on a per object basis.

Programs are also kept in memory, as the number of programs are based on the number of different lighting combinations, configurations should limit changing the number of lights in a scene in real time.

For many applications this is not a scalable approach but for this application it should work in most cases.

## Rendering objects

- Objects (Shapes) only get one material for all faces
- Objects (Shapes) are made up of meshes (verticies, texcoords, normals) and materials (textures or colours)
