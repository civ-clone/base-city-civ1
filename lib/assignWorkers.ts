import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import City from '@civ-clone/core-city/City';
import Tile from '@civ-clone/core-world/Tile';
import { Food, Production, Trade } from '@civ-clone/civ1-world/Yields';

export const assignWorkers: (
  city: City,
  playerWorldRegistry?: PlayerWorldRegistry,
  cityGrowthRegistry?: CityGrowthRegistry
) => void = (
  city: City,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance
): void => {
  const cityGrowth = cityGrowthRegistry.getByCity(city);

  city.tilesWorked().register(
    ...city
      .tile()
      .getSurroundingArea()
      .filter((tile: Tile): boolean => !city.tilesWorked().includes(tile))
      .filter((tile: Tile): boolean =>
        playerWorldRegistry.getByPlayer(city.player()).includes(tile)
      )
      .sort(
        (a: Tile, b: Tile): number =>
          b.score(city.player(), [
            [Food, 4],
            [Production, 2],
            [Trade, 1],
          ]) -
          a.score(city.player(), [
            [Food, 4],
            [Production, 2],
            [Trade, 1],
          ])
      )
      // +1 here because we also work the main city tile
      .slice(0, cityGrowth.size() + 1 - city.tilesWorked().length)
  );
};

export default assignWorkers;
