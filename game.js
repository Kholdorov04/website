'use strict';
// ============================================================
//  SHADOW ARISE — Solo Leveling Fan Game
//  Full game engine: battle, leveling, skills, dungeons
// ============================================================

// ── DATA ────────────────────────────────────────────────────

const RANKS = ['E','D','C','B','A','S','National'];
const RANK_COLORS = { E:'#aaaaaa', D:'#22c55e', C:'#3b82f6', B:'#a855f7', A:'#f59e0b', S:'#ef4444', National:'#ff6b00' };
const RANK_REQ = [0, 10, 25, 50, 100, 200, 400]; // levels required

const SKILLS_DATA = [
  { id:'slash',    name:'Murderous Intent',  icon:'⚔️',  rank:'E', mpCost:5,  cooldown:0, dmgMult:1.5, type:'attack', desc:'A swift slash fueled by killing intent.', unlockLv:1  },
  { id:'dash',     name:'Dash Strike',       icon:'💨',  rank:'E', mpCost:8,  cooldown:2, dmgMult:2.0, type:'attack', desc:'Blur forward and strike before enemy reacts.', unlockLv:3  },
  { id:'arise',    name:'Shadow Arise',      icon:'🌑',  rank:'D', mpCost:15, cooldown:4, dmgMult:3.0, type:'attack', desc:'Call upon the shadows. Devastates a single foe.', unlockLv:8  },
  { id:'regen',    name:'Shadow Heal',       icon:'🌿',  rank:'D', mpCost:12, cooldown:5, dmgMult:0,   type:'heal',   desc:'Drain enemy vitality to restore your own HP.', healPct:0.3, unlockLv:12 },
  { id:'barrage',  name:'Ruler\'s Barrage',  icon:'💫',  rank:'C', mpCost:20, cooldown:3, dmgMult:2.5, type:'attack', desc:'A rapid flurry of 5 consecutive strikes.', hits:5, unlockLv:20 },
  { id:'domain',   name:'Monarch\'s Domain', icon:'👑',  rank:'B', mpCost:30, cooldown:6, dmgMult:5.0, type:'attack', desc:'The full power of the Shadow Monarch unleashed.', unlockLv:35 },
  { id:'igris',    name:'Summon: Igris',     icon:'🐴',  rank:'A', mpCost:25, cooldown:5, dmgMult:4.0, type:'attack', desc:'Summon the Knight Commander to strike for you.', unlockLv:50 },
  { id:'arise2',   name:'ARISE — True Form', icon:'☠️',  rank:'S', mpCost:50, cooldown:8, dmgMult:8.0, type:'attack', desc:'THE WEAKEST HUNTER AWAKENS. Maximum devastation.', unlockLv:75 },
];

const DUNGEONS = [
  { id:'d1', rank:'E', name:'Goblin Cave',        icon:'🕳️', minLv:1,  enemies:['Goblin','Orc Scout','Goblin Shaman'],         waves:3,  goldMin:20,  goldMax:50,  expMult:1.0, desc:'A basic E-rank gate. Perfect for beginners.' },
  { id:'d2', rank:'E', name:'Ant Nest',           icon:'🐜', minLv:3,  enemies:['Giant Ant','Ant Soldier','Ant Queen'],         waves:3,  goldMin:40,  goldMax:80,  expMult:1.2, desc:'Swarming ant monsters. Watch your flanks.' },
  { id:'d3', rank:'D', name:'Demon\'s Castle',    icon:'🏰', minLv:8,  enemies:['Demon Soldier','Dark Knight','Demon General'], waves:4,  goldMin:80,  goldMax:150, expMult:1.5, desc:'A D-rank dungeon crawling with demons.' },
  { id:'d4', rank:'D', name:'Ice Dungeon',        icon:'❄️', minLv:12, enemies:['Ice Wolf','Frost Giant','Ice Monarch Shard'],  waves:4,  goldMin:120, goldMax:200, expMult:1.7, desc:'Extreme cold. Ice-type enemies resist magic.' },
  { id:'d5', rank:'C', name:'Dragon Lair',        icon:'🐉', minLv:20, enemies:['Drake','Wyvern','Young Dragon'],              waves:5,  goldMin:200, goldMax:350, expMult:2.0, desc:'Dragons nest here. High risk, high reward.' },
  { id:'d6', rank:'C', name:'Architect\'s Ruins', icon:'⚙️', minLv:25, enemies:['Iron Golem','Rune Knight','Architect Clone'], waves:5,  goldMin:280, goldMax:450, expMult:2.2, desc:'Ancient ruins filled with mechanical traps.' },
  { id:'d7', rank:'B', name:'Chaos Gate',         icon:'🌀', minLv:35, enemies:['Chaos Knight','Void Reaper','Shadow Lurker'], waves:6,  goldMin:400, goldMax:600, expMult:2.8, desc:'A gate leaking raw chaos energy. Highly volatile.' },
  { id:'d8', rank:'A', name:'Giant\'s Throne',    icon:'🏔️', minLv:50, enemies:['Giant Warrior','Storm Giant','Thunder King'], waves:6,  goldMin:600, goldMax:900, expMult:3.5, desc:'A-rank. Only elite hunters dare enter.' },
  { id:'d9', rank:'S', name:'Monarch\'s Domain',  icon:'👑', minLv:75, enemies:['Shadow Beast','Fragment of Monarch','Antares'],waves:7, goldMin:1000,goldMax:1500,expMult:5.0, desc:'The ultimate challenge. The Monarch awaits.' },
];

const ENEMY_TEMPLATES = {
  'Goblin':           { hp:30,  atk:5,  def:2,  exp:15, gold:8,  icon:'👹', rank:'E' },
  'Orc Scout':        { hp:50,  atk:8,  def:3,  exp:22, gold:12, icon:'🐗', rank:'E' },
  'Goblin Shaman':    { hp:40,  atk:12, def:2,  exp:28, gold:15, icon:'🧙', rank:'E', special:'magic' },
  'Giant Ant':        { hp:60,  atk:10, def:4,  exp:30, gold:18, icon:'🐜', rank:'E' },
  'Ant Soldier':      { hp:80,  atk:13, def:6,  exp:38, gold:22, icon:'🐝', rank:'E' },
  'Ant Queen':        { hp:180, atk:18, def:8,  exp:80, gold:60, icon:'👑', rank:'D', isBoss:true },
  'Demon Soldier':    { hp:120, atk:20, def:10, exp:60, gold:40, icon:'😈', rank:'D' },
  'Dark Knight':      { hp:160, atk:25, def:15, exp:80, gold:55, icon:'🛡️', rank:'D' },
  'Demon General':    { hp:350, atk:35, def:18, exp:180,gold:120,icon:'👿', rank:'D', isBoss:true },
  'Ice Wolf':         { hp:140, atk:22, def:12, exp:75, gold:48, icon:'🐺', rank:'D' },
  'Frost Giant':      { hp:200, atk:30, def:20, exp:100,gold:70, icon:'🧊', rank:'C' },
  'Ice Monarch Shard':{ hp:500, atk:45, def:25, exp:280,gold:200,icon:'❄️', rank:'C', isBoss:true },
  'Drake':            { hp:250, atk:40, def:22, exp:130,gold:90, icon:'🦎', rank:'C' },
  'Wyvern':           { hp:300, atk:48, def:28, exp:160,gold:110,icon:'🐲', rank:'C' },
  'Young Dragon':     { hp:700, atk:60, def:35, exp:400,gold:300,icon:'🐉', rank:'C', isBoss:true },
  'Iron Golem':       { hp:400, atk:50, def:40, exp:200,gold:140,icon:'🤖', rank:'C' },
  'Rune Knight':      { hp:350, atk:55, def:30, exp:190,gold:130,icon:'⚔️', rank:'C' },
  'Architect Clone':  { hp:900, atk:70, def:45, exp:500,gold:400,icon:'⚙️', rank:'C', isBoss:true },
  'Chaos Knight':     { hp:600, atk:80, def:50, exp:350,gold:250,icon:'🌀', rank:'B' },
  'Void Reaper':      { hp:550, atk:85, def:45, exp:360,gold:260,icon:'💀', rank:'B' },
  'Shadow Lurker':    { hp:1200,atk:100,def:60, exp:700,gold:500,icon:'🌑', rank:'B', isBoss:true },
  'Giant Warrior':    { hp:900, atk:110,def:65, exp:500,gold:360,icon:'🏔️', rank:'A' },
  'Storm Giant':      { hp:1000,atk:120,def:70, exp:550,gold:400,icon:'⛈️', rank:'A' },
  'Thunder King':     { hp:2500,atk:150,def:90, exp:1500,gold:1000,icon:'⚡', rank:'A', isBoss:true },
  'Shadow Beast':     { hp:1800,atk:160,def:100,exp:1000,gold:700,icon:'🐾', rank:'S' },
  'Fragment of Monarch':{ hp:2000,atk:180,def:110,exp:1200,gold:850,icon:'👁️', rank:'S' },
  'Antares':          { hp:5000,atk:250,def:150,exp:5000,gold:3000,icon:'☠️', rank:'S', isBoss:true },
};

const ITEMS = [
  { id:'hp_pot_s', name:'HP Potion S', icon:'🧪', type:'potion', value:50,  color:'#ef4444' },
  { id:'hp_pot_m', name:'HP Potion M', icon:'🫙', type:'potion', value:150, color:'#f87171' },
  { id:'mp_pot',   name:'MP Potion',   icon:'💜', type:'mpotion',value:30,  color:'#8b5cf6' },
  { id:'elixir',   name:'Elixir',      icon:'✨', type:'potion', value:999, color:'#fbbf24' },
  { id:'dagger',   name:'Shadow Dagger',icon:'🗡️',type:'weapon', atkBonus:15,color:'#6366f1' },
  { id:'armor',    name:'Dark Armor',   icon:'🛡️',type:'armor',  defBonus:10,color:'#6366f1' },
  { id:'ring',     name:'Monarch\'s Ring',icon:'💍',type:'acc',  critBonus:5,color:'#fbbf24' },
  { id:'boots',    name:'Shadow Boots', icon:'👟', type:'acc',  agiBonus:8, color:'#00d4ff' },
];


// ── GAME STATE ───────────────────────────────────────────────

const State = {
  player: {
    name: 'Sung Jin-Woo',
    level: 1,
    rank: 'E',
    exp: 0,
    expToNext: 100,
    hp: 100, maxHp: 100,
    mp: 50,  maxMp: 50,
    gold: 0,
    str: 10, agi: 8, int: 5, vit: 10, sense: 7,
    statPoints: 0,
    kills: 0,
    dungeonsClear: 0,
    inventory: [
      { ...ITEMS[0], qty: 3 },
    ],
    equip: { weapon: null, armor: null, acc: null },
    learnedSkills: ['slash'],
    skillCooldowns: {},
    titles: ['The Weakest Hunter'],
  },
  battle: {
    active: false,
    dungeon: null,
    wave: 0,
    totalWaves: 0,
    enemy: null,
    enemyHp: 0,
    enemyMaxHp: 0,
    selectedSkill: null,
    isPlayerTurn: true,
    busy: false,
  },
};

// ── DERIVED STATS ────────────────────────────────────────────

function getDerived() {
  const p = State.player;
  const weaponAtk = p.equip.weapon ? (ITEMS.find(i=>i.id===p.equip.weapon)?.atkBonus||0) : 0;
  const armorDef  = p.equip.armor  ? (ITEMS.find(i=>i.id===p.equip.armor )?.defBonus||0) : 0;
  const ringCrit  = p.equip.acc    ? (ITEMS.find(i=>i.id===p.equip.acc   )?.critBonus||0): 0;
  const bootAgi   = p.equip.acc2   ? (ITEMS.find(i=>i.id===p.equip.acc2  )?.agiBonus||0) : 0;
  return {
    atk:   Math.floor(p.str * 1.2 + p.level * 0.8 + weaponAtk),
    def:   Math.floor(p.vit * 0.5 + p.level * 0.3 + armorDef),
    crit:  Math.min(50, Math.floor(p.sense * 0.8 + p.agi * 0.3 + ringCrit)),
    speed: Math.floor(p.agi * 1.1 + bootAgi),
    mAtk:  Math.floor(p.int * 1.5 + p.level * 0.5),
  };
}

function getEnemyScaled(template, dungeon) {
  const lv = State.player.level;
  const scale = 0.8 + lv * 0.12;
  return {
    ...template,
    hp:   Math.floor(template.hp  * scale),
    atk:  Math.floor(template.atk * scale),
    def:  Math.floor(template.def * scale),
    exp:  Math.floor(template.exp * dungeon.expMult),
    gold: Math.floor(template.gold * (0.8 + Math.random() * 0.4)),
  };
}

// ── LEVELING ─────────────────────────────────────────────────

function expToNextLevel(lv) {
  return Math.floor(100 * Math.pow(1.18, lv - 1));
}

function gainExp(amount) {
  const p = State.player;
  p.exp += amount;
  let leveled = false;
  while (p.exp >= p.expToNext) {
    p.exp -= p.expToNext;
    p.level++;
    p.expToNext = expToNextLevel(p.level);
    p.statPoints += 5;
    p.maxHp = Math.floor(100 + p.vit * 8 + p.level * 10);
    p.maxMp = Math.floor(50  + p.int * 5 + p.level * 5);
    p.hp = p.maxHp;
    p.mp = p.maxMp;
    leveled = true;
    checkRankUp();
    checkSkillUnlock();
    log(`✨ LEVEL UP! Now Level ${p.level}!`, 'levelup');
  }
  return leveled;
}

function checkRankUp() {
  const p = State.player;
  for (let i = RANK_REQ.length - 1; i >= 0; i--) {
    if (p.level >= RANK_REQ[i]) {
      const newRank = RANKS[i];
      if (newRank !== p.rank) {
        p.rank = newRank;
        showSystemPopup(
          `<strong>RANK UP!</strong><br><br>` +
          `You have been promoted to<br>` +
          `<span style="color:${RANK_COLORS[newRank]};font-size:1.4rem;font-family:var(--font-game);">${newRank}-RANK</span><br><br>` +
          `New dungeons are now available.`
        );
        notify(`🏆 Rank Up! → ${newRank}-Rank`, RANK_COLORS[newRank]);
      }
      break;
    }
  }
}

function checkSkillUnlock() {
  const p = State.player;
  SKILLS_DATA.forEach(sk => {
    if (p.level >= sk.unlockLv && !p.learnedSkills.includes(sk.id)) {
      p.learnedSkills.push(sk.id);
      showSystemPopup(
        `<strong>NEW SKILL ACQUIRED</strong><br><br>` +
        `${sk.icon} <span style="color:#a855f7">${sk.name}</span><br><br>` +
        `<span style="font-size:0.85rem">${sk.desc}</span><br><br>` +
        `<span style="color:#6668aa;font-size:0.8rem">MP Cost: ${sk.mpCost} · Rank: ${sk.rank}</span>`
      );
      notify(`🔮 Skill Unlocked: ${sk.name}!`, '#a855f7');
    }
  });
}


// ── BATTLE SYSTEM ────────────────────────────────────────────

function startDungeon(dungeonId) {
  const dungeon = DUNGEONS.find(d => d.id === dungeonId);
  if (!dungeon) return;
  State.battle.dungeon = dungeon;
  State.battle.wave = 0;
  State.battle.totalWaves = dungeon.waves;
  State.battle.active = true;
  log(`⬡ Entered: ${dungeon.name} [${dungeon.rank}-Rank]`, 'system');
  showView('battle');
  nextWave();
}

function nextWave() {
  const b = State.battle;
  const dungeon = b.dungeon;
  b.wave++;

  // Pick enemy (last wave = boss if exists)
  const isBossWave = b.wave === b.totalWaves;
  const pool = dungeon.enemies.filter(e => {
    const t = ENEMY_TEMPLATES[e];
    return isBossWave ? t?.isBoss : !t?.isBoss;
  });
  const fallback = dungeon.enemies;
  const chosen = (pool.length ? pool : fallback)[Math.floor(Math.random() * (pool.length || fallback.length))];
  const template = ENEMY_TEMPLATES[chosen];
  const scaled = getEnemyScaled(template, dungeon);

  b.enemy = { name: chosen, ...scaled };
  b.enemyHp = scaled.hp;
  b.enemyMaxHp = scaled.hp;
  b.isPlayerTurn = true;
  b.busy = false;

  updateEnemyUI();
  setBattleLog(`Wave ${b.wave}/${b.totalWaves}: <strong>${chosen}</strong> appears!`);
  log(`Wave ${b.wave}/${b.totalWaves}: ${template.icon} ${chosen} (${template.rank}-rank)`, 'system');
  setActionsEnabled(true);
  tickCooldowns();
}

async function playerAttack(skillId = null) {
  const b = State.battle;
  if (b.busy || !b.active || !b.isPlayerTurn) return;
  b.busy = true;
  setActionsEnabled(false);

  const p = State.player;
  const d = getDerived();
  let dmg = 0;
  let logMsg = '';
  let isCrit = Math.random() * 100 < d.crit;

  if (skillId) {
    const skill = SKILLS_DATA.find(s => s.id === skillId);
    if (!skill || p.mp < skill.mpCost || (b.skillCooldowns?.[skillId] > 0)) {
      b.busy = false; setActionsEnabled(true); return;
    }
    p.mp -= skill.mpCost;
    if (State.battle.skillCooldowns === undefined) State.battle.skillCooldowns = {};
    State.battle.skillCooldowns[skillId] = skill.cooldown;

    if (skill.type === 'heal') {
      const healAmt = Math.floor(p.maxHp * skill.healPct);
      p.hp = Math.min(p.maxHp, p.hp + healAmt);
      showHeal(healAmt);
      log(`${skill.icon} ${skill.name}: Restored ${healAmt} HP`, 'heal');
      setBattleLog(`${skill.icon} ${skill.name} — Restored ${healAmt} HP!`);
      updateHUD();
      await wait(600);
      b.busy = false;
      enemyTurn();
      return;
    }

    if (skill.hits && skill.hits > 1) {
      // Multi-hit
      for (let i = 0; i < skill.hits; i++) {
        const hitDmg = calcDmg(d.atk, skill.dmgMult / skill.hits, b.enemy.def, isCrit && i === 0);
        applyDmgToEnemy(hitDmg);
        showDamage(hitDmg, isCrit && i === 0);
        await wait(120);
        if (b.enemyHp <= 0) break;
      }
      dmg = -1; // already applied
      logMsg = `${skill.icon} ${skill.name} — ${skill.hits}-hit combo!`;
    } else {
      dmg = calcDmg(d.atk, skill.dmgMult, b.enemy.def, isCrit);
      logMsg = `${skill.icon} ${skill.name}${isCrit ? ' [CRITICAL!]' : ''} — ${dmg} dmg`;
    }
    log(logMsg, 'skill');
    setBattleLog(logMsg);
  } else {
    // Basic attack
    dmg = calcDmg(d.atk, 1.0, b.enemy.def, isCrit);
    logMsg = `⚔️ Attack${isCrit ? ' [CRIT!]' : ''} — ${dmg} damage`;
    log(logMsg, 'attack');
    setBattleLog(logMsg);
  }

  // Animate player
  document.getElementById('player-sprite').classList.add('attack-anim');
  setTimeout(() => document.getElementById('player-sprite').classList.remove('attack-anim'), 400);

  if (dmg > 0) {
    await wait(200);
    applyDmgToEnemy(dmg);
    showDamage(dmg, isCrit);
  }

  updateHUD();
  await wait(500);

  if (b.enemyHp <= 0) {
    enemyDefeated();
  } else {
    b.busy = false;
    enemyTurn();
  }
}

function calcDmg(atk, mult, def, isCrit) {
  const base = Math.max(1, atk * mult - def * 0.5);
  const variance = 0.85 + Math.random() * 0.3;
  const critMult = isCrit ? 1.8 : 1.0;
  return Math.floor(base * variance * critMult);
}

function applyDmgToEnemy(dmg) {
  State.battle.enemyHp = Math.max(0, State.battle.enemyHp - dmg);
  updateEnemyHP();
  document.getElementById('enemy-sprite').classList.add('shake');
  setTimeout(() => document.getElementById('enemy-sprite').classList.remove('shake'), 400);
}

async function enemyTurn() {
  const b = State.battle;
  const p = State.player;
  if (!b.active || b.enemyHp <= 0) return;

  await wait(700);

  const d = getDerived();
  const enemy = b.enemy;
  const rawDmg = Math.max(1, enemy.atk - d.def * 0.6);
  const variance = 0.85 + Math.random() * 0.3;
  const dmg = Math.floor(rawDmg * variance);

  p.hp = Math.max(0, p.hp - dmg);
  const msg = `💢 ${enemy.name} attacks — ${dmg} damage!`;
  log(msg, 'enemy');
  setBattleLog(msg);
  updateHUD();

  // Flash screen red
  document.body.style.boxShadow = 'inset 0 0 60px rgba(239,68,68,0.3)';
  setTimeout(() => document.body.style.boxShadow = '', 400);

  if (p.hp <= 0) {
    playerDefeated();
  } else {
    b.isPlayerTurn = true;
    b.busy = false;
    setActionsEnabled(true);
  }
}

function enemyDefeated() {
  const b = State.battle;
  const p = State.player;
  const enemy = b.enemy;
  b.active = false;
  p.kills++;

  const goldEarned = enemy.gold;
  p.gold += goldEarned;
  const leveled = gainExp(enemy.exp);

  log(`💀 ${enemy.name} defeated! +${enemy.exp} EXP, +${goldEarned} Gold`, 'exp');
  updateHUD();
  tickCooldowns();

  const isLastWave = b.wave >= b.totalWaves;

  if (isLastWave) {
    p.dungeonsClear++;
    const bonusGold = Math.floor(b.dungeon.goldMin + Math.random() * (b.dungeon.goldMax - b.dungeon.goldMin));
    p.gold += bonusGold;
    // Chance for item drop
    const dropChance = 0.4;
    let droppedItem = null;
    if (Math.random() < dropChance) {
      const dropPool = ITEMS.filter(i => i.type !== 'potion' || true);
      droppedItem = dropPool[Math.floor(Math.random() * dropPool.length)];
      addToInventory(droppedItem);
    }
    showVictory(enemy, enemy.exp, goldEarned + bonusGold, leveled, droppedItem);
  } else {
    showVictory(enemy, enemy.exp, goldEarned, leveled, null, false);
  }
}

function playerDefeated() {
  State.battle.active = false;
  setActionsEnabled(false);
  const penaltyGold = Math.floor(State.player.gold * 0.1);
  State.player.gold = Math.max(0, State.player.gold - penaltyGold);
  log('☠️ You were defeated...', 'enemy');
  showView('defeat');
  document.getElementById('defeat-msg').textContent =
    `You were overwhelmed by ${State.battle.enemy?.name || 'the enemy'}... ` +
    `(Lost ${penaltyGold} Gold as penalty)`;
}

function flee() {
  const b = State.battle;
  if (b.busy) return;
  const d = getDerived();
  const fleeChance = Math.min(0.8, 0.3 + d.speed * 0.01);
  if (Math.random() < fleeChance) {
    b.active = false;
    log('💨 Escaped successfully!', 'system');
    notify('Escaped from dungeon!', '#aaaaaa');
    showView('dungeon');
  } else {
    log('⚠️ Failed to escape!', 'system');
    notify('Failed to flee!', '#ef4444');
    enemyTurn();
  }
}


// ── UI HELPERS ───────────────────────────────────────────────

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${name}`)?.classList.add('active');
}

function updateHUD() {
  const p = State.player;
  const d = getDerived();

  // Bars
  pct('hp-bar',  p.hp,  p.maxHp);
  pct('mp-bar',  p.mp,  p.maxMp);
  pct('exp-bar', p.exp, p.expToNext);
  setText('hp-text',  `${p.hp}/${p.maxHp}`);
  setText('mp-text',  `${p.mp}/${p.maxMp}`);
  setText('exp-text', `${p.exp}/${p.expToNext}`);

  // Mini stats
  setText('stat-level', p.level);
  setText('stat-str', p.str);
  setText('stat-agi', p.agi);
  setText('stat-int', p.int);
  setText('stat-gold', p.gold.toLocaleString());

  // Rank badge color
  const color = RANK_COLORS[p.rank];
  const rankBadge = document.getElementById('hud-rank');
  if (rankBadge) { rankBadge.textContent = p.rank[0]; rankBadge.style.color = color; rankBadge.style.borderColor = color; }
  document.getElementById('hud-avatar').style.boxShadow = `0 0 20px ${color}44`;

  // Stats tab
  setText('big-level', `Lv.${p.level}`);
  const rankLetter = document.getElementById('rank-letter');
  if (rankLetter) { rankLetter.textContent = p.rank[0]; rankLetter.style.color = color; }
  setText('full-str', p.str); setText('full-agi', p.agi);
  setText('full-int', p.int); setText('full-vit', p.vit);
  setText('full-sense', p.sense);
  setText('d-atk',   d.atk);
  setText('d-def',   d.def);
  setText('d-crit',  d.crit + '%');
  setText('d-speed', d.speed);
  setText('kill-count',    p.kills);
  setText('dungeon-count', p.dungeonsClear);

  // Stat points
  const spBanner = document.getElementById('stat-points-banner');
  if (spBanner) spBanner.style.display = p.statPoints > 0 ? 'block' : 'none';
  setText('stat-points-count', p.statPoints);
  document.querySelectorAll('.stat-up-btn').forEach(btn => {
    btn.style.display = p.statPoints > 0 ? 'flex' : 'none';
  });

  // Potions
  const potSlot = p.inventory.find(i => i.type === 'potion');
  setText('potion-count', potSlot?.qty || 0);

  updateSkillsUI();
  updateInventoryUI();
}

function updateEnemyUI() {
  const b = State.battle;
  if (!b.enemy) return;
  const t = ENEMY_TEMPLATES[b.enemy.name] || b.enemy;
  const color = RANK_COLORS[b.enemy.rank || 'E'];
  setText('enemy-name', `${t.icon} ${b.enemy.name}`);
  const badge = document.getElementById('enemy-rank-badge');
  if (badge) { badge.textContent = b.enemy.rank; badge.style.color = color; badge.style.borderColor = color; badge.className = `enemy-rank-badge rank-${(b.enemy.rank||'E').toLowerCase()}`; }
  setText('enemy-hp-text', `${b.enemyHp}/${b.enemyMaxHp}`);
  updateEnemyHP();
  document.getElementById('enemy-sprite').textContent = t.icon;
}

function updateEnemyHP() {
  pct('enemy-hp-bar', State.battle.enemyHp, State.battle.enemyMaxHp);
  setText('enemy-hp-text', `${Math.max(0,State.battle.enemyHp)}/${State.battle.enemyMaxHp}`);
}

function updateSkillsUI() {
  const p = State.player;
  // Skill slots in battle
  const row = document.getElementById('skills-row');
  if (row) {
    row.innerHTML = '';
    p.learnedSkills.forEach(sid => {
      const sk = SKILLS_DATA.find(s => s.id === sid);
      if (!sk) return;
      const cd = State.battle.skillCooldowns?.[sid] || 0;
      const canUse = p.mp >= sk.mpCost && cd === 0 && State.battle.active;
      const btn = document.createElement('button');
      btn.className = 'skill-slot';
      btn.disabled = !canUse;
      btn.innerHTML = `${sk.icon} ${sk.name} <span class="skill-cost">${sk.mpCost}MP</span>`;
      if (cd > 0) btn.innerHTML += `<div class="skill-cd">${cd}</div>`;
      btn.onclick = () => playerAttack(sid);
      row.appendChild(btn);
    });
  }

  // Skills list in panel
  const list = document.getElementById('skills-list');
  if (list) {
    list.innerHTML = '';
    if (p.learnedSkills.length === 0) { list.innerHTML = '<p style="color:var(--text-dim);font-size:0.8rem;">No skills learned yet.</p>'; return; }
    p.learnedSkills.forEach(sid => {
      const sk = SKILLS_DATA.find(s => s.id === sid);
      if (!sk) return;
      const color = RANK_COLORS[sk.rank] || '#aaa';
      list.innerHTML += `
        <div class="skill-item">
          <div class="skill-item-header">
            <span class="skill-item-icon">${sk.icon}</span>
            <span class="skill-item-name">${sk.name}</span>
            <span class="skill-item-rank" style="color:${color};border:1px solid ${color};padding:1px 6px;border-radius:2px;font-size:0.65rem;font-family:var(--font-game)">${sk.rank}</span>
          </div>
          <div class="skill-item-desc">${sk.desc}</div>
          <div class="skill-item-stats">MP: ${sk.mpCost} · CD: ${sk.cooldown} turns · ${sk.type === 'heal' ? `Heal: ${Math.round((sk.healPct||0)*100)}% HP` : `DMG: ×${sk.dmgMult}`}</div>
        </div>`;
    });
  }
}

function updateInventoryUI() {
  const p = State.player;
  const grid = document.getElementById('inventory-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const slots = 16;
  for (let i = 0; i < slots; i++) {
    const item = p.inventory[i];
    const div = document.createElement('div');
    div.className = 'inv-slot' + (item ? '' : ' empty');
    if (item) {
      div.innerHTML = `${item.icon}${item.qty > 1 ? `<span class="inv-qty">×${item.qty}</span>` : ''}`;
      div.title = item.name;
      div.style.borderColor = item.color || 'var(--border)';
    }
    grid.appendChild(div);
  }
}

function buildDungeonGrid() {
  const grid = document.getElementById('dungeon-grid');
  if (!grid) return;
  grid.innerHTML = '';
  DUNGEONS.forEach(d => {
    const p = State.player;
    const locked = p.level < d.minLv;
    const color = RANK_COLORS[d.rank];
    const card = document.createElement('div');
    card.className = 'dungeon-card' + (locked ? ' locked' : '');
    if (locked) card.style.pointerEvents = 'none';
    card.innerHTML = `
      <div class="dungeon-rank" style="color:${color}">${d.rank}</div>
      <div class="dungeon-name">${d.icon} ${d.name}</div>
      <div class="dungeon-desc">${d.desc}</div>
      <div class="dungeon-meta"><span>Waves: ${d.waves}</span><span style="color:var(--gold)">💰 ${d.goldMin}–${d.goldMax}</span></div>
      <div class="dungeon-rec" style="color:${locked?'var(--red)':'var(--text-dim)'}">
        ${locked ? `🔒 Requires Lv.${d.minLv}` : `Min Lv.${d.minLv}`}
      </div>`;
    if (!locked) card.onclick = () => {
      State.player.hp = Math.max(1, State.player.hp); // ensure alive
      startDungeon(d.id);
    };
    grid.appendChild(card);
  });
}

function showVictory(enemy, exp, gold, leveled, droppedItem, isFinal = true) {
  showView('victory');
  const t = ENEMY_TEMPLATES[enemy.name] || enemy;
  setText('victory-enemy', `${t.icon} ${enemy.name} Defeated`);
  const rewards = document.getElementById('victory-rewards');
  if (rewards) {
    rewards.innerHTML = `
      <div class="reward-item"><span>⚡ EXP</span><span class="reward-val">+${exp}</span></div>
      <div class="reward-item"><span>💰 Gold</span><span class="reward-val">+${gold}</span></div>
      ${droppedItem ? `<div class="reward-item" style="border-color:${droppedItem.color}"><span>${droppedItem.icon}</span><span class="reward-val" style="color:${droppedItem.color}">${droppedItem.name}</span></div>` : ''}
    `;
  }
  const lvBanner = document.getElementById('level-up-banner');
  if (lvBanner) {
    lvBanner.style.display = leveled ? 'flex' : 'none';
    if (leveled) setText('new-level-text', `You are now Level ${State.player.level} · ${State.player.rank}-Rank`);
  }
  const btn = document.getElementById('btn-continue');
  if (btn) {
    if (isFinal || State.battle.wave >= State.battle.totalWaves) {
      btn.textContent = '🏆 DUNGEON COMPLETE →';
      btn.onclick = () => { showView('dungeon'); buildDungeonGrid(); updateHUD(); };
    } else {
      btn.textContent = `⚔️ NEXT WAVE (${State.battle.wave + 1}/${State.battle.totalWaves}) →`;
      btn.onclick = () => { State.battle.active = true; showView('battle'); nextWave(); };
    }
  }
  updateHUD();
}

function setActionsEnabled(enabled) {
  ['btn-attack','btn-skill','btn-item','btn-flee'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = !enabled;
  });
}

function setBattleLog(msg) {
  const el = document.getElementById('battle-log-mini');
  if (el) el.innerHTML = `<p>${msg}</p>`;
}

function log(msg, type = 'system') {
  const el = document.getElementById('battle-log');
  if (!el) return;
  const p = document.createElement('p');
  p.className = `log-entry log-${type}`;
  p.textContent = msg;
  el.prepend(p);
  while (el.children.length > 60) el.removeChild(el.lastChild);
}

function showDamage(dmg, isCrit = false) {
  const el = document.getElementById('damage-number');
  if (!el) return;
  el.textContent = (isCrit ? '💥 ' : '') + dmg;
  el.className = 'damage-number show' + (isCrit ? ' crit' : '');
  setTimeout(() => el.className = 'damage-number', 900);
}

function showHeal(amt) {
  const el = document.getElementById('heal-number');
  if (!el) return;
  el.textContent = '+' + amt;
  el.className = 'heal-number show';
  setTimeout(() => el.className = 'heal-number', 900);
}

function notify(msg, color = '#4a6cff') {
  const stack = document.getElementById('notification-stack');
  if (!stack) return;
  const div = document.createElement('div');
  div.className = 'notif';
  div.textContent = msg;
  div.style.borderColor = color;
  div.style.color = color;
  stack.appendChild(div);
  setTimeout(() => div.remove(), 3200);
}

function showSystemPopup(html) {
  const popup = document.getElementById('system-popup');
  const body  = document.getElementById('system-body');
  if (!popup || !body) return;
  body.innerHTML = html;
  popup.classList.add('active');
}

function addToInventory(item) {
  const p = State.player;
  const existing = p.inventory.find(i => i.id === item.id);
  if (existing && item.type === 'potion') { existing.qty = (existing.qty || 1) + 1; }
  else { p.inventory.push({ ...item, qty: 1 }); }
}

function usePotion() {
  const p = State.player;
  const potSlot = p.inventory.find(i => i.type === 'potion');
  if (!potSlot || potSlot.qty < 1) { notify('No potions left!', '#ef4444'); return; }
  const healAmt = potSlot.value || 50;
  const actual = Math.min(healAmt, p.maxHp - p.hp);
  p.hp = Math.min(p.maxHp, p.hp + healAmt);
  potSlot.qty--;
  if (potSlot.qty <= 0) p.inventory.splice(p.inventory.indexOf(potSlot), 1);
  log(`🧪 Used ${potSlot.name}: +${actual} HP`, 'heal');
  showHeal(actual);
  notify(`+${actual} HP restored`, '#22c55e');
  updateHUD();
}

function tickCooldowns() {
  const cds = State.battle.skillCooldowns;
  if (!cds) return;
  Object.keys(cds).forEach(k => { if (cds[k] > 0) cds[k]--; });
}

function pct(id, val, max) {
  const el = document.getElementById(id);
  if (el) el.style.width = (max > 0 ? Math.max(0, Math.min(100, (val / max) * 100)) : 0) + '%';
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }


// ── PARTICLES ────────────────────────────────────────────────

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4, vy: -Math.random() * 0.5 - 0.1,
    r: Math.random() * 2 + 0.5,
    a: Math.random(),
    color: Math.random() > 0.5 ? '#4a6cff' : '#8b5cf6',
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.a * 99).toString(16).padStart(2,'0');
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      p.a += (Math.random() - 0.5) * 0.02;
      p.a = Math.max(0.1, Math.min(0.8, p.a));
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    });
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
}

// ── PANEL TABS ───────────────────────────────────────────────

function initTabs() {
  document.querySelectorAll('.panel-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${target}`)?.classList.add('active');
    });
  });
}

// ── KEYBOARD ─────────────────────────────────────────────────

function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (document.getElementById('system-popup')?.classList.contains('active')) {
      if (e.key === 'Enter' || e.key === ' ') document.getElementById('system-ok')?.click();
      return;
    }
    const inBattle = document.getElementById('view-battle')?.classList.contains('active');
    if (!inBattle) return;
    switch (e.key.toUpperCase()) {
      case 'A': document.getElementById('btn-attack')?.click(); break;
      case 'S': { const first = State.player.learnedSkills[0]; if (first) playerAttack(first); break; }
      case 'D': document.getElementById('btn-item')?.click(); break;
      case 'F': document.getElementById('btn-flee')?.click(); break;
    }
  });
}

// ── STAT ALLOCATION ──────────────────────────────────────────

function initStatButtons() {
  document.querySelectorAll('.stat-up-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = State.player;
      if (p.statPoints <= 0) return;
      const stat = btn.dataset.stat;
      p[stat]++;
      p.statPoints--;
      if (stat === 'vit') { p.maxHp = Math.floor(100 + p.vit * 8 + p.level * 10); p.hp = Math.min(p.hp + 8, p.maxHp); }
      if (stat === 'int') { p.maxMp = Math.floor(50  + p.int * 5 + p.level * 5);  p.mp = Math.min(p.mp + 5, p.maxMp); }
      updateHUD();
      notify(`+1 ${stat.toUpperCase()}`, '#4a6cff');
    });
  });
}

// ── INIT ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initParticles();

  // Title screen start
  document.getElementById('btn-start')?.addEventListener('click', () => {
    document.getElementById('screen-title').classList.remove('active');
    document.getElementById('screen-game').classList.add('active');
    showSystemPopup(
      `<strong>Welcome, Hunter.</strong><br><br>
       You are <span style="color:#4a6cff">Sung Jin-Woo</span>, currently an <span style="color:#aaaaaa">E-Rank Hunter</span>.<br><br>
       Enter dungeons, defeat monsters, level up, and unlock your true power as the <strong>Shadow Monarch</strong>.<br><br>
       <span style="font-size:0.8rem;color:#6668aa">Use A/S/D/F keys or click buttons to play.</span>`
    );
    buildDungeonGrid();
    updateHUD();
  });

  // System popup OK
  document.getElementById('system-ok')?.addEventListener('click', () => {
    document.getElementById('system-popup')?.classList.remove('active');
  });

  // Attack button
  document.getElementById('btn-attack')?.addEventListener('click', () => playerAttack());

  // Item button
  document.getElementById('btn-item')?.addEventListener('click', usePotion);

  // Flee button
  document.getElementById('btn-flee')?.addEventListener('click', flee);

  // Skill button (uses first available skill)
  document.getElementById('btn-skill')?.addEventListener('click', () => {
    const p = State.player;
    const available = p.learnedSkills.find(sid => {
      const sk = SKILLS_DATA.find(s => s.id === sid);
      return sk && p.mp >= sk.mpCost && !(State.battle.skillCooldowns?.[sid] > 0);
    });
    if (available) playerAttack(available);
    else notify('No skills available! (Check MP or cooldowns)', '#ef4444');
  });

  // Potion button in inventory
  document.getElementById('btn-use-potion')?.addEventListener('click', usePotion);

  // Revive
  document.getElementById('btn-revive')?.addEventListener('click', () => {
    const p = State.player;
    p.hp = Math.floor(p.maxHp * 0.5);
    p.mp = Math.floor(p.maxMp * 0.5);
    State.battle.skillCooldowns = {};
    updateHUD();
    showView('dungeon');
    buildDungeonGrid();
    log('🔄 Arose again from the darkness...', 'system');
    notify('You arose from the ashes!', '#4a6cff');
  });

  initTabs();
  initKeyboard();
  initStatButtons();
});
