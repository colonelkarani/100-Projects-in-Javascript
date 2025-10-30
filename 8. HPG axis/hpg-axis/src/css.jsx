export default `
.app-root {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  background: linear-gradient(120deg, #f0f4ff 0%, #e8eaf6 100%);
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

header {
  text-align: center;
  padding: 2rem 0 1rem 0;
  background: linear-gradient(90deg, #e3f2fd 0%, #fce4ec 100%);
  border-bottom: 1px solid #e0e0e0;
}

h1 {
  font-size: 3rem;
  margin: 0;
  color: #22223b;
  letter-spacing: 0.04em;
}

.subtitle {
  font-size: 1.2rem;
  color: #4f4f4f;
  margin-top: 0.5rem;
}

.main-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 3rem;
  padding: 2rem 0;
  max-width: 1400px;
  margin: 0 auto;
}

.sliders-panel {
  width: 320px;
  background: #fff;
  padding: 2rem 1.5rem;
  border-radius: 24px;
  box-shadow: 0 4px 24px #0001;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-height: 600px;
  overflow-y: auto;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider-label {
  width: 90px;
  font-weight: bold;
  color: #222;
  font-size: 1rem;
  text-align: right;
}

input[type="range"] {
  flex: 1;
  margin: 0 0.5rem;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  outline: none;
  transition: background 0.3s;
}

input[type="range"]:hover {
  background: #cfd8dc;
}

.slider-value {
  width: 36px;
  text-align: left;
  font-size: 1rem;
  color: #555;
}

.visual-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  box-shadow: 0 8px 40px #0001;
  border-radius: 24px;
  margin: 0 auto;
  display: block;
}

footer {
  text-align: center;
  padding: 2rem 0 1rem 0;
  color: #888;
  font-size: 1.1rem;
  letter-spacing: 0.02em;
  background: transparent;
}
`;
