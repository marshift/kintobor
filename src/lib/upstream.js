// fairly complex UDP socket logic, gets server info from an SRB2 server

import { createSocket } from "node:dgram";

export const stripBadChars = (str) => str.replace(/\0|\n/g, ""); // TODO: This function probably shouldn't live here
const parseVersion = (major, minor) => [Math.floor(major / 100), major % 100, minor].join(".");

function checksum(buf) {
    let c = 0x1234567;

    for (let i = 4; i < buf.byteLength; i++) {
        c = (c + buf.readUint8(i) * (i - 3)) % 4294967295;
    }

    return c;
}

export const getServerInfo = (ip, port) => new Promise((resolve, reject) => {
    const udp = createSocket("udp4");

    const PT_ASKINFO = 12;
    const PT_SERVERINFO = 13;

    const buf = Buffer.alloc(10);
    buf.writeUint8(PT_ASKINFO, 6);
    buf.writeUint32LE(checksum(buf), 0);

    udp.send(buf, port, ip);
    udp.on("message", (msg) => {
        const type = msg.readUint8(6);
        if (type == PT_SERVERINFO) {
            const res = {};
            res.packet_version = msg.readUint8(9);
            res.application = stripBadChars(msg.subarray(10, 26).toString("utf8"));
            res.version = parseVersion(msg.readUint8(26), msg.readUint8(27));
            res.players = msg.readUint8(28);
            res.max_players = msg.readUint8(29);
            res.refuse_reason = msg.readUint8(30);
            res.game_type_name = stripBadChars(msg.subarray(31, 55).toString("utf8"));
            res.modified_game = msg.readUint8(55) == 1;
            res.cheats_enabled = msg.readUint8(56) == 1;
            res.flags = msg.readUint8(56);
            res.file_needed_num = msg.readUint8(57);
            res.time = msg.readUint32LE(58);
            res.level_time = msg.readUint32LE(61);
            res.server_name = stripBadChars(msg.subarray(67, 99).toString("utf8"));
            res.map_name = stripBadChars(msg.subarray(97, 105).toString("utf8"));
            res.map_title = stripBadChars(msg.subarray(105, 138).toString("utf8"));
            res.map_md5 = msg.subarray(138, 154);
            res.act_num = msg.readUint8(154);
            res.is_zone = msg.readUint8(155) == 1;
            udp.close();
            resolve(res);
        }
    });

    udp.on("error", (err) => {
        udp.close();
        reject(err);
    });
});
