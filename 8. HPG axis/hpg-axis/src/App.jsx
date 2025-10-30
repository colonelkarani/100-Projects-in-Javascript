import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Play, Pause, RotateCcw, Info, Zap, Activity, Target, Brain } from 'lucide-react';

const HPAAxisVisualization = () => {
  const svgRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedGland, setSelectedGland] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  
  // Hormone levels state
  const [hormoneData, setHormoneData] = useState({
    crh: { level: 50, baseline: 50, stimulation: 0 },
    acth: { level: 30, baseline: 30, stimulation: 0 },
    cortisol: { level: 40, baseline: 40, stimulation: 0 },
    stress: { level: 20, baseline: 20, stimulation: 0 },
    feedback: { level: 60, baseline: 60, stimulation: 0 }
  });

  // Slider controls
  const [sliders, setSliders] = useState({
    stress: 20,
    hypothalamus: 50,
    pituitary: 50,
    adrenal: 50,
    feedback: 60
  });

  // Historical data for graphs
  const [historyData, setHistoryData] = useState([]);
  const maxHistoryLength = 100;

  // Gland information
  const glandInfo = {
    hypothalamus: {
      name: "Hypothalamus",
      description: "The master regulator that responds to stress and circadian rhythms",
      hormones: ["CRH (Corticotropin-Releasing Hormone)"],
      color: "#FF6B6B",
      icon: Brain
    },
    pituitary: {
      name: "Pituitary Gland",
      description: "The 'master gland' that responds to hypothalamic signals",
      hormones: ["ACTH (Adrenocorticotropic Hormone)"],
      color: "#4ECDC4",
      icon: Zap
    },
    adrenal: {
      name: "Adrenal Cortex",
      description: "Produces stress hormones in response to ACTH",
      hormones: ["Cortisol", "Aldosterone"],
      color: "#45B7D1",
      icon: Target
    }
  };

  // Update hormone levels based on slider values
  useEffect(() => {
    const updateHormones = () => {
      const stress = sliders.stress / 100;
      const hypothalamus = sliders.hypothalamus / 100;
      const pituitary = sliders.pituitary / 100;
      const adrenal = sliders.adrenal / 100;
      const feedback = sliders.feedback / 100;

      // Complex hormone interaction model
      const newCRH = Math.max(0, Math.min(100, 
        (stress * 80 + hypothalamus * 60) * (1 - feedback * 0.3)
      ));
      
      const newACTH = Math.max(0, Math.min(100,
        (newCRH * 0.8 + pituitary * 40) * (1 - feedback * 0.2)
      ));
      
      const newCortisol = Math.max(0, Math.min(100,
        (newACTH * 0.9 + adrenal * 50) * (1 - feedback * 0.1)
      ));

      const newHormoneData = {
        crh: { level: newCRH, baseline: 50, stimulation: Math.sin(currentTime * 0.1) * 10 },
        acth: { level: newACTH, baseline: 30, stimulation: Math.sin(currentTime * 0.15) * 8 },
        cortisol: { level: newCortisol, baseline: 40, stimulation: Math.sin(currentTime * 0.08) * 12 },
        stress: { level: sliders.stress, baseline: 20, stimulation: 0 },
        feedback: { level: feedback * 100, baseline: 60, stimulation: 0 }
      };

      setHormoneData(newHormoneData);

      // Update history
      const newDataPoint = {
        time: currentTime,
        crh: newCRH,
        acth: newACTH,
        cortisol: newCortisol,
        stress: sliders.stress,
        feedback: feedback * 100
      };

      setHistoryData(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-maxHistoryLength);
      });
    };

    updateHormones();
  }, [sliders, currentTime]);

  // Animation loop
  useEffect(() => {
    let animationId;
    
    if (isPlaying) {
      const animate = () => {
        setCurrentTime(prev => prev + 0.1);
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying]);

  // D3 Visualization
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Create main visualization area
    const mainGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Background gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "bgGradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "100%");
    
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#1a1a2e")
      .attr("stop-opacity", 1);
    
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#16213e")
      .attr("stop-opacity", 1);

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#bgGradient)");

    // Neural network background
    const createNeuralNetwork = () => {
      const neurons = [];
      for (let i = 0; i < 30; i++) {
        neurons.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 3 + 1
        });
      }

      mainGroup.selectAll(".neuron")
        .data(neurons)
        .enter()
        .append("circle")
        .attr("class", "neuron")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.r)
        .attr("fill", "#ffffff")
        .attr("opacity", 0.1)
        .attr("filter", "blur(1px)");

      // Neural connections
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dist = Math.sqrt(
            Math.pow(neurons[i].x - neurons[j].x, 2) + 
            Math.pow(neurons[i].y - neurons[j].y, 2)
          );
          if (dist < 100) {
            mainGroup.append("line")
              .attr("x1", neurons[i].x)
              .attr("y1", neurons[i].y)
              .attr("x2", neurons[j].x)
              .attr("y2", neurons[j].y)
              .attr("stroke", "#ffffff")
              .attr("stroke-width", 0.5)
              .attr("opacity", 0.05);
          }
        }
      }
    };

    createNeuralNetwork();

    // Gland positions
    const glands = [
      { id: 'hypothalamus', x: 400, y: 120, r: 35, color: '#FF6B6B' },
      { id: 'pituitary', x: 400, y: 220, r: 30, color: '#4ECDC4' },
      { id: 'adrenal', x: 400, y: 350, r: 40, color: '#45B7D1' }
    ];

    // Create glow filters
    const glowFilter = defs.append("filter")
      .attr("id", "glow")
      .attr("width", "300%")
      .attr("height", "300%");

    glowFilter.append("feGaussianBlur")
      .attr("stdDeviation", "5")
      .attr("result", "coloredBlur");

    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Draw glands
    glands.forEach(gland => {
      const glandGroup = mainGroup.append("g")
        .attr("class", `gland-${gland.id}`)
        .attr("transform", `translate(${gland.x}, ${gland.y})`);

      // Pulsing outer ring
      glandGroup.append("circle")
        .attr("r", gland.r + 15)
        .attr("fill", "none")
        .attr("stroke", gland.color)
        .attr("stroke-width", 2)
        .attr("opacity", 0.3)
        .attr("filter", "url(#glow)")
        .transition()
        .duration(2000)
        .ease(d3.easeSinInOut)
        .attr("r", gland.r + 20)
        .attr("opacity", 0.1)
        .transition()
        .duration(2000)
        .ease(d3.easeSinInOut)
        .attr("r", gland.r + 15)
        .attr("opacity", 0.3)
        .on("end", function repeat() {
          d3.select(this).transition()
            .duration(2000)
            .ease(d3.easeSinInOut)
            .attr("r", gland.r + 20)
            .attr("opacity", 0.1)
            .transition()
            .duration(2000)
            .ease(d3.easeSinInOut)
            .attr("r", gland.r + 15)
            .attr("opacity", 0.3)
            .on("end", repeat);
        });

      // Main gland circle
      glandGroup.append("circle")
        .attr("r", gland.r)
        .attr("fill", gland.color)
        .attr("opacity", 0.8)
        .attr("filter", "url(#glow)")
        .style("cursor", "pointer")
        .on("click", () => setSelectedGland(gland.id))
        .on("mouseover", function() {
          d3.select(this).transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("r", gland.r + 5);
        })
        .on("mouseout", function() {
          d3.select(this).transition()
            .duration(200)
            .attr("opacity", 0.8)
            .attr("r", gland.r);
        });

      // Activity indicator
      const activityLevel = gland.id === 'hypothalamus' ? hormoneData.crh.level :
                           gland.id === 'pituitary' ? hormoneData.acth.level :
                           hormoneData.cortisol.level;

      glandGroup.append("circle")
        .attr("r", 3)
        .attr("fill", "#ffffff")
        .attr("opacity", activityLevel / 100)
        .transition()
        .duration(500)
        .attr("opacity", (activityLevel / 100) * 0.5)
        .transition()
        .duration(500)
        .attr("opacity", activityLevel / 100)
        .on("end", function repeat() {
          d3.select(this).transition()
            .duration(500)
            .attr("opacity", (activityLevel / 100) * 0.5)
            .transition()
            .duration(500)
            .attr("opacity", activityLevel / 100)
            .on("end", repeat);
        });

      // Gland label
      glandGroup.append("text")
        .attr("y", gland.r + 25)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .text(gland.id.charAt(0).toUpperCase() + gland.id.slice(1));
    });

    // Hormone pathways
    const pathways = [
      { from: glands[0], to: glands[1], hormone: 'CRH', color: '#FF6B6B', level: hormoneData.crh.level },
      { from: glands[1], to: glands[2], hormone: 'ACTH', color: '#4ECDC4', level: hormoneData.acth.level },
      { from: glands[2], to: glands[0], hormone: 'Cortisol Feedback', color: '#45B7D1', level: hormoneData.feedback.level, feedback: true }
    ];

    pathways.forEach((pathway, index) => {
      const pathGroup = mainGroup.append("g")
        .attr("class", `pathway-${index}`);

      // Create curved path
      const path = d3.path();
      const midX = (pathway.from.x + pathway.to.x) / 2 + (pathway.feedback ? -100 : 50);
      const midY = (pathway.from.y + pathway.to.y) / 2;
      
      path.moveTo(pathway.from.x, pathway.from.y);
      path.quadraticCurveTo(midX, midY, pathway.to.x, pathway.to.y);

      pathGroup.append("path")
        .attr("d", path.toString())
        .attr("fill", "none")
        .attr("stroke", pathway.color)
        .attr("stroke-width", Math.max(1, pathway.level / 25))
        .attr("opacity", 0.6)
        .attr("stroke-dasharray", pathway.feedback ? "5,5" : "none")
        .attr("filter", "url(#glow)");

      // Animated particles
      const particleCount = Math.floor(pathway.level / 20) + 1;
      for (let i = 0; i < particleCount; i++) {
        const particle = pathGroup.append("circle")
          .attr("r", 2)
          .attr("fill", pathway.color)
          .attr("opacity", 0.8);

        const animateParticle = () => {
          particle.transition()
            .duration(2000 + Math.random() * 1000)
            .ease(d3.easeLinear)
            .attrTween("transform", () => {
              return (t) => {
                const point = path.getPointAtLength(t * path.getTotalLength());
                return `translate(${point.x}, ${point.y})`;
              };
            })
            .on("end", animateParticle);
        };

        setTimeout(animateParticle, i * 400);
      }

      // Hormone label
      pathGroup.append("text")
        .attr("x", midX)
        .attr("y", midY - 10)
        .attr("text-anchor", "middle")
        .attr("fill", pathway.color)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .text(pathway.hormone);
    });

    // Stress indicators
    const stressLevel = sliders.stress;
    const stressIndicators = mainGroup.append("g")
      .attr("class", "stress-indicators");

    for (let i = 0; i < Math.floor(stressLevel / 10); i++) {
      stressIndicators.append("path")
        .attr("d", "M-5,-10 L0,-20 L5,-10 Z")
        .attr("fill", "#FF4444")
        .attr("opacity", 0.6)
        .attr("transform", `translate(${100 + i * 15}, 80) rotate(${Math.random() * 20 - 10})`)
        .transition()
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("transform", `translate(${100 + i * 15}, 60) rotate(${Math.random() * 20 - 10})`)
        .transition()
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("transform", `translate(${100 + i * 15}, 80) rotate(${Math.random() * 20 - 10})`)
        .on("end", function repeat() {
          d3.select(this).transition()
            .duration(1000)
            .ease(d3.easeBounce)
            .attr("transform", `translate(${100 + i * 15}, 60) rotate(${Math.random() * 20 - 10})`)
            .transition()
            .duration(1000)
            .ease(d3.easeBounce)
            .attr("transform", `translate(${100 + i * 15}, 80) rotate(${Math.random() * 20 - 10})`)
            .on("end", repeat);
        });
    }

    // Add title
    mainGroup.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "24px")
      .attr("font-weight", "bold")
      .text("Hypothalamic-Pituitary-Adrenal Axis");

  }, [hormoneData, sliders, currentTime]);

  // Time-series graph component
  const TimeSeriesGraph = ({ data, width = 400, height = 200 }) => {
    const graphRef = useRef();

    useEffect(() => {
      if (!data || data.length === 0) return;

      const svg = d3.select(graphRef.current);
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 20, bottom: 40, left: 40 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // Scales
      const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.time))
        .range([0, innerWidth]);

      const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([innerHeight, 0]);

      // Lines
      const line = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

      const hormones = [
        { key: 'crh', color: '#FF6B6B', name: 'CRH' },
        { key: 'acth', color: '#4ECDC4', name: 'ACTH' },
        { key: 'cortisol', color: '#45B7D1', name: 'Cortisol' },
        { key: 'stress', color: '#FF4444', name: 'Stress' }
      ];

      hormones.forEach(hormone => {
        const hormoneData = data.map(d => ({
          time: d.time,
          value: d[hormone.key]
        }));

        g.append("path")
          .datum(hormoneData)
          .attr("fill", "none")
          .attr("stroke", hormone.color)
          .attr("stroke-width", 2)
          .attr("d", line)
          .attr("opacity", 0.8);
      });

      // Axes
      g.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d => `${d.toFixed(1)}s`))
        .attr("color", "#ffffff");

      g.append("g")
        .call(d3.axisLeft(yScale))
        .attr("color", "#ffffff");

      // Legend
      const legend = g.append("g")
        .attr("transform", `translate(${innerWidth - 80}, 20)`);

      hormones.forEach((hormone, i) => {
        const legendItem = legend.append("g")
          .attr("transform", `translate(0, ${i * 20})`);

        legendItem.append("line")
          .attr("x1", 0)
          .attr("x2", 15)
          .attr("stroke", hormone.color)
          .attr("stroke-width", 2);

        legendItem.append("text")
          .attr("x", 20)
          .attr("y", 4)
          .attr("fill", "#ffffff")
          .attr("font-size", "12px")
          .text(hormone.name);
      });

    }, [data, width, height]);

    return <svg ref={graphRef} width={width} height={height}></svg>;
  };

  const handleSliderChange = (slider, value) => {
    setSliders(prev => ({
      ...prev,
      [slider]: parseInt(value)
    }));
  };

  const resetSimulation = () => {
    setSliders({
      stress: 20,
      hypothalamus: 50,
      pituitary: 50,
      adrenal: 50,
      feedback: 60
    });
    setCurrentTime(0);
    setHistoryData([]);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            HPA Axis Simulator
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Interactive visualization of the hypothalamic-pituitary-adrenal axis
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <button
                onClick={resetSimulation}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
              >
                <RotateCcw size={20} />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setShowInfo(!showInfo)}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
              >
                <Info size={20} />
                <span>Info</span>
              </button>
            </div>
            
            <div className="text-sm text-gray-300">
              Time: {currentTime.toFixed(1)}s
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(sliders).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 capitalize">
                  {key === 'stress' ? '🔥 Stress Level' : 
                   key === 'hypothalamus' ? '🧠 Hypothalamus' :
                   key === 'pituitary' ? '⚡ Pituitary' :
                   key === 'adrenal' ? '🎯 Adrenal' : '🔄 Feedback'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => handleSliderChange(key, e.target.value)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-center text-sm text-gray-400">
                  {value}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* D3 Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <svg ref={svgRef} width="100%" height="600" className="rounded-lg"></svg>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Hormone Levels */}
            <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Activity className="mr-2" size={20} />
                Hormone Levels
              </h3>
              <div className="space-y-4">
                {Object.entries(hormoneData).map(([key, data]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{key}</span>
                      <span className="text-sm text-gray-300">{data.level.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${data.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Series Graph */}
            <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Historical Data</h3>
              <TimeSeriesGraph data={historyData} width={350} height={250} />
            </div>

            {/* Gland Information */}
            {selectedGland && (
              <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  {React.createElement(glandInfo[selectedGland].icon, { size: 20, className: "mr-2" })}
                  {glandInfo[selectedGland].name}
                </h3>
                <p className="text-gray-300 mb-4">
                  {glandInfo[selectedGland].description}
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Hormones:</h4>
                  <ul className="text-sm text-gray-300">
                    {glandInfo[selectedGland].hormones.map((hormone, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-2" 
                              style={{ backgroundColor: glandInfo[selectedGland].color }}></span>
                        {hormone}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Panel */}
        {showInfo && (
          <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <h3 className="text-2xl font-bold mb-4">About the HPA Axis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold mb-2">How it works:</h4>
                <p className="text-sm leading-relaxed">
                  The hypothalamic-pituitary-adrenal (HPA) axis is a complex set of direct influences 
                  and feedback interactions among the hypothalamus, pituitary gland, and adrenal glands. 
                  This system controls reactions to stress and regulates many body processes including 
                  digestion, immune response, mood, and energy storage.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Key Components:</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Hypothalamus:</strong> Releases CRH in response to stress</li>
                  <li>• <strong>Pituitary:</strong> Secretes ACTH when stimulated by CRH</li>
                  <li>• <strong>Adrenal Cortex:</strong> Produces cortisol when activated by ACTH</li>
                  <li>• <strong>Negative Feedback:</strong> Cortisol inhibits CRH and ACTH release</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Stress Response:</h4>
                <p className="text-sm leading-relaxed">
                  When stress is detected, the hypothalamus releases CRH, which stimulates the pituitary 
                  to release ACTH. This hormone then triggers the adrenal glands to produce cortisol, 
                  the primary stress hormone. Cortisol helps the body respond to stress but also provides 
                  negative feedback to prevent overactivation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Clinical Significance:</h4>
                <p className="text-sm leading-relaxed">
                  Dysregulation of the HPA axis is associated with numerous conditions including depression, 
                  anxiety, PTSD, Cushing's syndrome, and Addison's disease. Understanding this system is 
                  crucial for developing treatments for stress-related disorders.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Data Display */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-pink-500 bg-opacity-20 backdrop-blur-lg rounded-xl p-4 border border-red-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-200">CRH Level</p>
                <p className="text-2xl font-bold text-red-100">{hormoneData.crh.level.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Brain className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="w-full bg-red-800 rounded-full h-1 mr-2">
                <div 
                  className="bg-red-400 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${hormoneData.crh.level}%` }}
                ></div>
              </div>
              <span className="text-xs text-red-200">
                {hormoneData.crh.level > 70 ? '↑' : hormoneData.crh.level < 30 ? '↓' : '→'}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-cyan-500 bg-opacity-20 backdrop-blur-lg rounded-xl p-4 border border-teal-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-200">ACTH Level</p>
                <p className="text-2xl font-bold text-teal-100">{hormoneData.acth.level.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="w-full bg-teal-800 rounded-full h-1 mr-2">
                <div 
                  className="bg-teal-400 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${hormoneData.acth.level}%` }}
                ></div>
              </div>
              <span className="text-xs text-teal-200">
                {hormoneData.acth.level > 70 ? '↑' : hormoneData.acth.level < 30 ? '↓' : '→'}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 bg-opacity-20 backdrop-blur-lg rounded-xl p-4 border border-blue-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Cortisol Level</p>
                <p className="text-2xl font-bold text-blue-100">{hormoneData.cortisol.level.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Target className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="w-full bg-blue-800 rounded-full h-1 mr-2">
                <div 
                  className="bg-blue-400 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${hormoneData.cortisol.level}%` }}
                ></div>
              </div>
              <span className="text-xs text-blue-200">
                {hormoneData.cortisol.level > 70 ? '↑' : hormoneData.cortisol.level < 30 ? '↓' : '→'}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-violet-500 bg-opacity-20 backdrop-blur-lg rounded-xl p-4 border border-purple-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-200">Stress Index</p>
                <p className="text-2xl font-bold text-purple-100">{sliders.stress}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Activity className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="w-full bg-purple-800 rounded-full h-1 mr-2">
                <div 
                  className="bg-purple-400 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${sliders.stress}%` }}
                ></div>
              </div>
              <span className="text-xs text-purple-200">
                {sliders.stress > 70 ? 'High' : sliders.stress < 30 ? 'Low' : 'Normal'}
              </span>
            </div>
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <h3 className="text-2xl font-bold mb-6">Advanced Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Correlation Matrix */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
              <h4 className="font-semibold mb-4">Hormone Correlations</h4>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center font-medium">CRH</div>
                <div className="text-center font-medium">ACTH</div>
                <div className="text-center font-medium">Cortisol</div>
                <div className="text-center font-medium">Stress</div>
                
                <div className="bg-green-500 text-center py-1 rounded">1.0</div>
                <div className="bg-yellow-500 text-center py-1 rounded">0.8</div>
                <div className="bg-orange-500 text-center py-1 rounded">0.6</div>
                <div className="bg-red-500 text-center py-1 rounded">0.9</div>
                
                <div className="bg-yellow-500 text-center py-1 rounded">0.8</div>
                <div className="bg-green-500 text-center py-1 rounded">1.0</div>
                <div className="bg-yellow-500 text-center py-1 rounded">0.7</div>
                <div className="bg-orange-500 text-center py-1 rounded">0.6</div>
                
                <div className="bg-orange-500 text-center py-1 rounded">0.6</div>
                <div className="bg-yellow-500 text-center py-1 rounded">0.7</div>
                <div className="bg-green-500 text-center py-1 rounded">1.0</div>
                <div className="bg-yellow-500 text-center py-1 rounded">0.8</div>
                
                <div className="bg-red-500 text-center py-1 rounded">0.9</div>
                <div className="bg-orange-500 text-center py-1 rounded">0.6</div>
                <div className="bg-yellow-500 text-center py-1 rounded">0.8</div>
                <div className="bg-green-500 text-center py-1 rounded">1.0</div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
              <h4 className="font-semibold mb-4">System Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">HPA Activation</span>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      hormoneData.crh.level > 70 ? 'bg-red-500' : 
                      hormoneData.crh.level > 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-xs">
                      {hormoneData.crh.level > 70 ? 'High' : 
                       hormoneData.crh.level > 40 ? 'Normal' : 'Low'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Feedback Loop</span>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      hormoneData.feedback.level > 50 ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-xs">
                      {hormoneData.feedback.level > 50 ? 'Active' : 'Impaired'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cortisol Response</span>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      hormoneData.cortisol.level > 60 ? 'bg-red-500' : 
                      hormoneData.cortisol.level > 30 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-xs">
                      {hormoneData.cortisol.level > 60 ? 'Elevated' : 
                       hormoneData.cortisol.level > 30 ? 'Normal' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
              <h4 className="font-semibold mb-4">Performance Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Time</span>
                    <span>{(hormoneData.acth.level / hormoneData.crh.level * 100).toFixed(0)}ms</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, hormoneData.acth.level / hormoneData.crh.level * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Efficiency</span>
                    <span>{(100 - Math.abs(hormoneData.cortisol.level - hormoneData.acth.level)).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${100 - Math.abs(hormoneData.cortisol.level - hormoneData.acth.level)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Stability</span>
                    <span>{(100 - Math.abs(hormoneData.feedback.level - 60)).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${100 - Math.abs(hormoneData.feedback.level - 60)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Scenarios */}
        <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <h3 className="text-2xl font-bold mb-6">Simulation Scenarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <button
              onClick={() => setSliders({
                stress: 90,
                hypothalamus: 80,
                pituitary: 70,
                adrenal: 85,
                feedback: 30
              })}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 p-4 rounded-xl transition-all duration-200"
            >
              <h4 className="font-semibold mb-2">Acute Stress</h4>
              <p className="text-sm opacity-90">Simulate high stress response with reduced feedback</p>
            </button>
            
            <button
              onClick={() => setSliders({
                stress: 20,
                hypothalamus: 30,
                pituitary: 25,
                adrenal: 35,
                feedback: 80
              })}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 p-4 rounded-xl transition-all duration-200"
            >
              <h4 className="font-semibold mb-2">Relaxed State</h4>
              <p className="text-sm opacity-90">Low stress with strong negative feedback</p>
            </button>
            
            <button
              onClick={() => setSliders({
                stress: 70,
                hypothalamus: 90,
                pituitary: 40,
                adrenal: 30,
                feedback: 70
              })}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 p-4 rounded-xl transition-all duration-200"
            >
              <h4 className="font-semibold mb-2">Chronic Stress</h4>
              <p className="text-sm opacity-90">Prolonged activation with system dysfunction</p>
            </button>
            
            <button
              onClick={() => setSliders({
                stress: 50,
                hypothalamus: 50,
                pituitary: 50,
                adrenal: 50,
                feedback: 60
              })}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 p-4 rounded-xl transition-all duration-200"
            >
              <h4 className="font-semibold mb-2">Homeostasis</h4>
              <p className="text-sm opacity-90">Balanced system with normal feedback</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400">
          <p className="text-sm">
            Interactive HPA Axis Visualization | Built with React, D3.js, and Tailwind CSS
          </p>
          <p className="text-xs mt-2">
            Adjust sliders to see real-time changes in hormone levels and system dynamics
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`

/* HPA Axis Visualization - Complete CSS Styles */

/* Global Styles and Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #ffffff;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow-x: hidden;
}

/* Main Container */
.hpa-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%);
  position: relative;
  overflow: hidden;
}

.hpa-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
  pointer-events: none;
  z-index: 1;
}

.main-content {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header Styles */
.header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.main-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 50px rgba(102, 126, 234, 0.3);
  animation: titleGlow 3s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  0% { filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5)); }
  100% { filter: drop-shadow(0 0 30px rgba(102, 126, 234, 0.8)); }
}

.subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* Glassmorphism Panel */
.glass-panel {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.glass-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.glass-panel::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  bottom: 0;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

/* Control Panel */
.control-panel {
  margin-bottom: 3rem;
}

.control-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.control-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: white;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  box-shadow: 0 10px 30px rgba(107, 114, 128, 0.3);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(107, 114, 128, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
}

.time-display {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Courier New', monospace;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Slider Grid */
.slider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.slider-container {
  position: relative;
}

.slider-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Custom Slider Styles */
.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #374151 0%, #4b5563 100%);
  outline: none;
  opacity: 0.8;
  transition: opacity 0.3s, box-shadow 0.3s;
  position: relative;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  margin-bottom: 1rem;
}

.slider:hover {
  opacity: 1;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 25px rgba(102, 126, 234, 0.8), 0 6px 20px rgba(0, 0, 0, 0.4);
}

.slider::-webkit-slider-thumb:active {
  transform: scale(0.95);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  border: none;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 25px rgba(102, 126, 234, 0.8), 0 6px 20px rgba(0, 0, 0, 0.4);
}

.slider-value {
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: inline-block;
  min-width: 60px;
}

/* Main Visualization Grid */
.visualization-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (max-width: 1024px) {
  .visualization-grid {
    grid-template-columns: 1fr;
  }
}

/* D3 Visualization Container */
.d3-container {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
}

.d3-svg {
  width: 100%;
  height: 600px;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

/* Side Panel */
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Hormone Levels Panel */
.hormone-panel {
  position: relative;
}

.hormone-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hormone-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hormone-item {
  position: relative;
}

.hormone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.hormone-name {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
  color: rgba(255, 255, 255, 0.9);
}

.hormone-value {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Courier New', monospace;
}

.hormone-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.hormone-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.hormone-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Time Series Graph */
.graph-container {
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.graph-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Gland Information Panel */
.gland-info {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gland-info-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gland-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.gland-hormones {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gland-hormones h4 {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.hormone-list-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.hormone-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Real-time Data Cards */
.data-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.data-card {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.data-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.data-card:hover::before {
  opacity: 1;
}

.data-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.data-card-info {
  flex: 1;
}

.data-card-label {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.data-card-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
}

.data-card-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.data-card-progress {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.data-card-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
}

.data-card-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.data-card-trend {
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

/* Color Variants */
.data-card-red {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 127, 0.2));
  border-color: rgba(239, 68, 68, 0.3);
}

.data-card-teal {
  background: linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(6, 182, 212, 0.2));
  border-color: rgba(20, 184, 166, 0.3);
}

.data-card-blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2));
  border-color: rgba(59, 130, 246, 0.3);
}

.data-card-purple {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(168, 85, 247, 0.2));
  border-color: rgba(147, 51, 234, 0.3);
}

/* Advanced Analytics */
.analytics-panel {
  margin-bottom: 3rem;
}

.analytics-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.95);
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.analytics-card {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.analytics-card-title {
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Correlation Matrix */
.correlation-matrix {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
}

.correlation-header {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
}

.correlation-cell {
  padding: 0.5rem;
  border-radius: 0.25rem;
  color: white;
  font-weight: 600;
}

.correlation-high { background-color: #10b981; }
.correlation-medium { background-color: #f59e0b; }
.correlation-low { background-color: #ef4444; }

/* System Status */
.status-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.status-high { background-color: #ef4444; }
.status-normal { background-color: #10b981; }
.status-low { background-color: #f59e0b; }

/* Performance Metrics */
.metric-item {
  margin-bottom: 1.5rem;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.metric-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.metric-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.metric-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.metric-blue { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
.metric-green { background: linear-gradient(90deg, #10b981, #059669); }
.metric-purple { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }

/* Simulation Scenarios */
.scenarios-panel {
  margin-bottom: 3rem;
}

.scenarios-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.95);
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.scenario-btn {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: white;
  position: relative;
  overflow: hidden;
}

.scenario-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.scenario-btn:hover::before {
  transform: translateX(100%);
}

.scenario-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.scenario-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.scenario-description {
  font-size: 0.875rem;
  opacity: 0.9;
  line-height: 1.4;
}

.scenario-acute {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 127, 0.2));
  border-color: rgba(239, 68, 68, 0.3);
}

.scenario-relaxed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2));
  border-color: rgba(16, 185, 129, 0.3);
}

.scenario-chronic {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 146, 60, 0.2));
  border-color: rgba(245, 158, 11, 0.3);
}

.scenario-homeostasis {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  border-color: rgba(59, 130, 246, 0.3);
}

/* Footer */
.footer {
  margin-top: 3rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-title {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.footer-subtitle {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* Animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Utility Classes */
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-glow { animation: glow 2s ease-in-out infinite; }
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
.animate-slide-up { animation: slideUp 0.5s ease-out; }
.animate-rotate { animation: rotate 2s linear infinite; }

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .control-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .slider-grid {
    grid-template-columns: 1fr;
  }
  
  .data-cards {
    grid-template-columns: 1fr;
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .scenarios-grid {
    grid-template-columns: 1fr;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .d3-svg {
    height: 400px;
  }
}

@media (max-width: 480px) {
  .glass-panel {
    padding: 1rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
  
  .data-card {
    padding: 1rem;}}


      `}</style>
    </div>
  );
};

export default HPAAxisVisualization;