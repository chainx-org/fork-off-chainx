### 启动Fork链

1. 克隆fork-off-chainx仓库

```
git clone https://github.com/chainx-org/fork-off-chainx.git
```

2. 切换到chainx-fork分支

```
cd fork-off-chainx
git checkout chainx-fork
```

3. 下载依赖

```
npm i
```

4. 下载ChainX二进制程序

```
cd chainx-fork
wget https://github.com/chainx-org/fork-off-chainx/releases/download/v11/binary
```

5. 启动Fork链

```
./start.sh
```

**注意**：由于Fork链的程序初始设置了2个默认的验证人，所以需要启动2个节点才能正常运行，通过`./start_rjman`启动第二个验证人节点，如果2个节点无法连接，请修改`config.json`中的`bootnodes`。其中`bootnodes`格式为:`"/ip4/<ip-address>/tcp/<port>/p2p/<node-key>"`

### 自定义Fork链

#### 自定义ChainX启动时的默认配置

1. 克隆ChainX仓库

```
git clone https://github.com/chainx-org/ChainX.git
```

2. 切换到develop分支

```
cd ChainX
git checkout develop
```

3. 参考reborn-malan分支的[commit](https://github.com/chainx-org/ChainX/commit/a4a79b617b9c23c647722cc1d86a70c633c1eaca)自行添加malan测试网的配置

**注意**：authorities中的key可以通过ChainX/scripts/genesis/generate_keys.sh脚本生成，其中的key填公钥

#### 自定义fork的设置

1. 克隆fork-off-substrate仓库并下载依赖

```
git clone https://github.com/maxsam4/fork-off-substrate.git
cd fork-off-substrate
npm i
```

2. 修改index.js,适配ChainX网络

```javascript
使用// 取消替换System.Account
// let prefixes = ['0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9' /* System.Account */];
let prefixes = [];

// 跳过XStaking模块
// const skippedModulesPrefix = ['System', 'Session', 'Babe', 'Grandpa', 'GrandpaFinality', 'FinalityTracker'];
const skippedModulesPrefix = ['System', 'Session', 'Babe', 'Grandpa', 'GrandpaFinality', 'FinalityTracker', 'XStaking'];

// 修改成自定义的链配置
// execSync(binaryPath + ' build-spec --dev --raw > ' + forkedSpecPath);
execSync(binaryPath + ' build-spec --chain fork --raw > ' + forkedSpecPath);

// 修改成自定义的name,id和protocolId
forkedSpec.name = originalSpec.name + '-fork';
forkedSpec.id = originalSpec.id + '-fork';
forkedSpec.protocolId = originalSpec.protocolId + '-fork';
```

3. 新建data目录并加入必要的文件

`binary`:将编译好的chainx二进制程序重命名放入data目录

`schema.json`:使用chainx默认的types，可以从仓库发布中获取`wget https://github.com/chainx-org/fork-off-chainx/releases/download/v11/schema.json`

`runtime.wasm`:使用chainx的runtime文件,在`ChainX/target/release/wbuild/chainx-runtime`中，将`chainx_runtime.compact.wasm `文件重命名放入data目录

4. 获取Chainx主网的状态

同步ChainX主网节点在通过`npm start`命令进行同步或者使用ChainX主网的节点进行同步`HTTP_RPC_ENDPOINT=https://example.com npm start`

5. 启动Fork测试网

加入config.json文件启动测试网

config.json

```javascript
{
    "chain": "fork.json", // use fork.json to start fork-chain
    "validator": true,
    "name": "hacpy", // node name
    "base-path": "hacpy", // node db path
    "log-dir": "./log/hacpy", // node log path
    "ws-max-connections": 10000,
    "keystore-path": "./keystore",// validator keystore path
    "rpc-cors": "all",
    "execution": "NativeElseWasm",
    "rpc-port": 9086,
    "ws-port": 9087,
    "port": 20333,
    "log": "afg=debug,runtime=debug",
    "rpc-external": true,
    "ws-external": true,
    "rpc-methods": "Unsafe",
    "pruning": "archive",
    "bootnodes": [
    ]
}
```

启动测试网：

```sh
nohup ./binary --config=config.json >> chainx.log 2>&1 &
```

**注意**：如果无法出块，请确认keystore中的key与测试网配置中的key一致，确保keystore的路径正确
