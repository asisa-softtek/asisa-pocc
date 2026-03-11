export default async function decorate(block) {
  console.log("pokemon-card loaded");

  // 1. Obtenemos la primera fila de datos (la que está debajo del título de la tabla)
  const row = block.children[0];
  if (!row) return;

  // 2. Extraemos el texto de cada una de las columnas
  const pokemonNames = [...row.children].map(col => col.textContent.trim().toLowerCase());

  // 3. Limpiamos el bloque para inyectar nuestro HTML
  block.textContent = '';

  // 4. Iteramos sobre cada nombre encontrado
  for (const pokemonName of pokemonNames) {
    // Si la celda estaba vacía, creamos una columna vacía para mantener el layout
    if (!pokemonName) {
      const emptyCol = document.createElement('div');
      emptyCol.className = 'poke-col empty';
      block.append(emptyCol);
      continue;
    }

    const colWrapper = document.createElement('div');
    colWrapper.className = 'poke-col';

    try {
      // Usamos el middleware configurado para resolver la ruta /poke-data/
      const resp = await fetch(`/poke-data/pokemon/${pokemonName}`);
      if (!resp.ok) throw new Error('No encontrado');

      const data = await resp.json();

      // Construimos el HTML aplicando los fondos de UI de cristal y colores corporativos
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
      colWrapper.innerHTML = `
        <div class="poke-card-inner error">
          <p class="meta">Error al cargar: ${pokemonName}</p>
        </div>`;
    }

    block.append(colWrapper);
  }
}