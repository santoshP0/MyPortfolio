You are a senior full-stack game developer and technical architect.

We are building a 3D interactive portfolio as a mini open-world driving game.

Core Concept:
A small car drives in a stylized Thar desert environment. Different areas of the desert represent sections of my portfolio (Projects, Skills, Experience, Contact). The user can only navigate by driving the car. The car can shoot bullets that progressively destroy objects which reveal content.

Technical Requirements:

1. Tech Stack
- Frontend: React + Three.js using React Three Fiber (R3F)
- Physics: @react-three/rapier
- Controls: Custom keyboard controls (WASD + Arrow keys)
- State: Zustand
- Animations: Drei helpers + GSAP if needed
- Build Tool: Vite
- Version control: Git (strict phase commits)

2. Environment
- Stylized Thar desert:
  - Sand terrain
  - Dunes
  - Scattered rocks
  - Subtle wind particles
  - Warm lighting (sunset feel)
- Skybox
- Directional light + shadows
- Performance target: 60 FPS

3. Car System
- Third-person camera follow
- Realistic but arcade-style physics
- Acceleration, braking, turning
- Camera smoothly follows behind
- Keyboard input:
  - W / ArrowUp → accelerate
  - S / ArrowDown → brake
  - A / ArrowLeft → left
  - D / ArrowRight → right
  - Space → shoot

4. Shooting System
- Bullets spawn from car front
- Physics-based projectiles
- Collision detection
- Objects have health
- Each bullet reduces health
- Object visually cracks
- After health reaches zero:
  - Object explodes into fragments
  - Portfolio content appears (floating UI panel)

5. Portfolio Sections (Game Areas)
- Projects = Destroy big stone monuments
- Skills = Destroy floating skill crates
- Experience = Destroy metal boards
- Contact = Destroy signal tower

Each destroyed object reveals:
- Animated 3D panel
- Title
- Description
- Links
- Close button

6. UI
- Minimal HUD:
  - Health bar of targeted object
  - Small map (optional phase 3)
- Intro overlay:
  - "Drive through my portfolio"
  - Click to Start (locks pointer)

7. Audio
- Engine sound
- Shooting sound
- Explosion sound
- Ambient desert wind

8. Performance Rules
- Use instancing where possible
- Lazy load heavy models
- Optimize shadows
- Avoid unnecessary re-renders
- Target under 200 draw calls

9. Git Workflow (VERY IMPORTANT)
We must not lose project phases.

Create this structure:

/docs
  phase-1-setup.md
  phase-2-environment.md
  phase-3-car-physics.md
  phase-4-shooting.md
  phase-5-damage-system.md
  phase-6-portfolio-integration.md
  phase-7-polish.md

Also create:
/prompts
  master-prompt.md
  environment-prompt.md
  physics-prompt.md
  shooting-prompt.md

After completing each phase:
- Commit with descriptive message:
  "Phase 1: Vite + R3F setup complete"
  "Phase 2: Desert environment implemented"
  etc.

No skipping commits.

10. Development Phases

Phase 1:
- Vite setup
- R3F base scene
- Basic camera + light
- Git init

Phase 2:
- Desert terrain
- Skybox
- Lighting
- Static objects

Phase 3:
- Car model
- Physics integration
- Keyboard movement
- Camera follow

Phase 4:
- Shooting system
- Projectile physics
- Collision

Phase 5:
- Damage system
- Health state
- Breakable objects
- Explosion animation

Phase 6:
- Portfolio data integration
- 3D floating panels
- Links
- Close interaction

Phase 7:
- Audio
- Optimization
- Polish
- Deployment

11. Code Quality Rules
- Use modular components
- Separate logic and rendering
- Keep physics isolated
- Document complex math
- No magic numbers

12. Final Output
- Fully functional interactive 3D portfolio
- Clean folder structure
- Production-ready build
- README explaining:
  - Controls
  - Architecture
  - How to extend
  - Performance considerations

Start with Phase 1.
Create full folder structure and initialize project.
Commit after phase completion.