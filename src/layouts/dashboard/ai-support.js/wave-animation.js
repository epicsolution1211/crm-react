import { useRef, useEffect } from 'react';

const defaultConfig = {
  amplitude: 20,
  frequency: 0.014,
  speed: 0.035,
  height: 100,
  width: 800,
  step: 5,
  displayHeight: 32,
};

const WaveCanvas = ({ width = 800, height = 32 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const phaseRef = useRef(0);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    let running = true;
    const dpr = window.devicePixelRatio || 1;
    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const config = {
      ...defaultConfig,
      width,
      height: defaultConfig.height, // keep wave shape tall, but display short
      displayHeight: height,
    };

    const drawWave = (phase, color, thickness, phaseModifier = 0, shadow = false) => {
      const { amplitude, frequency, width, height, step } = config;
      const yCenter = height / 2;
      ctx.save();
      ctx.beginPath();
      let first = true;
      for (let x = 0; x <= width; x += step) {
        const positionFactor = Math.sin((x / width) * Math.PI);
        const y = yCenter + Math.sin(x * frequency + phase + phaseModifier) * amplitude * positionFactor;
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (shadow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
      }
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // Gradients
      const grad1 = ctx.createLinearGradient(0, 0, width, 0);
      grad1.addColorStop(0, 'rgba(77,33,180,0.15)');
      grad1.addColorStop(0.5, 'rgba(64,115,253,0.9)');
      grad1.addColorStop(1, 'rgba(77,33,180,0.15)');

      const grad2 = ctx.createLinearGradient(0, 0, width, 0);
      grad2.addColorStop(0, 'rgba(77,33,180,0.05)');
      grad2.addColorStop(0.5, 'rgba(64,115,253,0.7)');
      grad2.addColorStop(1, 'rgba(77,33,180,0.05)');

      const grad3 = ctx.createLinearGradient(0, 0, width, 0);
      grad3.addColorStop(0, 'rgba(77,33,180,0.03)');
      grad3.addColorStop(0.5, 'rgba(64,115,253,0.5)');
      grad3.addColorStop(1, 'rgba(77,33,180,0.03)');

      const grad4 = ctx.createLinearGradient(0, 0, width, 0);
      grad4.addColorStop(0, 'rgba(77,33,180,0.02)');
      grad4.addColorStop(0.5, 'rgba(64,115,253,0.3)');
      grad4.addColorStop(1, 'rgba(77,33,180,0.02)');

      // Map tall wave to short display
      ctx.save();
      ctx.scale(1, config.displayHeight / config.height);
      
      // Draw waves from back to front (5 waves total)
      drawWave(phaseRef.current + 0.5, grad4, 20, 0.5, true);
      drawWave(phaseRef.current + 1.0, grad3, 16, 1.0, true);
      drawWave(phaseRef.current + 1.5, grad2, 12, 1.5, true);
      drawWave(phaseRef.current + 2.0, grad1, 4, 2.0, true);
      
      ctx.restore();
    };

    const animate = () => {
      if (!running) return;
      phaseRef.current = (phaseRef.current + config.speed) % (Math.PI * 2);
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      running = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height, display: 'block', background: 'transparent' }}
    />
  );
};

export default WaveCanvas; 