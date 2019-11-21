varying vec2 vUv;

uniform sampler2D texture;
uniform sampler2D texture2;

uniform float destroyAmount;

void main() 
{
	vec4 text;
	if (gl_FrontFacing)
		text = texture2D(texture, vUv);
	else
		text = texture2D(texture2, vUv);

	text.a = text.a - destroyAmount;
	gl_FragColor = text;
}