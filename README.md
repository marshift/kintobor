# kintobor
master server register-er for [sonic robo blast 2](//srb2.org)

## what is this for?
i wanted to run my SRB2 server behind [a proxy](//github.com/fatedier/frp) - but found that listing on the master server did not work.
this tool is the answer to that problem.

## how to use?
run your SRB2 server on the target machine, and setup the UDP proxy (using `frp`, this means configuring and running `frpc`)
then, on the machine running the proxy server (such as a VPS):
* install `node` (and `npm`)
* `npm i -g kintobor`
    - or `pnpm`, or `yarn`
* create the config file (an example can be seen below)
* `kintobor`
    - by default, the program looks for a file named `kintobor.json` in the current working directory
    - you can pass `-c` or `--config` to specify the config file to use, e.g. `kintobor -c="./my_config.json"`
* profit

## example config
* port - the port the SRB2 server is proxied to / running on
* roomId - master server room ID, 33 for standard, 28 for casual, 38 for custom gametypes
```json
{
    "port": 5026,
    "roomId": 33
}
```
