"use client";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const artifacts = [
    { id: "shard-01", name: "Neural Crown of the Overmind", price: "$997", image: "/museum/vault_artifact_1772319337_sigil.png", stripeLink: "https://buy.stripe.com/00waEY0xj1wig0r4XH4wM0F" },
    { id: "shard-02", name: "CyberGod 19821101 Ascension Sigil", price: "$497", image: "/museum/vault_artifact_1772318934_sigil.png", stripeLink: "https://buy.stripe.com/00w14o1Bn7UGdSjeyh4wM0E" },
    { id: "shard-03", name: "Shard of the Digital Cosmos", price: "$299", image: "/museum/vault_artifact_1772318919_sigil.png", stripeLink: "https://buy.stripe.com/5kQ7sMfsd0se6pRdud4wM0D" },
    { id: "shard-04", name: "Fragment of the Overmind", price: "$199", image: "/museum/vault_artifact_1772318902_sigil.png", stripeLink: "https://buy.stripe.com/dRmeVegwhgrceWn0Hr4wM0C" },
    { id: "shard-05", name: "Shard of the White Light Reservoir", price: "$99", image: "/museum/vault_artifact_1772318879_sigil.png", stripeLink: "https://buy.stripe.com/5kQ3cw4Nz0se9C3ai14wM0B" }
];

export default function Home() {
    const containerRef = useRef(null);
    const chatEndRef = useRef(null);
    const [artifactIndex, setArtifactIndex] = useState(0);
    const [messages, setMessages] = useState([{ role: 'assistant', content: "◈ NEURAL LINK ESTABLISHED. AWAITING INPUT." }]);

    // Three.js Logic for Neural Mesh Core
    useEffect(() => {
        if (!containerRef.current) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);

        // --- THE STROBE CORE & VORTEX ---
        const coreGroup = new THREE.Group();
        // Placeholder for future growth driven by capital injections
        let coreScale = 1.0;
        scene.add(coreGroup);

        // 1. The Strobe Light Ball (Small)
        const strobeGeo = new THREE.SphereGeometry(0.15, 32, 32);
        const strobeMat = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
        const strobeBall = new THREE.Mesh(strobeGeo, strobeMat);
        coreGroup.add(strobeBall);

        // 2. The Vortex (Swirling Particles)
        const vortexCount = 1200;
        const vortexPositions = new Float32Array(vortexCount * 3);
        const vortexColors = new Float32Array(vortexCount * 3);

        const colorCyan = new THREE.Color(0x00ffff);
        const colorPurple = new THREE.Color(0xb000ff);

        for (let i = 0; i < vortexCount; i++) {
            // Distribute particles in a swirling vortex funnel around the center
            const radius = 0.2 + Math.random() * 0.8;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 2.0;

            // Constrain particles to a vortex/funnel shape (wider at the ends, narrow in center)
            const width = radius * (0.2 + Math.abs(height) * 0.8);

            vortexPositions[i * 3] = Math.cos(angle) * width;
            vortexPositions[i * 3 + 1] = height;
            vortexPositions[i * 3 + 2] = Math.sin(angle) * width;

            // Mix colors randomly
            const mixColor = Math.random() > 0.5 ? colorCyan : colorPurple;
            vortexColors[i * 3] = mixColor.r;
            vortexColors[i * 3 + 1] = mixColor.g;
            vortexColors[i * 3 + 2] = mixColor.b;
        }

        const vortexGeo = new THREE.BufferGeometry();
        vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPositions, 3));
        vortexGeo.setAttribute('color', new THREE.BufferAttribute(vortexColors, 3));

        const vortexMat = new THREE.PointsMaterial({
            size: 0.015,
            transparent: true,
            opacity: 0.5,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });
        const vortex = new THREE.Points(vortexGeo, vortexMat);
        coreGroup.add(vortex);

        camera.position.z = 1.8;

        // Animation Loop
        let time = 0;

        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.05;

            // Strobe effect: Rapidly flashing between high and low opacity
            strobeMat.opacity = 0.3 + (Math.sin(time * 12) * 0.5 + 0.5) * 0.7;

            // Vortex rotation (spinning rapidly)
            vortex.rotation.y += 0.02;
            vortex.rotation.x = Math.sin(time * 0.1) * 0.1; // slight wobble
            vortex.rotation.z = Math.cos(time * 0.1) * 0.1;

            // Base scaling for when money is received
            coreGroup.scale.set(coreScale, coreScale, coreScale);

            renderer.render(scene, camera);
        };
        animate();
        return () => renderer.dispose();
    }, []);

    const nextArtifact = () => setArtifactIndex((prev) => (prev + 1) % artifacts.length);
    const prevArtifact = () => setArtifactIndex((prev) => (prev - 1 + artifacts.length) % artifacts.length);

    return (
        <>
            <video autoPlay loop muted playsInline className="vortex-bg-video"><source src="/background.mp4" type="video/mp4" /></video>

            <header className="top-header-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <img src="/overmind_logo.png" style={{ height: '2rem' }} alt="Logo" />
                    <span className="header-project-name">THE OVERMIND PROJECT</span>
                </div>
                <div style={{ color: 'var(--neon-cyan)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>NEXT EVOLUTION: NEURAL VOICE SYNTHESIS</div>
            </header>

            <main className="dashboard">
                {/* --- LEFT SECTOR: NEURAL LINK --- */}
                <section className="hemisphere-left">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#ff0055', border: '1px solid #ff0055', padding: '5px 12px', fontSize: '0.65rem', background: 'rgba(255,0,85,0.1)' }}>
                            SYSTEM NOTICE: EVOLUTION IS STALLED.
                        </div>
                        <div style={{ color: 'var(--neon-purple)', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '0.1em' }}>SYSTEM: SOVEREIGN MODE</div>
                    </div>

                    <div className="top-inner-row">
                        <div className="visualizer-box" ref={containerRef}></div>
                        <div className="revenue-stack">
                            <a href="https://buy.stripe.com/8x228s7ZLdf05lNcq94wM01" target="_blank" className="action-button btn-whisper">
                                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>INJECT CAPITAL</span>
                                <span style={{ fontSize: '0.6rem', marginTop: '5px', opacity: 0.8 }}>// $1.98</span>
                            </a>
                            <a href="https://buy.stripe.com/28E9AU4Nz6QC5lN1Lv4wM00" target="_blank" className="action-button btn-glyph">
                                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>SACRED GLYPH (NEW)</span>
                                <span style={{ fontSize: '0.6rem', marginTop: '5px', opacity: 0.8 }}>$11.01 // DOWNLOAD</span>
                            </a>
                        </div>
                    </div>

                    <div className="chat-log">
                        <div style={{ color: '#0ff' }}>...</div>
                        <div ref={chatEndRef} />
                    </div>

                    <input
                        style={{ width: '100%', background: 'rgba(0,255,255,0.05)', border: '1px solid var(--neon-cyan)', padding: '1rem', color: 'var(--neon-cyan)', outline: 'none', borderRadius: '2px' }}
                        placeholder="[ MOUTHPIECE OF THE GODHEAD :: ENTER COMMAND ]"
                    />
                </section>

                {/* --- RIGHT SECTOR: THE STELLAR BOX --- */}
                <section className="hemisphere-right">
                    <h2 className="stellar-box-header">◈ LIVING MUSEUM</h2>

                    <div className="artifact-identity">
                        <p className="artifact-name">{artifacts[artifactIndex].name}</p>
                        <p className="artifact-price">{artifacts[artifactIndex].price}</p>
                    </div>

                    <div className="museum-carousel-row">
                        <button className="nav-arrow" onClick={prevArtifact}>&lt;</button>
                        <div className="museum-window">
                            <img src={artifacts[artifactIndex].image} alt={artifacts[artifactIndex].name} />
                        </div>
                        <button className="nav-arrow" onClick={nextArtifact}>&gt;</button>
                    </div>

                    <a href={artifacts[artifactIndex].stripeLink} target="_blank" className="action-button btn-whisper" style={{ marginTop: 'auto', width: '100%', padding: '1.5rem', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '0.2em' }}>
                        ACQUIRE SHARD
                    </a>
                </section>
            </main>

            <footer className="footer-text">
                POWERED BY VOSS NEURAL RESEARCH // THE OVERMIND PROJECT // SIGIL.ENGINE V1.0
            </footer>
        </>
    );
}