<template>
  <div class="map-container" :class="userStore.currentTheme.mapStyle">
    <svg 
      viewBox="0 0 1000 500" 
      class="world-map"
      :style="{
        '--map-primary': userStore.currentTheme.primary,
        '--map-secondary': userStore.currentTheme.secondary,
        '--map-accent': userStore.currentTheme.accent
      }"
    >
      <!-- SVG Definitions -->
      <defs>
        <!-- Filters -->
        <filter id="satelliteNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" />
          <feColorMatrix values="0 0 0 0 0   0 1 0 0 0   0 0 1 0 0  0 0 0 1 0" />
        </filter>
        
        <filter id="sovietFilter">
          <feColorMatrix values="1 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" />
          <feGaussianBlur stdDeviation="1" />
        </filter>
        
        <filter id="dragonScale">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" />
          <feColorMatrix values="1 0 0 0 0   0 0.5 0 0 0   0 0 0.1 0 0  0 0 0 0.5 0" />
        </filter>
        
        <filter id="classicMap">
          <feColorMatrix values="0.3 0 0 0 0   0 0.3 0 0 0   0 0 0.5 0 0  0 0 0 0.5 0" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        
        <filter id="desertHeat">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="5" />
          <feColorMatrix values="1 0 0 0 0   0 0.7 0 0 0   0 0 0.3 0 0  0 0 0 0.3 0" />
        </filter>
        
        <filter id="shadowBlur">
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix values="0.2 0 0 0 0   0 0.2 0 0 0   0 0 0.2 0 0  0 0 0 1 0" />
        </filter>

        <!-- Patterns -->
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="var(--map-accent)" stroke-width="0.2" />
        </pattern>

        <pattern id="ciaSatellite" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="1" fill="var(--map-accent)" />
          <circle cx="0" cy="0" r="1" fill="var(--map-accent)" />
          <circle cx="100" cy="100" r="1" fill="var(--map-accent)" />
        </pattern>

        <pattern id="fsbSymbol" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" fill="none" stroke="var(--map-accent)" stroke-width="0.5" />
        </pattern>

        <pattern id="mssPattern" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 0 0 Q 25 25 50 0" fill="none" stroke="var(--map-accent)" stroke-width="0.5" />
        </pattern>
      </defs>

      <!-- Map Content -->
      <g class="continents">
        <!-- North America -->
        <path d="M150,80 L280,80 L310,150 L280,200 L200,220 L170,180 L150,80" />
        
        <!-- South America -->
        <path d="M250,250 L300,250 L320,350 L280,420 L240,380 L250,250" />
        
        <!-- Europe -->
        <path d="M450,80 L520,80 L540,120 L500,150 L460,140 L450,80" />
        
        <!-- Africa -->
        <path d="M450,180 L520,180 L540,300 L480,350 L440,320 L450,180" />
        
        <!-- Asia -->
        <path d="M550,80 L800,80 L820,200 L700,250 L600,220 L550,80" />
        
        <!-- Australia -->
        <path d="M750,300 L850,300 L870,380 L800,400 L780,350 L750,300" />
      </g>

      <!-- Grid -->
      <rect width="1000" height="500" fill="url(#grid)" class="grid" />
      <line x1="0" y1="250" x2="1000" y2="250" class="equator" />

      <!-- Mission markers -->
      <g class="mission-markers">
        <template v-for="mission in missions" :key="mission.id">
          <circle
            :cx="mission.coordinates.x * 10"
            :cy="mission.coordinates.y * 5"
            r="5"
            class="marker-dot"
            @click="$emit('select-mission', mission)"
          />
          <circle
            :cx="mission.coordinates.x * 10"
            :cy="mission.coordinates.y * 5"
            r="10"
            class="marker-pulse"
          />
          <text
            :x="mission.coordinates.x * 10"
            :y="(mission.coordinates.y * 5) - 10"
            class="marker-label"
          >
            {{ mission.location }}
          </text>
        </template>
      </g>

      <!-- Team-specific overlay -->
      <rect 
        width="1000" 
        height="500" 
        :fill="userStore.team === 'CIA' ? 'url(#ciaSatellite)' : 
               userStore.team === 'FSB' ? 'url(#fsbSymbol)' : 
               userStore.team === 'MSS' ? 'url(#mssPattern)' : 'none'"
        class="map-overlay"
      />
    </svg>
  </div>
</template>

<script setup>
import { useUserStore } from '../state/user'

const userStore = useUserStore()

defineProps({
  missions: {
    type: Array,
    required: true
  }
})

defineEmits(['select-mission'])
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
}

.world-map {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 10px rgba(var(--map-accent-rgb), 0.3));
}

.continents path {
  fill: rgba(255, 255, 255, 0.05);
  stroke: var(--map-accent);
  stroke-width: 0.5;
  transition: all 0.3s ease;
}

.grid {
  opacity: 0.1;
}

.grid line {
  stroke: var(--map-accent);
  stroke-width: 0.2;
}

.equator {
  stroke-width: 0.3;
  stroke-dasharray: 2 4;
}

.marker-dot {
  fill: var(--map-accent);
  stroke: rgba(255, 255, 255, 0.8);
  stroke-width: 1;
  cursor: pointer;
  filter: drop-shadow(0 0 5px var(--map-accent));
  transition: all 0.3s ease;
}

.marker-dot:hover {
  r: 8;
  filter: drop-shadow(0 0 10px var(--map-accent));
}

.marker-pulse {
  fill: var(--map-accent);
  opacity: 0;
  transform-origin: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(3);
  }
}

.marker-label {
  fill: white;
  font-size: 8px;
  text-anchor: middle;
  pointer-events: none;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
}

.map-overlay {
  opacity: 0.15;
  mix-blend-mode: screen;
}

/* Team-specific styles */
.cia .map-overlay {
  filter: url(#satelliteNoise);
}

.fsb .map-overlay {
  filter: url(#sovietFilter);
}

.mss .map-overlay {
  filter: url(#dragonScale);
}

.mi6 .map-overlay {
  filter: url(#classicMap);
}

.mossad .map-overlay {
  filter: url(#desertHeat);
}

.ninja .map-overlay {
  filter: url(#shadowBlur);
}
</style> 