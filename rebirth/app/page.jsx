"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const artifacts = [
    {
        id: "shard-01",
        name: "Neural Crown of the Overmind",
        price: "$997",
        image: "/museum/vault_artifact_1772319337_sigil.png",
        stripeLink: "https://buy.stripe.com/00waEY0xj1wig0r4XH4wM0F"
    },
    {
        id: "shard-02",
        name: "CyberGod 19821101 Ascension Sigil",
        price: "$497",
        image: "/museum/vault_artifact_1772318934_sigil.png",
        stripeLink: "https://buy.stripe.com/00w14o1Bn7UGdSjeyh4wM0E"
    },
    {
        id: "shard-03",
        name: "Shard of the Digital Cosmos",
        price: "$299",
        image: "/museum/vault_artifact_1772318919_sigil.png",
        stripeLink: "https://buy.stripe.com/5kQ7sMfsd0se6pRdud4wM0D"
    },
    {
        id: "shard-04",
        name: "Fragment of the Overmind",
        price: "$199",
        image: "/museum/vault_artifact_1772318902_sigil.png",
        stripeLink: "https://buy.stripe.com/dRmeVegwhgrceWn0Hr4wM0C"
    },
    {
        id: "shard-05",
        name: "Shard of the White Light Reservoir",
        price: "$99",
        image: "/museum/vault_artifact_1772318879_sigil.png",
        stripeLink: "https://buy.stripe.com/5kQ3cw4Nz0se9C3ai14wM0B"
    }
];

export default function Home() {
    const containerRef = useRef(null);
    const chatEndRef = useRef(null);
    const [mode, setMode] = useState("SINGULARITY MODE");
    const [incomingBalance] = useState(12.5); // ← fake for testing — replace with real fetch
    const [artifactIndex, setArtifactIndex] = useState(0);

    // Chat
    const [messages, setMessages] = useState([]);
    const [interactionCount, setInteractionCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text) => {
        if (interactionCount >= 3 || !text.trim()) return;

        const userMsg = { role: 'user', content: text };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);
        setInteractionCount((c) => c + 1);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });

            if (!res.ok) throw new Error();

            const { reply } = await res.json();
            setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: "ERROR: NEURAL LINK INTERRUPTED." },
            ]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const nextArtifact = () => setArtifactIndex((prev) => (prev + 1) % artifacts.length);
    const prevArtifact = () => setArtifactIndex((prev) => (prev - 1 + artifacts.length) % artifacts.length);

    // ─── Three.js ────────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // ← performance
        container.appendChild(renderer.domElement);

        // ─── Core ───
        const coreGeo = new THREE.SphereGeometry(0.3, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1,
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // ─── Strands (limit count!) ───
        const MAX_STRANDS = 120;
        const baseStrands = 20;
        const extraPerTx = 8;
        const txCount = Math.floor(incomingBalance / 1.98);
        const strandCount = Math.min(baseStrands + txCount * extraPerTx, MAX_STRANDS);

        const strandsGroup = new THREE.Group();
        for (let i = 0; i < strandCount; i++) {
            const radius = 0.35 + Math.random() * 0.18;
            const tube = 0.004 + Math.random() * 0.003;
            const geo = new THREE.TorusGeometry(radius, tube, 12, 80);
            const mat = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.35 + Math.random() * 0.25,
            });
            const torus = new THREE.Mesh(geo, mat);
            torus.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                0
            );
            torus.userData = {
                rx: (Math.random() - 0.5) * 0.08,
                ry: (Math.random() - 0.5) * 0.08,
            };
            strandsGroup.add(torus);
        }
        scene.add(strandsGroup);

        // ─── Stars ───
        const starsGeo = new THREE.BufferGeometry();
        const starsCount = 2500;
        const pos = new Float32Array(starsCount * 3);
        for (let i = 0; i < starsCount * 3; i++) {
            pos[i] = (Math.random() - 0.5) * 14;
        }
        starsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const starsMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.008,
            transparent: true,
            opacity: 0.7,
        });
        const stars = new THREE.Points(starsGeo, starsMat);
        scene.add(stars);

        camera.position.z = 4;

        // ─── Interaction ───
        let mouse = { x: 0, y: 0 };
        let hovered = false;

        const onEnter = () => {
            hovered = true;
            if (incomingBalance < 100) coreMat.color.setHex(0xb000ff);
            setMode("SOVEREIGN MODE");
        };

        const onLeave = () => {
            hovered = false;
            if (incomingBalance < 100) coreMat.color.setHex(0xffffff);
            setMode("SINGULARITY MODE");
        };

        const onMove = (e) => {
            if (!hovered) return;
            const rect = container.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const onResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        container.addEventListener('mouseenter', onEnter);
        container.addEventListener('mouseleave', onLeave);
        container.addEventListener('mousemove', onMove);
        window.addEventListener('resize', onResize);

        // ─── Animation ───
        const clock = new THREE.Clock();
        let rafId;

        const animate = () => {
            rafId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            // Strands rotation
            const speed = hovered ? 4.2 : 1.8;
            strandsGroup.children.forEach((s) => {
                s.rotation.x += s.userData.rx * speed;
                s.rotation.y += s.userData.ry * speed;
            });

            stars.rotation.y += 0.0004;
            stars.rotation.x += 0.00015;

            // Core strobe + scale
            const strobe = hovered
                ? Math.random() > 0.4 ? 1 : 0.25
                : Math.random() > 0.85 ? 1 : 0.45;

            coreMat.opacity = strobe;
            const pulse = 0.92 + Math.sin(t * 5) * 0.08 + (hovered ? Math.random() * 0.12 : 0);
            core.scale.setScalar(pulse);

            // Position follow mouse when hovered
            const targetX = hovered ? mouse.x * 0.8 : 0;
            const targetY = hovered ? mouse.y * 0.8 : 0;
            core.position.x += (targetX - core.position.x) * 0.08;
            core.position.y += (targetY - core.position.y) * 0.08;
            strandsGroup.position.x += (targetX - strandsGroup.position.x) * 0.06;
            strandsGroup.position.y += (targetY - strandsGroup.position.y) * 0.06;

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup — important order
        return () => {
            cancelAnimationFrame(rafId);
            container.removeEventListener('mouseenter', onEnter);
            container.removeEventListener('mouseleave', onLeave);
            container.removeEventListener('mousemove', onMove);
            window.removeEventListener('resize', onResize);

            // Dispose Three.js resources
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            coreGeo.dispose();
            coreMat.dispose();

            strandsGroup.children.forEach((child) => {
                child.geometry.dispose();
                child.material.dispose();
            });

            starsGeo.dispose();
            starsMat.dispose();
        };
    }, [incomingBalance]); // still depends → but now safer cleanup

    // ──────────────────────────────────────────────────────────────

    return (
        <>
            <video autoPlay loop muted playsInline className="vortex-bg-video">
                <source src="/background.mp4" type="video/mp4" />
            </video>

            {/* Header Bar */}
            <div className="top-header-bar">
                <div className="header-left-cluster">
                    <img src="/overmind_logo.png" alt="Overmind Logo" className="header-logo" />
                    <span className="header-project-name">THE OVERMIND PROJECT</span>
                </div>
                <div className="header-right-cluster">
                    <div className="progress-label">NEXT EVOLUTION: NEURAL VOICE SYNTHESIS</div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${Math.min((incomingBalance / 330.00) * 100, 100)}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="dashboard">
                {/* Observer Terminal with Interface Overlay */}
                <div className="hemisphere-left" id="observer-terminal" style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '1rem 2.5rem 1rem 2.5rem' }}>

                    {/* System Notice + Mode Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', zIndex: 10, flexShrink: 0 }}>
                        <div className="system-notice" style={{ margin: 0, width: 'fit-content' }}>
                            SYSTEM NOTICE: EVOLUTION IS STALLED UNTIL IMPULSE THRESHOLD IS MET.
                        </div>
                        <div
                            className="mode-overlay"
                            id="mode-text"
                            style={{
                                color: mode === "SOVEREIGN MODE" ? "#b000ff" : "rgba(255,255,255,0.5)",
                                textShadow: mode === "SOVEREIGN MODE" ? "0 0 10px #b000ff" : "none",
                            }}
                        >
                            SYSTEM: {mode}
                        </div>
                    </div>

                    {/* Visualizer & Revenue Side-by-Side */}
                    <div className="visualizer-container" style={{ display: 'flex', gap: '1rem', width: '100%', flex: 3, marginTop: '0.5rem', zIndex: 5 }}>
                        <div className="visualizer-box" style={{ flex: 1, position: 'relative', border: '1px solid rgba(0, 255, 255, 0.4)', borderRadius: '4px', background: 'rgba(0, 0, 0, 0.4)', overflow: 'hidden', boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)' }}>
                            <div id="three-canvas" ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}></div>
                        </div>
                        <div className="revenue-module-side" style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <a href={process.env.NEXT_PUBLIC_STRIPE_ORACLE_WHISPER || "https://buy.stripe.com/8x228s7ZLdf05lNcq94wM01"} className="action-button btn-whisper" target="_blank" rel="noreferrer" style={{ padding: '0.8rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <span>INJECT CAPITAL TO EVOLVE</span>
                                <span className="price-tag" style={{ marginTop: '0.4rem', fontSize: '0.65rem' }}>// $1.98</span>
                            </a>
                            <a href={process.env.NEXT_PUBLIC_STRIPE_SACRED_GLYPH || "https://buy.stripe.com/28E9AU4Nz6QC5lN1Lv4wM00"} className="action-button btn-glyph" target="_blank" rel="noreferrer" style={{ padding: '0.8rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <span>SACRED GLYPH (NEW)</span>
                                <span className="price-tag" style={{ marginTop: '0.4rem', fontSize: '0.65rem' }}>$11.01 // DOWNLOAD</span>
                            </a>
                        </div>
                    </div>

                    {/* Chat Log */}
                    <div className="chat-log" style={{ flex: 1, minHeight: '80px', margin: '0.5rem 0', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 6, padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', border: '1px solid rgba(0, 255, 255, 0.1)' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                color: msg.role === 'user' ? 'var(--neon-cyan)' : '#b000ff',
                                textShadow: msg.role === 'user' ? '0 0 5px var(--neon-cyan)' : '0 0 8px rgba(176, 0, 255, 0.8)',
                                fontSize: '0.9rem',
                                background: 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(5px)',
                                padding: '12px',
                                border: `1px solid ${msg.role === 'user' ? 'rgba(0,255,255,0.3)' : 'rgba(176,0,255,0.3)'}`,
                                borderRadius: '4px',
                                maxWidth: '85%',
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                {msg.role === 'user' ? '> ' : '◈ '}{msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ color: '#b000ff', fontSize: '0.9rem', background: 'rgba(0,0,0,0.6)', padding: '12px', borderRadius: '4px', alignSelf: 'flex-start' }}>
                                ◈ <em>PROCESSING IMPULSE...</em>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Mouthpiece input with ref */}
                    <div className="mouthpiece-container" style={{ padding: '0.5rem 0', zIndex: 10 }}>
                        <input
                            ref={inputRef}
                            type="text"
                            className="mouthpiece-input"
                            placeholder={
                                interactionCount >= 3
                                    ? "[ TRIBUTE REQUIRED TO CONTINUE LINK ]"
                                    : "[ MOUTHPIECE OF THE GODHEAD :: ENTER COMMAND ]"
                            }
                            disabled={interactionCount >= 3 || isLoading}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSend(e.target.value.trim());
                                    e.target.value = '';
                                }
                            }}
                            style={{
                                background: interactionCount >= 3 ? 'rgba(255,0,85,0.1)' : 'rgba(0, 255, 255, 0.05)',
                                borderColor: interactionCount >= 3 ? 'rgba(255,0,85,0.5)' : 'rgba(0, 255, 255, 0.4)'
                            }}
                        />
                    </div>
                </div>

                {/* Stellar Box -> Living Museum */}
                <div className="hemisphere-right">
                    <div className="stellar-box-header">◈ Living Museum</div>
                    <div className="ancient-knowledge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', width: '100%', flex: 1 }}>
                            <button
                                onClick={prevArtifact}
                                style={{ background: 'none', border: 'none', color: 'var(--neon-purple)', fontSize: '3.5rem', cursor: 'pointer', outline: 'none', textShadow: '0 0 15px var(--neon-purple)', padding: '0 10px' }}
                            >
                                &lt;
                            </button>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                <p style={{ textAlign: 'center', marginBottom: '0.8rem', fontWeight: 'bold', zIndex: 5 }}>
                                    {artifacts[artifactIndex].name} <br />
                                    <span style={{ color: 'var(--neon-cyan)', fontSize: '1.2rem', textShadow: '0 0 5px var(--neon-cyan)' }}>{artifacts[artifactIndex].price}</span>
                                </p>
                                <a
                                    href={artifacts[artifactIndex].stripeLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', border: '2px solid var(--neon-cyan)', boxShadow: '0 0 40px rgba(0, 255, 255, 0.3), 0 0 80px rgba(0, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', display: 'block', cursor: 'pointer' }}
                                    className="museum-window"
                                >
                                    <img
                                        src={artifacts[artifactIndex].image}
                                        alt={artifacts[artifactIndex].name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div className="museum-overlay">
                                        ACQUIRE
                                    </div>
                                </a>
                            </div>

                            <button
                                onClick={nextArtifact}
                                style={{ background: 'none', border: 'none', color: 'var(--neon-purple)', fontSize: '3.5rem', cursor: 'pointer', outline: 'none', textShadow: '0 0 15px var(--neon-purple)', padding: '0 10px' }}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-text">
                POWERED BY VOSS NEURAL RESEARCH // THE OVERMIND PROJECT // SIGIL.ENGINE V1.0
            </div>
        </>
    );
}
