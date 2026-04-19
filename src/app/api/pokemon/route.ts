import { NextRequest, NextResponse } from 'next/server';
import { getRandomPokemonId, Difficulty } from '@/lib/pokemon-data';

export const runtime = 'edge';

async function fetchJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Failed: ${url}`);
  return res.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const difficulty = (searchParams.get('difficulty') as Difficulty) || 'easy';
  const idParam = searchParams.get('id');

  try {
    const pokemonId = idParam ? parseInt(idParam) : getRandomPokemonId(difficulty);

    const [pokemon, species] = await Promise.all([
      fetchJson(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
      fetchJson(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`),
    ]);

    // Locations — non bloccante
    let locations: { game: string; area: string }[] = [];
    try {
      const locData = await fetchJson(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`
      );
      locations = locData.slice(0, 6).map((enc: any) => ({
        area: enc.location_area?.name?.replace(/-/g, ' ') ?? '—',
        game: enc.version_details?.[0]?.version?.name ?? '—',
      }));
    } catch {}

    // Descrizione in italiano o inglese
    const flavorIt = species.flavor_text_entries?.find(
      (e: any) => e.language.name === 'it'
    )?.flavor_text;
    const flavorEn = species.flavor_text_entries?.find(
      (e: any) => e.language.name === 'en'
    )?.flavor_text;
    const flavor = (flavorIt || flavorEn || '')
      .replace(/\f/g, ' ')
      .replace(/\n/g, ' ');

    // Nome in italiano o inglese
    const nameIt = species.names?.find((n: any) => n.language.name === 'it')?.name;
    const nameEn = species.names?.find((n: any) => n.language.name === 'en')?.name;
    const displayName = nameIt || nameEn || pokemon.name;

    // Categoria specie
    const genusIt = species.genera?.find((g: any) => g.language.name === 'it')?.genus;
    const genusEn = species.genera?.find((g: any) => g.language.name === 'en')?.genus;

    // Abilità
    const abilities = pokemon.abilities.map((a: any) => ({
      name: a.ability.name.replace(/-/g, ' '),
      hidden: a.is_hidden,
    }));

    // Statistiche
    const stats = pokemon.stats.map((s: any) => ({
      name: s.stat.name,
      value: s.base_stat,
    }));

    // Tipi
    const types = pokemon.types.map((t: any) => t.type.name);

    // Immagine ufficiale
    const image =
      pokemon.sprites.other?.['official-artwork']?.front_default ||
      pokemon.sprites.front_default;

    // Generazione
    const gen = species.generation?.name?.replace('generation-', '').toUpperCase();

    // Evoluzione chain URL
    const evolutionChainUrl = species.evolution_chain?.url;

    // Fetch evolution chain
    let evolutionNames: string[] = [];
    if (evolutionChainUrl) {
      try {
        const evoData = await fetchJson(evolutionChainUrl);
        function extractNames(chain: any): string[] {
          const names: string[] = [chain.species?.name];
          if (chain.evolves_to?.length > 0) {
            chain.evolves_to.forEach((e: any) => names.push(...extractNames(e)));
          }
          return names;
        }
        evolutionNames = extractNames(evoData.chain);
      } catch {}
    }

    return NextResponse.json({
      id: pokemonId,
      name: displayName,
      rawName: pokemon.name,
      number: String(pokemonId).padStart(3, '0'),
      types,
      image,
      flavor,
      genus: genusIt || genusEn || '',
      height: pokemon.height / 10, // metri
      weight: pokemon.weight / 10, // kg
      abilities,
      stats,
      locations,
      evolution: evolutionNames,
      generation: gen,
      captureRate: species.capture_rate,
      baseHappiness: species.base_happiness,
      isLegendary: species.is_legendary,
      isMythical: species.is_mythical,
      habitat: species.habitat?.name || null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Pokemon non trovato' }, { status: 500 });
  }
}
