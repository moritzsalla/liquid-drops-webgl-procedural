type UniformValue = number | number[];
type UniformMap = Map<string, WebGLUniformLocation | null>;

// Improvement: only calc u_dimensions on resize.
export class WebFrag {
	private gl: WebGLRenderingContext;
	private program: WebGLProgram | null = null;
	private uniforms: UniformMap = new Map();
	private vertexShader: WebGLShader;
	private frameId: number | null = null;
	private isDestroyed = false;
	private defaultUniforms: Record<string, UniformValue> = {};

	constructor(
		private canvas: HTMLCanvasElement,
		options: {
			antialias?: boolean;
			alpha?: boolean;
			premultipliedAlpha?: boolean;
			preserveDrawingBuffer?: boolean;
		} = {},
	) {
		const gl = canvas.getContext("webgl", {
			antialias: options.antialias ?? true,
			alpha: options.alpha ?? true,
			premultipliedAlpha: options.premultipliedAlpha ?? false,
			preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
		});

		if (!gl) throw new Error("WebGL not supported");
		this.gl = gl;

		this.setupGL();
		this.vertexShader = this.createVertexShader();
		this.createQuadBuffer();

		// Handle canvas resize
		this.handleResize = this.handleResize.bind(this);
		window.addEventListener("resize", this.handleResize);
	}

	private setupGL(): void {
		// Enable blending
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		// Setup viewport
		this.updateViewport();
	}

	private updateViewport(): void {
		const devicePixelRatio = window.devicePixelRatio || 1;
		const displayWidth = Math.floor(
			this.canvas.clientWidth * devicePixelRatio,
		);
		const displayHeight = Math.floor(
			this.canvas.clientHeight * devicePixelRatio,
		);

		if (
			this.canvas.width !== displayWidth ||
			this.canvas.height !== displayHeight
		) {
			this.canvas.width = displayWidth;
			this.canvas.height = displayHeight;
			this.gl.viewport(0, 0, displayWidth, displayHeight);
		}
	}

	private handleResize(): void {
		this.updateViewport();
	}

	private createVertexShader(): WebGLShader {
		const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
		if (!vertexShader) throw new Error("Failed to create vertex shader");

		this.gl.shaderSource(
			vertexShader,
			`
         attribute vec2 position;
         varying vec2 v_texCoord;
         
         void main() {
           v_texCoord = position * 0.5 + 0.5;
           gl_Position = vec4(position, 0.0, 1.0);
         }
       `,
		);
		this.gl.compileShader(vertexShader);

		if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
			const info = this.gl.getShaderInfoLog(vertexShader);
			throw new Error("Vertex shader compilation error: " + info);
		}

		return vertexShader;
	}

	private createQuadBuffer(): void {
		const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
		const buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
	}

	setShader(source: string): void {
		if (this.isDestroyed)
			throw new Error("WebFrag instance has been destroyed");

		const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		if (!fragmentShader) throw new Error("Failed to create fragment shader");

		try {
			this.gl.shaderSource(fragmentShader, source);
			this.gl.compileShader(fragmentShader);

			if (
				!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)
			) {
				const info = this.gl.getShaderInfoLog(fragmentShader);
				throw new Error("Fragment shader compilation error: " + info);
			}

			// Cleanup old program if it exists
			if (this.program) {
				this.gl.deleteProgram(this.program);
				this.uniforms.clear();
			}

			// Create and setup new program
			const program = this.gl.createProgram();
			if (!program) throw new Error("Failed to create program");

			this.program = program;
			this.gl.attachShader(program, this.vertexShader);
			this.gl.attachShader(program, fragmentShader);
			this.gl.linkProgram(program);

			if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
				const info = this.gl.getProgramInfoLog(program);
				throw new Error("Program link error: " + info);
			}

			this.gl.useProgram(program);

			// Setup position attribute
			const position = this.gl.getAttribLocation(program, "position");
			this.gl.enableVertexAttribArray(position);
			this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);

			// Reapply default uniforms
			Object.entries(this.defaultUniforms).forEach(([name, value]) => {
				this.setUniform(name, value);
			});
		} finally {
			// Cleanup fragment shader
			this.gl.deleteShader(fragmentShader);
		}
	}

	setUniform(name: string, value: number | number[], isDefault = false): void {
		if (this.isDestroyed)
			throw new Error("WebFrag instance has been destroyed");
		if (!this.program) return;

		if (isDefault) {
			this.defaultUniforms[name] = value;
		}

		let location = this.uniforms.get(name);
		if (!location) {
			location = this.gl.getUniformLocation(this.program, name);
			if (!location) return; // Uniform might have been optimized out
			this.uniforms.set(name, location);
		}

		try {
			if (typeof value === "number") {
				this.gl.uniform1f(location, value);
			} else if (value.length === 2) {
				this.gl.uniform2fv(location, value);
			} else if (value.length === 3) {
				this.gl.uniform3fv(location, value);
			} else if (value.length === 4) {
				this.gl.uniform4fv(location, value);
			}
		} catch (error) {
			console.warn(`Failed to set uniform "${name}":`, error);
		}
	}

	init = (time = 0): void => {
		if (this.isDestroyed) return;

		this.setUniform("u_time", time * 0.001);
		this.setUniform("u_resolution", [this.canvas.width, this.canvas.height]);
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
		this.frameId = requestAnimationFrame(this.init);
	};

	pause(): void {
		if (this.frameId) {
			cancelAnimationFrame(this.frameId);
			this.frameId = null;
		}
	}

	resume(): void {
		if (!this.frameId && !this.isDestroyed) {
			this.init();
		}
	}

	debug(): Record<string, any> {
		if (this.isDestroyed)
			throw new Error("WebFrag instance has been destroyed");

		return {
			program: this.program,
			uniforms: Array.from(this.uniforms.entries()),
			defaultUniforms: this.defaultUniforms,
			vertexShader: this.gl.getShaderSource(this.vertexShader),
			canvas: {
				width: this.canvas.width,
				height: this.canvas.height,
				clientWidth: this.canvas.clientWidth,
				clientHeight: this.canvas.clientHeight,
			},
		};
	}

	destroy(): void {
		if (this.isDestroyed) return;

		this.pause();
		window.removeEventListener("resize", this.handleResize);

		if (this.program) {
			this.gl.deleteProgram(this.program);
			this.program = null;
		}

		this.gl.deleteShader(this.vertexShader);
		this.uniforms.clear();
		this.isDestroyed = true;
	}
}

export const colorToVec4 = (color: string, alpha = 1): number[] => {
	// Handle different color formats
	if (color.startsWith("#")) {
		const hex = parseInt(color.slice(1), 16);
		const r = ((hex >> 16) & 0xff) / 255;
		const g = ((hex >> 8) & 0xff) / 255;
		const b = (hex & 0xff) / 255;
		return [r, g, b, alpha];
	}

	// Handle rgb/rgba format
	const match = color.match(/\d+/g);
	if (match) {
		const [r, g, b, a] = match.map(Number);
		return [r / 255, g / 255, b / 255, a !== undefined ? a : alpha];
	}

	throw new Error("Unsupported color format");
};
