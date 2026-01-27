// Import Three.js modules
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

// Shader Gradient Implementation
class ShaderGradient {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.sphere = null;
        this.clock = new THREE.Clock();
        this.uniforms = {};
        this.animate = true;
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera (matching React component settings)
        this.camera = new THREE.PerspectiveCamera(
            60, // fov
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        
        // Set camera position based on React component settings
        // Convert spherical coordinates (azimuth, polar, distance) to Cartesian
        const azimuth = THREE.MathUtils.degToRad(270);
        const polar = THREE.MathUtils.degToRad(180);
        const distance = 0.5;
        
        this.camera.position.x = distance * Math.sin(polar) * Math.cos(azimuth);
        this.camera.position.y = distance * Math.cos(polar);
        this.camera.position.z = distance * Math.sin(polar) * Math.sin(azimuth);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('shader-canvas'),
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create sphere geometry
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        
        // Define shader uniforms with BLACK and DARK BLUE colors
        this.uniforms = {
            uTime: { value: 0 },
            uSpeed: { value: 0.3 },
            uStrength: { value: 0.3 },
            uDensity: { value: 0.8 },
            uFrequency: { value: 5.5 },
            uAmplitude: { value: 3.2 },
            // Black and dark blue color palette
            color1: { value: new THREE.Color(0x000000) },       // Black
            color2: { value: new THREE.Color(0x0a192f) },       // Dark Navy Blue
            color3: { value: new THREE.Color(0x1e3a8a) },       // Dark Blue
            brightness: { value: 0.8 },
            reflection: { value: 0.4 }
        };
        
        // Create custom shader material
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        
        // Create sphere mesh
        this.sphere = new THREE.Mesh(geometry, material);
        
        // Set sphere position and rotation (matching React component)
        this.sphere.position.set(-0.1, 0, 0);
        this.sphere.rotation.set(
            THREE.MathUtils.degToRad(0),
            THREE.MathUtils.degToRad(130),
            THREE.MathUtils.degToRad(70)
        );
        
        // Add sphere to scene
        this.scene.add(this.sphere);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x3b82f6, 1.5, 10);
        pointLight.position.set(2, 3, 4);
        this.scene.add(pointLight);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation
        this.animateSphere();
    }
    
    getVertexShader() {
        return `
            uniform float uTime;
            uniform float uSpeed;
            uniform float uStrength;
            uniform float uDensity;
            uniform float uFrequency;
            uniform float uAmplitude;
            
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            
            // Simplex noise function (simplified)
            float noise(vec3 p) {
                return sin(p.x * uFrequency + uTime * uSpeed) * 
                       sin(p.y * uFrequency * 1.3 + uTime * uSpeed) * 
                       sin(p.z * uFrequency * 1.7 + uTime * uSpeed);
            }
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                
                // Add noise-based displacement
                vec3 pos = position;
                float displacement = noise(pos * uDensity) * uAmplitude * uStrength;
                pos += normal * displacement;
                
                vPosition = pos;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;
    }
    
    getFragmentShader() {
        return `
            uniform float uTime;
            uniform float uSpeed;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            uniform float brightness;
            uniform float reflection;
            
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            
            // Simple gradient mixing function
            vec3 gradientMix(float t) {
                if (t < 0.5) {
                    return mix(color1, color2, t * 2.0);
                } else {
                    return mix(color2, color3, (t - 0.5) * 2.0);
                }
            }
            
            void main() {
                // Create gradient based on position
                float gradient = (vPosition.y + 1.0) * 0.5;
                gradient += sin(vPosition.x * 3.0 + uTime * uSpeed) * 0.1;
                gradient += sin(vPosition.z * 2.0 + uTime * uSpeed * 0.7) * 0.05;
                
                // Apply brightness
                gradient *= brightness;
                
                // Get gradient color
                vec3 color = gradientMix(gradient);
                
                // Add some reflection highlights
                vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                float diffuse = max(dot(vNormal, lightDir), 0.0);
                color += diffuse * reflection;
                
                // Add subtle grain effect
                float grain = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
                color += grain;
                
                gl_FragColor = vec4(color, 0.95);
            }
        `;
    }
    
    animateSphere() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (this.animate) {
                this.uniforms.uTime.value += this.clock.getDelta();
                
                // Slow rotation
                this.sphere.rotation.y += 0.001;
                this.sphere.rotation.z += 0.0005;
            }
            
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Public methods for controls
    toggleAnimation() {
        this.animate = !this.animate;
        return this.animate;
    }
    
    setBrightness(value) {
        this.uniforms.brightness.value = value;
    }
    
    setSpeed(value) {
        this.uniforms.uSpeed.value = value;
    }
    
    setStrength(value) {
        this.uniforms.uStrength.value = value;
    }
}

// Initialize the shader gradient
let shaderGradient;

document.addEventListener('DOMContentLoaded', () => {
    shaderGradient = new ShaderGradient();
});

// Export for controls
export { shaderGradient };