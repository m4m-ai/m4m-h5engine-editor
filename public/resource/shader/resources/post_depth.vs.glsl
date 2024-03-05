#version 300 es

#ifdef GL_FRAGMENT_PRECISION_HIGH  
precision highp float;  
#else  
precision mediump float;  
#endif 
layout(location = 0) in highp vec3    _glesVertex;  
//in vec3 _glesNormal;
//uniform highp mat4 glstate_matrix_modelview;
uniform highp mat4 glstate_matrix_mvp;      
// out highp vec3 xlv_Normal;                
       
void main()                                     
{        
    // highp mat3 normalMat=mat3(
    //     glstate_matrix_mvp[0],
    //     glstate_matrix_mvp[1],
    //     glstate_matrix_mvp[2]);

    // xlv_Normal=normalMat * _glesNormal;
    // xlv_Normal+=1.0;
    // xlv_Normal*=0.5;

    gl_Position = (glstate_matrix_mvp * vec4(_glesVertex,1.0));  
}