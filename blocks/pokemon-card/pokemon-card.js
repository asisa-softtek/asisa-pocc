export default async function decorate(block) {
  // 1. En Franklin, block.firstElementChild es la fila que contiene las celdas
  const cols = [...block.firstElementChild.children];

  // 2. Limpiamos el bloque completo antes de inyectar las tarjetas
  block.textContent = '';

  // 3. Iteramos sobre cada celda individualmente
  for (const col of cols) {
    const pokemonName = col.textContent.trim().toLowerCase();

    // Si la celda está vacía, la saltamos
    if (!pokemonName) continue;

    const colWrapper = document.createElement('div');
    colWrapper.className = 'poke-col';

    try {
      // 4. Llamada individual al proxy
      const resp = await fetch(`/poke-data/pokemon/${pokemonName}`);
      if (!resp.ok) throw new Error('Pokemon no encontrado');

      const data = await resp.json();

      // 5. Estructura de la tarjeta con clases para aplicar el efecto cristal
      const card = document.createElement('div');
      card.className = 'poke-card-inner';
      card.innerHTML = `
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p class="meta">#${data.id}</p>
        <h3>${data.name}</h3>
        <button class="action-btn">Ver más</button>
      `;

      colWrapper.append(card);
    } catch (error) {
      // Ahora el error mostrará correctamente cada nombre por separado
      colWrapper.innerHTML = `
        <div class="poke-card-inner error">
          <p class="meta">Error al cargar a ${pokemonName}</p>
        </div>`;
    }

    block.append(colWrapper);
  }
}