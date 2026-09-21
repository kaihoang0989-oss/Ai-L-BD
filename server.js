const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const WORD_PAIRS = [
  // Đời thường
  ["Cà rốt", "Su hào"], ["Phở", "Bún bò"], ["Cà phê", "Trà sữa"],
  ["Biển", "Hồ"], ["Xe máy", "Xe đạp"], ["Mưa", "Tuyết"],
  ["Mèo", "Hổ"], ["Bóng đá", "Bóng rổ"], ["Táo", "Lê"],
  ["Điện thoại", "Máy tính bảng"], ["Kem", "Sữa chua"], ["Bánh mì", "Hamburger"],
  ["Núi", "Đồi"], ["Sân bay", "Ga tàu"], ["Cá mập", "Cá voi"],
  ["Áo phông", "Áo sơ mi"], ["Giày thể thao", "Giày da"], ["Phim", "Truyện"],
  ["Facebook", "Instagram"], ["YouTube", "TikTok"], ["Ô tô", "Taxi"],
  ["Mặt trời", "Mặt trăng"], ["Cầu", "Hầm"], ["Bút bi", "Bút chì"],
  ["Đồng hồ", "Điện thoại",], ["Bác sĩ", "Y tá"], ["Trường học", "Đại học"],
  ["Bếp", "Phòng ăn"], ["Pizza", "Mì Ý"], ["Nước cam", "Nước chanh"],
  ["Sô cô la", "Kẹo"], ["Cá", "Tôm"], ["Gà", "Vịt"],
  ["Sách", "Tạp chí"], ["Siêu thị", "Chợ"], ["Khách sạn", "Nhà nghỉ"],
  ["Thang máy", "Thang cuốn"], ["Công viên", "Vườn hoa"], ["Bàn", "Ghế"],
  ["Gương", "Cửa kính"], ["Chăn", "Gối"], ["Áo mưa", "Ô"],
  ["Mũ bảo hiểm", "Mũ len"], ["Bóng bay", "Diều"], ["Đàn guitar", "Đàn piano"],
  ["Hoa hồng", "Hoa tulip"], ["Mùa hè", "Mùa xuân"], ["Sinh nhật", "Đám cưới"],
  ["Bún chả", "Bánh cuốn"], ["Cơm tấm", "Xôi"], ["Trà đá", "Nước ngọt"],
  ["Gà rán", "Pizza"], ["Lẩu", "Nướng"], ["Kem vani", "Kem socola"],
  ["Dưa hấu", "Dứa"], ["Chuối", "Xoài"], ["Cầu lông", "Tennis"],
  ["Gym", "Yoga"], ["Chạy bộ", "Đi bộ"], ["Bơi", "Lặn"],
  ["Thư viện", "Nhà sách"], ["Rạp phim", "Nhà hát"], ["Concert", "Festival"],
  ["Hà Nội", "TP. Hồ Chí Minh"], ["Đà Nẵng", "Nha Trang"], ["Phố cổ", "Trung tâm thương mại"],

  // Mạng xã hội / internet / văn hoá pop
  ["Story", "Bài đăng"], ["Like", "Follow"], ["Comment", "Inbox"],
  ["Avatar", "Ảnh bìa"], ["Hashtag", "Trend"], ["Viral", "FOMO"],
  ["Meme", "Sticker"], ["Livestream", "Video"], ["Influencer", "KOL"],
  ["Fan", "Anti-fan"], ["Idol", "Bias"], ["Anime", "Manga"],
  ["K-pop", "V-pop"], ["Drama", "Reality show"], ["Netflix", "YouTube"],
  ["Game online", "Game offline"], ["Rank", "Casual"], ["Skin", "Emote"],
  ["Teamwork", "Solo"], ["Noob", "Pro"], ["AFK", "Lag"],

  // Tình yêu / hẹn hò / quan hệ
  ["Crush", "Người yêu"], ["Hẹn hò", "Tỏ tình"], ["Ghosting", "Seen"],
  ["Red flag", "Green flag"], ["Dating app", "Mai mối"], ["First date", "First kiss"],
  ["Chia tay", "Quay lại"], ["Yêu xa", "Yêu gần"], ["Bạn thân", "Người yêu"],
  ["Flirt", "Thả thính"], ["Chemistry", "Friendzone"], ["Couple", "Single"],
  ["Người cũ", "Người mới"], ["Tin nhắn", "Cuộc gọi"], ["Hẹn cà phê", "Hẹn đi ăn"],

  // LGBT+ / Pride — từ khoá vui, không dùng nội dung tình dục mô tả chi tiết
  ["Top", "Bot"], ["Top", "Bottom"], ["Dom", "Sub"], ["Masc", "Fem"],
  ["Gay", "Bi"], ["Les", "Bi"], ["Trans", "Non-binary"], ["Queer", "Ally"],
  ["Pride", "Rainbow"], ["Cầu vồng", "Cờ Pride"], ["Pride parade", "Pride party"],
  ["Coming out", "Closet"], ["Công khai", "Kín tiếng"], ["Pronouns", "Tên gọi"],
  ["He/Him", "She/Her"], ["They/Them", "He/They"], ["LGBTQ+", "Pride"],
  ["Drag", "K-pop"], ["Drag queen", "Drag king"], ["Masc gay", "Fem gay"],
  ["Soft boy", "Bad boy"], ["Twink", "Bear"], ["Otter", "Bear"],
  ["Gay bar", "Pride event"], ["Pride flag", "Progress flag"], ["Rainbow", "Glitter"],
  ["Ally", "Supporter"], ["Queer", "LGBTQ+"], ["Pride month", "Pride week"],
  ["Dating gay", "Dating bi"], ["Top energy", "Bottom energy"], ["Dominant", "Submissive"],

  // Meme / Gen Z / slang
  ["Flex", "Check-in"], ["Slay", "Serve"], ["Main character", "Side character"],
  ["Green flag", "Beige flag"], ["Red flag", "Ick"], ["Delulu", "Reality"],
  ["Lowkey", "Highkey"], ["Vibe", "Mood"], ["Chill", "Chaotic"],
  ["Cute", "Hot"], ["Cool", "Ngầu"], ["Thả tim", "Thả haha"],
  ["Bóc phốt", "Drama"], ["Hint", "Spoiler"], ["Plot twist", "Cliffhanger"],

  // Khó hơn / dễ gây tranh luận
  ["Sáng", "Tối"], ["Nóng", "Lạnh"], ["Nhanh", "Chậm"], ["Cao", "Thấp"],
  ["To", "Nhỏ"], ["Mềm", "Cứng"], ["Ngọt", "Mặn"], ["Đắng", "Chua"],
  ["Thật", "Giả"], ["Cũ", "Mới"], ["Trong", "Ngoài"], ["Trước", "Sau"],
  ["Chủ động", "Bị động"], ["Dẫn dắt", "Theo sau"], ["Bí mật", "Công khai"],
  ["Bạn", "Người lạ"], ["Online", "Offline"], ["Đi", "Ở lại"],
  ["Yên tĩnh", "Ồn ào"], ["Riêng tư", "Công cộng"]
];

const rooms = new Map();

function code() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}
function publicRoom(room) {
  return {
    code: room.code,
    hostId: room.hostId,
    phase: room.phase,
    round: room.round,
    maxPlayers: 6,
    players: [...room.players.values()].map(p => ({
      id: p.id, name: p.name, alive: p.alive,
      ready: p.ready, role: room.phase === "playing" && p.alive ? undefined : undefined
    })),
    turnIndex: room.turnIndex,
    currentSpeakerId: room.currentSpeakerId,
    descriptions: room.descriptions.map(x => ({
      playerId: x.playerId, playerName: x.playerName, text: x.text, round: x.round
    })),
    eliminated: room.eliminated,
    tieCandidates: room.tieCandidates || []
  };
}
function emitRoom(room) {
  io.to(room.code).emit("room:update", publicRoom(room));
}
function sendPrivateWords(room) {
  for (const p of room.players.values()) {
    io.to(p.id).emit("game:private", {
      role: p.role,
      word: p.word,
      round: room.round,
      isSpy: p.role === "spy"
    });
  }
}
function randomizeRoles(room) {
  const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
  const ids = [...room.players.keys()].sort(() => Math.random() - 0.5);
  const spies = new Set(ids.slice(0, 2));
  for (const p of room.players.values()) {
    p.alive = true;
    p.ready = false;
    p.role = spies.has(p.id) ? "spy" : "civilian";
    p.word = spies.has(p.id) ? pair[1] : pair[0];
  }
}
function alivePlayers(room) {
  return [...room.players.values()].filter(p => p.alive);
}
function startRound(room) {
  room.phase = "describing";
  room.turnIndex = 0;
  room.currentSpeakerId = alivePlayers(room)[0]?.id || null;
  room.descriptions = room.descriptions.filter(x => x.round !== room.round);
  room.votes = {};
  sendPrivateWords(room);
  emitRoom(room);
}
function checkWin(room) {
  const alive = alivePlayers(room);
  const spies = alive.filter(p => p.role === "spy").length;
  const civilians = alive.length - spies;
  if (spies === 0) {
    room.phase = "ended";
    room.winner = "civilian";
    return true;
  }
  if (spies >= civilians) {
    room.phase = "ended";
    room.winner = "spy";
    return true;
  }
  return false;
}
function nextSpeaker(room) {
  const alive = alivePlayers(room);
  room.turnIndex += 1;
  if (room.turnIndex >= alive.length) {
    room.phase = "voting";
    room.currentSpeakerId = null;
  } else {
    room.currentSpeakerId = alive[room.turnIndex].id;
  }
}
function revealResult(room, eliminatedId) {
  const target = room.players.get(eliminatedId);
  if (!target) return;
  target.alive = false;
  room.eliminated.push({
    name: target.name, role: target.role, word: target.word, round: room.round
  });
  if (checkWin(room)) return;
  room.round += 1;
  startRound(room);
}

io.on("connection", socket => {
  socket.on("room:create", ({name}, cb) => {
    const clean = String(name || "").trim().slice(0, 20);
    if (!clean) return cb({ok:false, error:"Nhập tên trước nhé."});
    let c = code();
    while (rooms.has(c)) c = code();
    const room = {
      code:c, hostId:socket.id, phase:"lobby", round:0, players:new Map(),
      turnIndex:0, currentSpeakerId:null, descriptions:[], votes:{}, eliminated:[],
      winner:null
    };
    room.players.set(socket.id, {id:socket.id,name:clean,alive:true,ready:false});
    rooms.set(c, room);
    socket.join(c);
    socket.data.roomCode = c;
    cb({ok:true, code:c, id:socket.id});
    emitRoom(room);
  });

  socket.on("room:join", ({code:roomCode,name}, cb) => {
    const clean = String(name || "").trim().slice(0, 20);
    const c = String(roomCode || "").trim().toUpperCase();
    const room = rooms.get(c);
    if (!room) return cb({ok:false,error:"Không tìm thấy phòng."});
    if (room.phase !== "lobby") return cb({ok:false,error:"Ván đã bắt đầu."});
    if (room.players.size >= 6) return cb({ok:false,error:"Phòng đã đủ 6 người."});
    if (!clean) return cb({ok:false,error:"Nhập tên trước nhé."});
    if ([...room.players.values()].some(p => p.name.toLowerCase() === clean.toLowerCase()))
      return cb({ok:false,error:"Tên này đã có trong phòng."});
    room.players.set(socket.id,{id:socket.id,name:clean,alive:true,ready:false});
    socket.join(c); socket.data.roomCode=c;
    cb({ok:true,code:c,id:socket.id}); emitRoom(room);
  });

  socket.on("player:ready", ({ready}) => {
    const room = rooms.get(socket.data.roomCode); if (!room) return;
    const p = room.players.get(socket.id); if (!p) return;
    p.ready = !!ready; emitRoom(room);
  });

  socket.on("game:start", (_, cb) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    if (socket.id !== room.hostId) return cb?.({ok:false,error:"Chỉ chủ phòng mới bắt đầu."});
    if (room.players.size !== 6) return cb?.({ok:false,error:"Cần đủ đúng 6 người."});
    randomizeRoles(room); room.round = 1; room.winner=null;
    room.eliminated=[]; room.descriptions=[]; startRound(room);
    cb?.({ok:true});
  });

  socket.on("game:describe", ({text}, cb) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.phase !== "describing") return cb?.({ok:false,error:"Chưa đến lượt mô tả."});
    if (socket.id !== room.currentSpeakerId) return cb?.({ok:false,error:"Chưa đến lượt bạn."});
    const p = room.players.get(socket.id);
    const clean = String(text || "").trim().slice(0,120);
    if (!clean) return cb?.({ok:false,error:"Hãy nhập một câu mô tả."});
    if (clean.toLowerCase().includes(p.word.toLowerCase()))
      return cb?.({ok:false,error:"Không được nói trực tiếp từ khóa của bạn."});
    room.descriptions.push({playerId:p.id,playerName:p.name,text:clean,round:room.round});
    nextSpeaker(room); emitRoom(room); cb?.({ok:true});
  });

  socket.on("game:vote", ({targetId}, cb) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.phase !== "voting") return cb?.({ok:false,error:"Chưa đến lúc bỏ phiếu."});
    const voter = room.players.get(socket.id);
    const target = room.players.get(targetId);
    if (!voter || !target || !voter.alive || !target.alive || voter.id===target.id)
      return cb?.({ok:false,error:"Lá phiếu không hợp lệ."});
    room.votes[socket.id] = targetId;
    const alive = alivePlayers(room);
    if (alive.every(p => room.votes[p.id])) {
      const counts = {};
      alive.forEach(p => counts[p.id]=0);
      Object.values(room.votes).forEach(id => counts[id]=(counts[id]||0)+1);
      const max = Math.max(...Object.values(counts));
      const leaders = Object.keys(counts).filter(id => counts[id]===max);
      if (leaders.length > 1) {
        room.phase = "tie";
        room.tieCandidates = leaders;
        emitRoom(room);
      } else {
        revealResult(room, leaders[0]); emitRoom(room);
      }
    } else emitRoom(room);
    cb?.({ok:true});
  });

  socket.on("game:tieVote", ({targetId}, cb) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.phase !== "tie") return cb?.({ok:false,error:"Không có vòng đấu lại."});
    if (!room.tieCandidates.includes(targetId)) return cb?.({ok:false,error:"Chỉ được chọn người hòa phiếu."});
    room.tieVotes = room.tieVotes || {};
    room.tieVotes[socket.id] = targetId;
    const alive = alivePlayers(room);
    if (alive.every(p => room.tieVotes[p.id])) {
      const counts={}; room.tieCandidates.forEach(id=>counts[id]=0);
      Object.values(room.tieVotes).forEach(id=>counts[id]++);
      const max=Math.max(...Object.values(counts));
      const leaders=Object.keys(counts).filter(id=>counts[id]===max);
      if (leaders.length>1) {
        // Hòa tiếp: không ai bị loại, sang vòng mới.
        room.round += 1; room.tieVotes={}; room.votes={}; startRound(room);
      } else {
        room.tieVotes={}; revealResult(room,leaders[0]);
      }
    }
    emitRoom(room); cb?.({ok:true});
  });

  socket.on("game:new", (_, cb) => {
    const room=rooms.get(socket.data.roomCode); if(!room) return;
    if(socket.id!==room.hostId) return cb?.({ok:false,error:"Chỉ chủ phòng mới có thể tạo ván mới."});
    for(const p of room.players.values()){p.alive=true;p.role=undefined;p.word=undefined;}
    room.phase="lobby"; room.round=0; room.winner=null; room.eliminated=[]; room.descriptions=[]; room.votes={};
    emitRoom(room); cb?.({ok:true});
  });

  socket.on("disconnect", () => {
    const c=socket.data.roomCode; const room=rooms.get(c); if(!room) return;
    room.players.delete(socket.id);
    if(room.players.size===0){rooms.delete(c);return;}
    if(room.hostId===socket.id) room.hostId=room.players.keys().next().value;
    if(room.phase!=="lobby" && room.phase!=="ended"){
      // Nếu đang chơi mà người chơi rời, kết thúc để tránh trạng thái kẹt.
      room.phase="ended"; room.winner="civilian";
    }
    emitRoom(room);
  });
});

server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
