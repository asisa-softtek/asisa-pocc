export default async function decorate(block) {
 console.log("pokemon-card loaded");
  // 1. Extraemos el nombre del Pokémon de la segunda fila de tu tabla
  const pokemonName = block.textContent.trim().toLowerCase() || 'pikachu';

  // Limpiamos el bloque para el renderizado
  block.textContent = '';

  // 2. Llamada al proxy definido en fstab.yaml
  try {
    const resp = await fetch(`/poke-data/pokemon/${pokemonName}`);
    if (!resp.ok) throw new Error('Pokemon no encontrado');

    const data = await resp.json();

    // 3. Creamos el HTML con tu estilo de "Cristal"
    const card = document.createElement('div');
    card.className = 'poke-card-inner';
    card.innerHTML = `
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <p class="meta">#${data.id}</p>
      <h3>${data.name}</h3>
      <button class="action-btn">Ver más</button>
    `;

    block.append(card);
  } catch (error) {
    block.innerHTML = `<p>Error al cargar a ${pokemonName}</p>`;
  }
}