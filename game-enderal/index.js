const Promise = require('bluebird');
const { util } = require('vortex-api');
const winapi = require('winapi-bindings');

function findGame() {
  try {
    const instPath = winapi.RegGetValue(
      'HKEY_LOCAL_MACHINE',
      'Software\\Wow6432Node\\Bethesda Softworks\\skyrim',
      'Installed Path');
    if (!instPath) {
      throw new Error('empty registry key');
    }
    return Promise.resolve(instPath.value);
  } catch (err) {
    return util.steam.findByName('Enderal: Forgotten Stories')
      .then(game => game.gamePath);
  }
}

function main(context) {
  context.registerGame({
  	// note that this is remapped to 'skyrim' in the nexus_integration extension
    id: 'enderal',
    name: 'Enderal',
    mergeMods: true,
    queryPath: findGame,
    supportedTools: tools,
    queryModPath: () => 'data',
    logo: 'gameart.png',
    executable: () => 'Enderal Launcher.exe',
    requiredFiles: [
      'Enderal Launcher.exe',
    ],
    environment: {
      SteamAPPId: '933480',
    },
    details: {
      steamAppId: 933480,
    }
  });

  return true;
}

module.exports = {
  default: main
};
