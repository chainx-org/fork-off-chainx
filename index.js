const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const cliProgress = require('cli-progress');
require("dotenv").config();
const {
  ApiPromise
} = require('@polkadot/api');
const {
  HttpProvider
} = require('@polkadot/rpc-provider');
const {
  xxhashAsHex
} = require('@polkadot/util-crypto');
const execFileSync = require('child_process').execFileSync;
const execSync = require('child_process').execSync;
const binaryPath = path.join(__dirname, 'chainx-fork', 'binary');
const wasmPath = path.join(__dirname, 'chainx-fork', 'runtime.wasm');
const schemaPath = path.join(__dirname, 'chainx-fork', 'schema.json');
const hexPath = path.join(__dirname, 'chainx-fork', 'runtime.hex');
const originalSpecPath = path.join(__dirname, 'chainx-fork', 'genesis.json');
const forkedSpecPath = path.join(__dirname, 'chainx-fork', 'fork.json');
const storagePath = path.join(__dirname, 'chainx-fork', 'storage.json');

// Using http endpoint since substrate's Ws endpoint has a size limit.
const provider = new HttpProvider(process.env.HTTP_RPC_ENDPOINT || 'http://localhost:9933')
// The storage download will be split into 256^chunksLevel chunks.
const chunksLevel = process.env.FORK_CHUNKS_LEVEL || 1;
const totalChunks = Math.pow(256, chunksLevel);

let chunksFetched = 0;
let separator = false;
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

/**
 * All module prefixes except those mentioned in the skippedModulesPrefix will be added to this by the script.
 * If you want to add any past module or part of a skipped module, add the prefix here manually.
 *
 * Any storage value’s hex can be logged via console.log(api.query.<module>.<call>.key([...opt params])),
 * e.g. console.log(api.query.timestamp.now.key()).
 *
 * If you want a map/doublemap key prefix, you can do it via .keyPrefix(),
 * e.g. console.log(api.query.system.account.keyPrefix()).
 *
 * For module hashing, do it via xxhashAsHex,
 * e.g. console.log(xxhashAsHex('System', 128)).
 */
// let prefixes = ['0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9' /* System.Account */];
const PhragmenElection = '0xe2e62dd81c48a88f73b6f6463555fd8e'
const ElectionPhragmen = '0x6112a464bbca6c1759f131dfa7bb5d06'
const Elections = '0x7cda3cfa86b349fdafce4979b197118f'
const ElectionsMembers = '0x7cda3cfa86b349fdafce4979b197118fba7fb8745735dc3be2a2c61a72c39e78'
const GrandpaFinality = '0x2371e21684d2fae99bcb4d579242f74a'
const Grandpa = '0x5f9cc45b7a00c5899361e1c6099678dc'

// /*
//  * OnRuntime_Upgrade config(confilct with Testnet config)
//  */
// // Specify the modules to be migrated
// let prefixes = [Elections, ElectionPhragmen, GrandpaFinality];
// // replace storage prefix
// let replace_prefix = [
//   [Elections, PhragmenElection],
//   [ElectionPhragmen, PhragmenElection],
//   [GrandpaFinality, Grandpa]
// ]
// // drop old storage
// const skippedModulesPrefix = [];

/*
 * Testnet config(confilct with OnRuntime_Upgrade config)
 */
// Specify the modules to be migrated
let prefixes = [];
// replace storage prefix
let replace_prefix = []
// drop old storage
const skippedModulesPrefix = [
  'System', 'Session', 'Babe', 'FinalityTracker', 'Grandpa', 'GrandpaFinality', 'Authorship' , 'XStaking'
];

async function main() {
  // console.log("PhragmenElection " + xxhashAsHex('PhragmenElection', 128))
  if (!fs.existsSync(binaryPath)) {
    console.log(chalk.red('Binary missing. Please copy the binary of your substrate node to the data folder and rename the binary to "binary"'));
    process.exit(1);
  }
  execFileSync('chmod', ['+x', binaryPath]);

  if (!fs.existsSync(wasmPath)) {
    console.log(chalk.red('WASM missing. Please copy the WASM blob of your substrate node to the data folder and rename it to "runtime.wasm"'));
    process.exit(1);
  }
  execSync('cat ' + wasmPath + ' | hexdump -ve \'/1 "%02x"\' > ' + hexPath);

  let api;
  console.log(chalk.green('We are intentionally using the HTTP endpoint. If you see any warnings about that, please ignore them.'));
  if (!fs.existsSync(schemaPath)) {
    console.log(chalk.yellow('Custom Schema missing, using default schema.'));
    api = await ApiPromise.create({
      provider
    });
  } else {
    const {
      types,
      rpc
    } = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    api = await ApiPromise.create({
      provider,
      types,
      rpc,
    });
  }

  if (fs.existsSync(storagePath)) {
    console.log(chalk.yellow('Reusing cached storage. Delete ./data/storage.json and rerun the script if you want to fetch latest storage'));
  } else {
    // Download state of original chain
    console.log(chalk.green('Fetching current state of the live chain. Please wait, it can take a while depending on the size of your chain.'));
    progressBar.start(totalChunks, 0);
    const stream = fs.createWriteStream(storagePath, { flags: 'a' });
    stream.write("[");
    await fetchChunks("0x", chunksLevel, stream);
    stream.write("]");
    stream.end();
    progressBar.stop();
  }

  const metadata = await api.rpc.state.getMetadata();
  // Populate the prefixes array
  const modules = JSON.parse(metadata.asLatest.modules);
  console.log("upstream metadata storage::::::::::::::::::")
  modules.forEach((module) => {
    if (module.storage) {
        console.log(module.storage.prefix)
      if (!skippedModulesPrefix.includes(module.storage.prefix)) {
        prefixes.push(xxhashAsHex(module.storage.prefix, 128));
      }
    }
  });
  console.log("::::::::::::::::::upstream metadata storage")

  // Generate chain spec for original and forked chains
  execSync(binaryPath + ' build-spec --raw > ' + originalSpecPath);
  execSync(binaryPath + ' build-spec --chain fork --raw > ' + forkedSpecPath);

  let storage = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
  let originalSpec = JSON.parse(fs.readFileSync(originalSpecPath, 'utf8'));
  let forkedSpec = JSON.parse(fs.readFileSync(forkedSpecPath, 'utf8'));

  // Modify chain name and id
  forkedSpec.name = originalSpec.name + '-fork';
  forkedSpec.id = originalSpec.id + '-fork';
  forkedSpec.protocolId = originalSpec.protocolId + '-fork';

  console.log(prefixes)

  // Grab the items to be moved, then iterate through and insert into storage
  storage
    .filter((i) => prefixes.some((prefix) => i[0].startsWith(prefix)))
    .forEach(([key, value]) => {
      replace_prefix.forEach(([orgin, replaced]) => {
        if (key.startsWith(orgin)) {
          console.log("------------")
          console.log("replace prefix ", orgin, " to ", replaced)
          // console.log("find replace_key: " + key)
          key = key.replace(orgin, replaced);
          // console.log("after replace: " + key)
          console.log("------------")
        }
        forkedSpec.genesis.raw.top[key] = value;
      })
    })
  // Add replaced prefix/value
  // forkedSpec.genesis.raw.top[replacePrefix[1]] = forkedSpec.genesis.raw.top[replacePrefix[0]]
  // Delete System.LastRuntimeUpgrade to ensure that the on_runtime_upgrade event is triggered
  delete forkedSpec.genesis.raw.top['0x26aa394eea5630e07c48ae0c9558cef7f9cce9c888469bb1a0dceaa129672ef8'];

  // Set the code to the current runtime code
  forkedSpec.genesis.raw.top['0x3a636f6465'] = '0x' + fs.readFileSync(hexPath, 'utf8').trim();

  // To prevent the validator set from changing mid-test, set Staking.ForceEra to ForceNone ('0x02')
  forkedSpec.genesis.raw.top['0x5f3e4907f716ac89b6347d15ececedcaf7dad0317324aecae8744b87fc95f2f3'] = '0x02';

  fs.writeFileSync(forkedSpecPath, JSON.stringify(forkedSpec, null, 4));

  console.log('Forked genesis generated successfully. Find it at ./data/fork.json');
  process.exit();
}

main();

async function fetchChunks(prefix, levelsRemaining, stream) {
  if (levelsRemaining <= 0) {
    const pairs = await provider.send('state_getPairs', [prefix]);
    if (pairs.length > 0) {
      separator ? stream.write(",") : separator = true;
      stream.write(JSON.stringify(pairs).slice(1, -1));
    }
    progressBar.update(++chunksFetched);
    return;
  }

  // Async fetch the last level
  if (process.env.QUICK_MODE && levelsRemaining == 1) {
    let promises = [];
    for (let i = 0; i < 256; i++) {
      promises.push(fetchChunks(prefix + i.toString(16).padStart(2 * chunksLevel, "0"), levelsRemaining - 1, stream));
    }
    await Promise.all(promises);
  } else {
    for (let i = 0; i < 256; i++) {
      await fetchChunks(prefix + i.toString(16).padStart(2 * chunksLevel, "0"), levelsRemaining - 1, stream);
    }
  }
}
