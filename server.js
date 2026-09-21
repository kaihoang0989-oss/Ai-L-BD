const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 10000;

app.use(express.static("public"));

const rooms = new Map();
const ZONES = {
  mall: { name:"Trung tâm thương mại", type:"city" },
  bar: { name:"GC Bar", type:"city" },
  sauna: { name:"Sauna P8", type:"sauna" },
  lake: { name:"Hồ Ha Le", type:"city" },
  bd: { name:"Ổ Bê Đê Hà Nội", type:"city" }
};
const SAUNA_ROOMS = {
  lobby:{name:"Sảnh P8", icon:"✨"},
  steam:{name:"Xông hơi nước", icon:"♨️"},
  dry:{name:"Xông khô", icon:"🔥"},
  dark:{name:"Phòng tối", icon:"🌙"},
  soak:{name:"Bồn ngâm chung", icon:"🛁"},
  bubble:{name:"Phòng sục", icon:"🫧"},
  lounge:{name:"Lounge khăn", icon:"🛋️"},
  dudn:{name:"Phòng Đờ U Đu Nặng Đụ", icon:"🎭"}
};

function code() { return crypto.randomBytes(3).toString("hex").toUpperCase(); }
function cleanName(s){ return String(s||"").trim().slice(0,18) || "Khách"; }
function cleanText(s){ return String(s||"").trim().slice(0,120); }

function publicPlayers(room){
  return [...room.players.values()].map(p=>({
    id:p.id, name:p.name, zone:p.zone, room:p.room,
    hair:p.hair, shirt:p.shirt, body:p.body, x:p.x, y:p.y
  }));
}
function state(room){
  return { code:room.code, zone:room.zone, room:room.room, players:publicPlayers(room) };
}
function emitRoom(room){
  io.to(room.code).emit("world:state", state(room));
}
function getRoom(socket){
  const code = socket.data.code;
  return code ? rooms.get(code) : null;
}

io.on("connection", socket=>{
  socket.on("login", data=>{
    const name=cleanName(data?.name);
    const p={
      id:socket.id,name,
      zone:"mall",room:"lobby",
      hair:data?.hair||"black",shirt:data?.shirt||"cyan",body:data?.body||"m",
      x:50+Math.random()*80,y:55+Math.random()*55
    };
    let room;
    const requested=String(data?.code||"").trim().toUpperCase();
    if(requested && rooms.has(requested)) room=rooms.get(requested);
    else {
      const c=code();
      room={code:c,players:new Map()};
      rooms.set(c,room);
    }
    room.players.set(socket.id,p);
    socket.join(room.code); socket.data.code=room.code;
    socket.emit("login:ok",{code:room.code, player:p, zones:ZONES, saunaRooms:SAUNA_ROOMS});
    emitRoom(room);
    io.to(room.code).emit("system",`${name} đã bước vào thành phố P8 ✨`);
  });

  socket.on("move", pos=>{
    const room=getRoom(socket), p=room?.players.get(socket.id);
    if(!p) return;
    p.x=Math.max(4,Math.min(96,Number(pos?.x)||p.x));
    p.y=Math.max(4,Math.min(92,Number(pos?.y)||p.y));
    emitRoom(room);
  });

  socket.on("enter:zone", zone=>{
    const room=getRoom(socket), p=room?.players.get(socket.id);
    if(!p || !ZONES[zone]) return;
    p.zone=zone; p.room=zone==="sauna"?"lobby":"main";
    p.x=50; p.y=62;
    emitRoom(room);
    io.to(room.code).emit("system",`${p.name} đi tới ${ZONES[zone].name}.`);
  });

  socket.on("enter:saunaRoom", r=>{
    const room=getRoom(socket), p=room?.players.get(socket.id);
    if(!p || p.zone!=="sauna" || !SAUNA_ROOMS[r]) return;
    p.room=r; p.x=50; p.y=62;
    emitRoom(room);
    io.to(room.code).emit("system",`${p.name} vào ${SAUNA_ROOMS[r].name} ${SAUNA_ROOMS[r].icon}`);
  });

  socket.on("chat", msg=>{
    const room=getRoom(socket), p=room?.players.get(socket.id);
    if(!p) return;
    const text=cleanText(msg);
    if(!text) return;
    io.to(room.code).emit("chat",{id:p.id,name:p.name,text,x:p.x,y:p.y});
  });

  socket.on("emote", kind=>{
    const room=getRoom(socket), p=room?.players.get(socket.id);
    if(!p) return;
    const allowed={wave:"👋",heart:"💖",laugh:"😂",hug:"🤗",dance:"🕺",splash:"💦",sit:"🪑",lie:"🛏️"};
    if(!allowed[kind]) return;
    io.to(room.code).emit("emote",{id:p.id,name:p.name,kind,icon:allowed[kind]});
  });

  socket.on("interact", data=>{
    const room=getRoom(socket), p=room?.players.get(socket.id);
    if(!p) return;
    const target=room.players.get(data?.targetId);
    if(!target || target.id===p.id) return;
    const allowed={hug:"🤗",highfive:"🙌",splash:"💦"};
    if(!allowed[data?.kind]) return;
    io.to(room.code).emit("interaction",{from:p.name,to:target.name,kind:data.kind,icon:allowed[data.kind]});
  });

  socket.on("disconnect",()=>{
    const room=getRoom(socket);
    if(!room) return;
    const p=room.players.get(socket.id);
    room.players.delete(socket.id);
    if(room.players.size===0) rooms.delete(room.code);
    else {
      io.to(room.code).emit("system",`${p?.name||"Một người chơi"} đã rời thành phố.`);
      emitRoom(room);
    }
  });
});

server.listen(PORT,"0.0.0.0",()=>console.log(`Sauna P8 running on ${PORT}`));
