<template>
  <div class="app">

    <div class="oblaci">
      <div class="oblak oblak1">☁️</div>
      <div class="oblak oblak2">⛅</div>
      <div class="oblak oblak3">☁️</div>
      <div class="oblak oblak4">🌥</div>
      <div class="oblak oblak5">☁️</div>
    </div>

    <header>
      <h1>🌤 Временска прогноза</h1>
      <nav>
        <NuxtLink to="/">Дневна прогноза</NuxtLink>
        <NuxtLink to="/forecast">5-Дневна прогноза</NuxtLink>
        <NuxtLink to="/feedback">Остави мислење</NuxtLink>
        <NuxtLink to="/about">За нас</NuxtLink>
      </nav>
    </header>

    <div class="layout">

      <div class="sidepanel left">
        <div class="sidecard">🌡 Температура</div>
        <div class="sidecard">❄️ Скопје<br/><span>13°C</span></div>
        <div class="sidecard">☀️ Дубаи<br/><span>38°C</span></div>
        <div class="sidecard">🌧 Лондон<br/><span>11°C</span></div>
      </div>

      <main>
        <NuxtPage />
      </main>

      <div class="sidepanel right">
        <div class="sidecard">💡 Совети</div>
        <div class="sidecard">🌂 Под 10°C<br/><span>носи јакна</span></div>
        <div class="sidecard">☀️ Над 30°C<br/><span>пиј вода</span></div>
        <div class="sidecard">🌧 Дожд?<br/><span>понеси чадор</span></div>
      </div>

    </div>

    <footer>
      <p>🌤 Weather App © 2026 — Направено со Nuxt 3</p>
      <p class="footerSub">Податоци од OpenWeatherMap API</p>
    </footer>

  </div>
</template>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  text-align: center;
  background: linear-gradient(135deg, #0951a4, #0361bf, #156ab0);
  color: white;
  overflow: hidden;
  position: relative;
}

header h1 {
  font-size: 2rem;
  letter-spacing: 2px;
  margin-bottom: 2px;   
  position: relative;
  z-index: 1;
  margin-top: 30px;
}

nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 30px;
  margin-top: 20px;
}

nav a {
  color: rgba(255,255,255,0.9);
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(0,0,0,0.2);   
  transition: all 0.2s;
}

nav a:hover,
nav a.router-link-active {
  background: rgba(0,0,0,0.35);   
  color: white;
}

main {
  position: relative;
  z-index: 1;
}


.oblaci {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.oblak {
  position: absolute;
  opacity: 0.15;
  animation: letanje linear infinite;
}

.oblak1 { top: 10%; font-size: 5rem; animation-duration: 25s; animation-delay: 0s; }
.oblak2 { top: 25%; font-size: 3rem; animation-duration: 35s; animation-delay: -8s; }
.oblak3 { top: 45%; font-size: 6rem; animation-duration: 28s; animation-delay: -15s; }
.oblak4 { top: 65%; font-size: 4rem; animation-duration: 40s; animation-delay: -5s; }
.oblak5 { top: 80%; font-size: 3.5rem; animation-duration: 22s; animation-delay: -20s; }

@keyframes letanje {
  from { transform: translateX(-150px); }
  to   { transform: translateX(110vw); }
}

.layout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  z-index: 1;
  flex: 1;
}

main {
  flex: 1;
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.sidepanel {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 160px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidepanel:first-of-type {
  left: 16px;    
}

.sidepanel:last-of-type {
  right: 16px;   
}

.sidecard {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 15px;
  padding: 12px;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.1;
  text-align: center;
}

.sidecard span {
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

footer {
  position: relative;
  z-index: 1;
  margin-top: auto;
  width: 100%;
  padding: 10px;
  font-size: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.5);
  background: rgba(0,0,0,0.15);
  backdrop-filter: blur(10px);
}

.footerSub {
  margin-top: 4px;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.35);
}
</style>