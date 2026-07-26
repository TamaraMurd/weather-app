<template>
  <div class="about">


    <div class="naslov">
      <h2>За апликацијата 🌤</h2>
    </div>

    <div class="card">
      <h3>📖 Опис</h3>
      <p>
        Ова е веб апликација која овозможува пребарување на моментална временска прогноза, како и прогнозата во наредните 5 денови
        за било кој град во светот. Корисникот го внесува само
        името на градот и добива детални информации за времето во реално време.
      </p>
    </div>

    <div class="card">
      <h3>🛠 Технологии</h3>
      <div class="grid">
        <div class="gridItem">
          <span class="icon">💚</span>
          <span class="ime">Nuxt 3</span>
          <span class="opis">Frontend framework</span>
        </div>
        <div class="gridItem">
          <span class="icon">💛</span>
          <span class="ime">Vue 3</span>
          <span class="opis">JavaScript framework</span>
        </div>
        <div class="gridItem">
          <span class="icon">🌐</span>
          <span class="ime">OpenWeatherMap</span>
          <span class="opis">Weather API</span>
        </div>
        <div class="gridItem">
          <span class="icon">🎨</span>
          <span class="ime">CSS3</span>
          <span class="opis">Стилизирање</span>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>✅ Функционалности</h3>
      <ul>
        <li>🔍 Пребарување град по име</li>
        <li>🌡 Приказ на температура во реално време</li>
        <li>💧 Влажност на воздухот</li>
        <li>💨 Брзина на ветерот</li>
        <li>🌤 Временска икона и опис</li>
        <li>🌍 Поддршка за илјадници градови</li>
      </ul>
    </div>

    <div class="card autor">
      <h3>👨‍💻 Изработија</h3>
      <p>Тамара Мурџоска и Паулина Кипревска</p>
      <p class="subtitle">ФИНКИ</p>
    </div>

    <NuxtLink to="/" class="btn">← Врати се на почетна страница</NuxtLink>


  </div>
</template>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.naslov h2 {
  font-size: 2rem;
  margin-bottom: 6px;
}

.subtitle {
  color: rgba(255,255,255,0.55);
  font-size: 0.9rem;
}

.card {
  width: 100%;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 24px 28px;
  text-align: left;
}

.card h3 {
  font-size: 1.1rem;
  margin-bottom: 14px;
  color: rgba(255,255,255,0.9);
}

.card p {
  color: rgba(255,255,255,0.75);
  line-height: 1.8;
}

.card ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card ul li {
  color: rgba(255,255,255,0.8);
  font-size: 0.95rem;
}

/* GRID ЗА ТЕХНОЛОГИИ */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.gridItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 14px;
  text-align: center;
}

.gridItem .icon {
  font-size: 1.8rem;
}

.gridItem .ime {
  font-weight: 600;
  font-size: 0.95rem;
}

.gridItem .opis {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.55);
}

/* АВТОР */
.autor {
  text-align: center;
}

.autor p {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.btn {
  padding: 12px 28px;
  background: rgba(255,255,255,0.15);
  color: white;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.2s;
  margin-bottom: 40px;
}

.btn:hover {
  background: rgba(255,255,255,0.25);
}
</style>