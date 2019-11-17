varying vec2 vUv;

uniform sampler2D texture;
uniform sampler2D texture2;

void main() 
{
	if (gl_FrontFacing)
		gl_FragColor = texture2D(texture, vUv);
	else
		gl_FragColor = texture2D(texture2, vUv);
}