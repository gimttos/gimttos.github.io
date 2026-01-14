import { ScriptItem } from '../types';

export const cocChatPalette: ScriptItem = {
    id: 'coc-chat-palette',
    title: 'CoC 7판 전용 채팅 팔레트 스크립트 베타 버전',
    subtitle: '코코포리아의 채팅 팔레트 판정 기능, 판정 이외의 기능은 없습니다.',
    description: 'Tampermonkey를 이용한 롤20 CoC 7판 적용 채팅 팔레트(GM/PL 공용)',
    author: 'O',
    version: '1.1',
    updatedAt: '2026. 01. 13.',
    content: {
        introduction: `정식 명칭은 Roll20 CoC 7th Chat Palette 입니다.

코코포리아의 채팅 팔레트 판정 기능에서 영감을 받았습니다. 채팅 팔레트에 다른 문구를 추가하는 기능은 구현하지 못했고(매크로가 있기에 필요 없다고 판단했습니다), 기능치 이름, 특성치 이름, 무기 이름을 입력하면 다이스 롤을 자동으로 굴려주는 기능에만 집중했습니다. API가 아니기 때문에 무료 계정도 가능합니다.

스크립트 저장 후 한 번은 반드시 롤방을 새로고침해야 합니다.

또한, 롤방을 새로고침하면 그 후에 한 번은 반드시 본인의 캐릭터 시트를 클릭해 보아야 합니다(CoC 7판인지 다른 룰의 시트인지 판단해야 작동할 수 있기 때문입니다).

CoC 7판이어도 커스텀 시트를 사용하는 롤방에서의 작동을 보장하지 않습니다!!

사용하지 않는 것을 추천합니다. Esc로 꺼 두시든가 또는 탬퍼몽키 팝업창에서 토글을 끄는 것을 추천드립니다. 이 부분은 제가 직접 업데이트해야 합니다. 정식 버전을 기대해 주세요.

이상할 수 있습니다. 별 거 아니고 AI 전기고문해서 만들었습니다. 전 일자무식입니다. 코드 더 낫게 고칠 수 있으면 그렇게 고쳐서 쓰시고 재배포도 상관 없습니다. 버그 리포트는 괘념치 말고 바로바로 해 주세요.`,
        usage: {
            description: `시트를 한 번 열어 보았을 때 CoC 7판이 아니라면 자동으로 휴면 상태에 들어갑니다.

CoC 7판이라면 작동합니다. 사용할 때 문장의 서두에서만 자동완성이 뜹니다.

자동완성을 위 아래 화살표 키로 선택할 수 있습니다. Tab으로 완성합니다.

거슬릴 때면 Esc를 눌러서 끌 수 있습니다. 이 상태에서 Esc를 누르면 다시 돌아옵니다.

기능치/특성치 이름 뒤에 띄어쓰기 없이 바로 1을 붙이면 보너스/페널티 다이스를 굴릴 수 있습니다. 자료조사1, 근력1, 민첩1, 이렇게 입력해서 엔터를 눌러 보세요.`,
            images: [
                "/images/chatpalette.gif"
            ]
        }
    },
    code: `// ==UserScript==
// @name         Roll20 CoC 7th Chat Palette
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Roll20 CoC 7판 팔레트
// @author       You
// @match        https://app.roll20.net/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roll20.net
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log("✅ Roll20 Chat Palette v1.1 Loaded");

    const FORCE_ENABLE = false;
    const STANDARD_SKILLS = [["근력","str"],["민첩","dex"],["지능","int"],["건강","con"],["외모","app"],["정신","pow"],["크기","siz"],["교육","edu"],["행운","luck"],["운","luck"],["감정","appraise"],["고고학","archaeology"],["관찰력","spot_hidden","spothidden"],["근접전(격투)","fighting_brawl"],["기계수리","mech_repair","mechrepair"],["도약","jump"],["듣기","listen"],["말재주","fast_talk","fasttalk"],["매혹","charm"],["법률","law"],["변장","disguise"],["사격(권총)","firearms_handgun","firearms_hg"],["사격(라/산)","firearms_rifle","firearms_rs"],["설득","persuade"],["손놀림","sleight_of_hand","sleightofhand"],["수영","swim"],["승마","ride"],["심리학","psychology"],["언어(모국어)","language_own"],["역사","history"],["열쇠공","locksmith"],["오르기","climb"],["오컬트","occult"],["위협","intimidate"],["은밀행동","stealth"],["응급처치","first_aid","firstaid"],["의료","medicine"],["인류학","anthropology"],["자동차 운전","drive_auto","driveauto"],["자료조사","library_use","libraryuse"],["자연","natural_world","naturalworld"],["재력","credit_rating","creditrating"],["전기수리","elec_repair","elecrepair"],["정신분석","psychoanalysis"],["중장비 조작","op_hv_machine","ophvmachine"],["추적","track"],["크툴루 신화","cthulhu_mythos","cthulhumythos"],["투척","throw"],["항법","navigate"],["회계","accounting"],["회피","dodge","dodge"],["비무장","unarmed_special"],["이성","san"]];
    const CHAR_KEYS = ["str","dex","int","con","app","pow","siz","edu","luck","san"];

    // --- SHEET TYPES ---
    const TYPE_STD = 0;
    const TYPE_CUSTOM_WEAPON = 1;
    const TYPE_MDR = 2;

    // --- MACRO GENERATORS ---
    const std = (val, txt = val) => \`&{template:coc-1} {{name=@{REPLACE_ME|\${txt}_txt}}} {{success=[[@{REPLACE_ME|\${val}}]]}} {{hard=[[floor(@{REPLACE_ME|\${val}}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|\${val}}/5)]]}} {{roll1=[[1d100cs1cf100]]}}\`;
    const bonus = (val, txt = val) => \`&{template:coc} {{name=@{REPLACE_ME|\${txt}_txt}}} {{success=[[@{REPLACE_ME|\${val}}]]}} {{hard=[[floor(@{REPLACE_ME|\${val}}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|\${val}}/5)]]}} {{roll1=[[1d100cs1cf100]]}} {{roll2=[[1d100cs1cf100]]}} {{roll3=[[1d100cs1cf100]]}}\`;

    const mdr_std = (val, korName) => \`&{template:coc-1} {{name=\${korName}}} {{success=[[@{REPLACE_ME|\${val}}]]}} {{hard=[[floor(@{REPLACE_ME|\${val}}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|\${val}}/5)]]}} {{roll1=[[1d100]]}}\`;
    const mdr_bonus = (val, korName) => \`&{template:coc} {{name=\${korName}}} {{success=[[@{REPLACE_ME|\${val}}]]}} {{hard=[[floor(@{REPLACE_ME|\${val}}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|\${val}}/5)]]}} {{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}}\`;

    const mdr_unarmed = () => \`&{template:coc-attack-1} {{name=비무장}} {{success=[[@{REPLACE_ME|fighting_brawl_mdr}]]}} {{hard=[[floor(@{REPLACE_ME|fighting_brawl_mdr}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|fighting_brawl_mdr}/5)]]}} {{roll1=[[1d100]]}} {{damage=[[1d3+@{REPLACE_ME|damage_bonus}]]}}\`;
    const mdr_unarmed_bonus = () => \`&{template:coc-attack} {{name=비무장}} {{success=[[@{REPLACE_ME|fighting_brawl_mdr}]]}} {{hard=[[floor(@{REPLACE_ME|fighting_brawl_mdr}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|fighting_brawl_mdr}/5)]]}} {{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}} {{damage=[[1d3+@{REPLACE_ME|damage_bonus}]]}}\`;

    // --- WEAPON GENERATORS ---
    const getWeaponMacro = (type, slot) => {
        const prefix = {
            'hth': 'hth_weapon', 'hgun': 'hgun_weapon', 'rifle': 'rifle_weapon',
            'shotgun': 'shotgun_weapon', 'automatic': 'automatic_weapon',
            'explhv': 'explhv_weapon', 'misc': 'misc_weapon',
        }[type] || 'hth_weapon';
        const s = slot;
        const head = \`&{template:coc-attack-1} {{name=@{REPLACE_ME|\${prefix}\${s}_name}}} {{success=[[@{REPLACE_ME|\${prefix}\${s}_skill}]]}} {{hard=[[floor(@{REPLACE_ME|\${prefix}\${s}_skill}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|\${prefix}\${s}_skill}/5)]]}} {{roll1=[[1d100cs1cf100]]}}\`;
        if (type === 'hth') return \`\${head} {{damage=[[@{REPLACE_ME|\${prefix}\${s}_damage}@{REPLACE_ME|\${prefix}\${s}_db}]]}}\`;
        if (['hgun', 'rifle', 'automatic'].includes(type)) return \`\${head} {{damage=[[@{REPLACE_ME|\${prefix}\${s}_damage}+0]]}}\`;
        if (['shotgun', 'explhv'].includes(type)) return \`\${head} {{dammax=[[@{REPLACE_ME|\${prefix}\${s}_damage_Max}+0]]}} {{dammid=[[@{REPLACE_ME|\${prefix}\${s}_damage_mid}+0]]}} {{dammin=[[@{REPLACE_ME|\${prefix}\${s}_damage_min}+0]]}} {{ramax=@{REPLACE_ME|\${prefix}\${s}_ra_Max}}} {{ramid=@{REPLACE_ME|\${prefix}\${s}_ra_mid}}} {{ramin=@{REPLACE_ME|\${prefix}\${s}_ra_min}}}\`;
        return \`\${head} {{damage=[[@{REPLACE_ME|\${prefix}\${s}_damage}@{REPLACE_ME|\${prefix}\${s}_db}]]}}\`;
    };

    const getWeaponBonusMacro = (type, slot) => {
        const prefix = {
            'hth': 'hth_weapon', 'hgun': 'hgun_weapon', 'rifle': 'rifle_weapon',
            'shotgun': 'shotgun_weapon', 'automatic': 'automatic_weapon',
            'explhv': 'explhv_weapon', 'misc': 'misc_weapon',
        }[type] || 'hth_weapon';
        const s = slot;
        const head = \`&{template:coc-attack} {{name=@{REPLACE_ME|\${prefix}\${s}_name}}} {{success=[[@{REPLACE_ME|\${prefix}\${s}_skill}]]}} {{hard=[[floor(@{REPLACE_ME|\${prefix}\${s}_skill}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|\${prefix}\${s}_skill}/5)]]}} {{roll1=[[1d100cs1cf100]]}} {{roll2=[[1d100cs1cf100]]}} {{roll3=[[1d100cs1cf100]]}}\`;

        if (type === 'hth') return \`\${head} {{damage=[[@{REPLACE_ME|\${prefix}\${s}_damage}@{REPLACE_ME|\${prefix}\${s}_db}]]}}\`;
        if (['hgun', 'rifle', 'automatic'].includes(type)) return \`\${head} {{damage=[[@{REPLACE_ME|\${prefix}\${s}_damage}+0]]}}\`;
        if (['shotgun', 'explhv'].includes(type)) return \`\${head} {{dammax=[[@{REPLACE_ME|\${prefix}\${s}_damage_Max}+0]]}} {{dammid=[[@{REPLACE_ME|\${prefix}\${s}_damage_mid}+0]]}} {{dammin=[[@{REPLACE_ME|\${prefix}\${s}_damage_min}+0]]}} {{ramax=@{REPLACE_ME|\${prefix}\${s}_ra_Max}}} {{ramid=@{REPLACE_ME|\${prefix}\${s}_ra_mid}}} {{ramin=@{REPLACE_ME|\${prefix}\${s}_ra_min}}}\`;
        return \`\${head} {{damage=[[@{REPLACE_ME|\${prefix}\${s}_damage}@{REPLACE_ME|\${prefix}\${s}_db}]]}}\`;
    };

    const getRepeatingWeaponMacro = (rowId) => {
        const prefix = \`repeating_weapons_\${rowId}_\`;
        return \`&{template:coc-attack-1} {{name=@{REPLACE_ME|\${prefix}name}}} {{success=[[@{REPLACE_ME|\${prefix}skill}]]}} {{hard=[[floor(@{REPLACE_ME|\${prefix}skill}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|\${prefix}skill}/5)]]}} {{roll1=[[1d100cs1cf100]]}} {{damage=[[@{REPLACE_ME|\${prefix}damage}]]}} {{range=@{REPLACE_ME|\${prefix}range}}} {{ammo=@{REPLACE_ME|\${prefix}ammo}}} {{attacks=@{REPLACE_ME|\${prefix}attacks}}}\`;
    };

    const getCustomWeaponMacro = (slot) => \`&{template:coc-attack-1} {{name=@{REPLACE_ME|weapon\${slot}_name}}} {{success=[[@{REPLACE_ME|weapon\${slot}_skill}]]}} {{hard=[[floor(@{REPLACE_ME|weapon\${slot}_skill}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|weapon\${slot}_skill}/5)]]}} {{malf=@{REPLACE_ME|weapon\${slot}_malf}}} {{roll1=[[1d100]]}} {{damage=[[@{REPLACE_ME|weapon\${slot}_damage}@{REPLACE_ME|weapon\${slot}_db}]]}}\`;
    const getCustomWeaponBonusMacro = (slot) => \`&{template:coc-attack} {{name=@{REPLACE_ME|weapon\${slot}_name}}} {{success=[[@{REPLACE_ME|weapon\${slot}_skill}]]}} {{hard=[[floor(@{REPLACE_ME|weapon\${slot}_skill}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|weapon\${slot}_skill}/5)]]}} {{malf=@{REPLACE_ME|weapon\${slot}_malf}}} {{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}} {{damage=[[@{REPLACE_ME|weapon\${slot}_damage}@{REPLACE_ME|weapon\${slot}_db}]]}}\`;

    const getMdrWeaponMacro = (slot) => \`&{template:coc-attack-1} {{name=@{REPLACE_ME|weapon\${slot}_mdr_name}}} {{success=[[@{REPLACE_ME|weapon\${slot}_mdr_skill}]]}} {{hard=[[floor(@{REPLACE_ME|weapon\${slot}_mdr_skill}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|weapon\${slot}_mdr_skill}/5)]]}} {{malf=@{REPLACE_ME|weapon\${slot}_mdr_malf}}} {{roll1=[[1d100]]}} {{damage=[[@{REPLACE_ME|weapon\${slot}_mdr_damage}@{REPLACE_ME|weapon\${slot}_mdr_db}]]}}\`;
    const getMdrWeaponBonusMacro = (slot) => \`&{template:coc-attack} {{name=@{REPLACE_ME|weapon\${slot}_mdr_name}}} {{success=[[@{REPLACE_ME|weapon\${slot}_mdr_skill}]]}} {{hard=[[floor(@{REPLACE_ME|weapon\${slot}_mdr_skill}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|weapon\${slot}_mdr_skill}/5)]]}} {{malf=@{REPLACE_ME|weapon\${slot}_mdr_malf}}} {{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}} {{damage=[[@{REPLACE_ME|weapon\${slot}_mdr_damage}@{REPLACE_ME|weapon\${slot}_mdr_db}]]}}\`;

    // --- STATE ---
    let PALETTE_DB = {};
    let BONUS_DB = {};
    let selectedIndex = -1;
    let visibleItems = [];
    let IS_PAUSED = false;
    let HAS_DETECTED_COC = false;

    // --- UI SETUP ---
    const STYLES = \`
        #r20-palette-container { position: absolute; background: #1a1a1a; border: 1px solid #444; border-radius: 6px; box-shadow: 0 6px 16px rgba(0,0,0,0.7); z-index: 999999; max-height: 250px; overflow-y: auto; display: none; width: 250px; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #eee; font-size: 13px; }
        .r20-palette-item { padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
        .r20-palette-item:last-child { border-bottom: none; }
        .r20-palette-item:hover, .r20-palette-item.selected { background: #0069d9; color: white; }
        .r20-palette-hint { font-size: 0.75em; color: #888; background: #333; padding: 2px 4px; border-radius: 3px; }
        .r20-palette-item:hover .r20-palette-hint, .r20-palette-item.selected .r20-palette-hint { color: #eee; background: rgba(255,255,255,0.2); }
    \`;
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    // --- SCANNING LOGIC ---
    function findCoCSheet() {
        let candidates = Array.from(document.querySelectorAll('form.sheetform'));
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                if (iframe.contentDocument) {
                    const forms = iframe.contentDocument.querySelectorAll('form.sheetform');
                    if (forms.length > 0) candidates = candidates.concat(Array.from(forms));
                }
            } catch (e) { }
        });

        for (let sheet of candidates) {
            const hasStdMythos = sheet.querySelector('input[name="attr_cthulhu_mythos"]');
            const hasMdrMythos = sheet.querySelector('input[name="attr_cthulhu_mythos_mdr"]');
            if (hasStdMythos || hasMdrMythos) return sheet;
        }
        return null;
    }

    function getSheetType(sheet) {
        if (!sheet) return null;

        // 1. Standard / Custom Check (Prioritize Official Attributes)
        // Check for 'cthulhu_mythos' first because standard sheets always have this.
        if (sheet.querySelector('input[name="attr_cthulhu_mythos"]')) {
             if (sheet.querySelector('input[name="attr_weapon1_name"]')) {
                return TYPE_CUSTOM_WEAPON;
            }
            return TYPE_STD;
        }

        // 2. MDR Check
        if (sheet.querySelector('input[name="attr_cthulhu_mythos_mdr"]') ||
            sheet.querySelector('input[name="attr_appraise_mdr"]')) {
            return TYPE_MDR;
        }

        return null;
    }

    function refreshData() {
        if (IS_PAUSED) return;

        const sheet = findCoCSheet();
        const sheetType = getSheetType(sheet);

        if (sheet && sheetType !== null) HAS_DETECTED_COC = true;

        if (HAS_DETECTED_COC || FORCE_ENABLE) {
            if (sheet && sheetType !== null) {
                const newDB = {};
                const newBonusDB = {};

                // Base Skills
                STANDARD_SKILLS.forEach(([key, val, txt]) => {
                    if (sheetType === TYPE_MDR) {
                        if (key === "비무장") { newDB[key] = mdr_unarmed(); newBonusDB[key + "1"] = mdr_unarmed_bonus(); }
                        else { const isChar = CHAR_KEYS.includes(val); const code = isChar ? val : val + "_mdr"; newDB[key] = mdr_std(code, key); newBonusDB[key + "1"] = mdr_bonus(code, key); }
                    } else {
                        if (key === "비무장") {
                            newDB[key] = "&{template:coc-attack-1} {{name=@{REPLACE_ME|unarmed_txt}}} {{success=[[@{REPLACE_ME|fighting_brawl}]]}} {{hard=[[floor(@{REPLACE_ME|fighting_brawl}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|fighting_brawl}/5)]]}} {{roll1=[[1d100cs1cf100]]}} {{damage=[[1d3+@{REPLACE_ME|damage_bonus}]]}}";
                            newBonusDB[key + "1"] = "&{template:coc-attack} {{name=@{REPLACE_ME|unarmed_txt}}} {{success=[[@{REPLACE_ME|fighting_brawl}]]}} {{hard=[[floor(@{REPLACE_ME|fighting_brawl}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|fighting_brawl}/5)]]}} {{roll1=[[1d100cs1cf100]]}} {{roll2=[[1d100cs1cf100]]}} {{roll3=[[1d100cs1cf100]]}} {{damage=[[1d3+@{REPLACE_ME|damage_bonus}]]}}";
                        } else if (key === "이성") {
                            newDB[key] = "&{template:coc-1} {{name=SAN Roll}} {{success=[[@{REPLACE_ME|san}]]}} {{hard=[[floor(@{REPLACE_ME|san}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|san}/5)]]}} {{roll1=[[1d100cs1cf100]]}}";
                            newBonusDB[key + "1"] = "&{template:coc} {{name=SAN Roll}} {{success=[[@{REPLACE_ME|san}]]}} {{hard=[[floor(@{REPLACE_ME|san}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|san}/5)]]}} {{roll1=[[1d100cs1cf100]]}} {{roll2=[[1d100cs1cf100]]}} {{roll3=[[1d100cs1cf100]]}}";
                        } else {
                            newDB[key] = std(val, txt);
                            newBonusDB[key + "1"] = bonus(val, txt);
                        }
                    }
                });

                scrapeSheetToDB(sheet, newDB, newBonusDB);
                PALETTE_DB = newDB;
                BONUS_DB = newBonusDB;
            }
        }
    }

    function scrapeSheetToDB(sheetElement, db, bonusDb) {
        if (!sheetElement) return;

        const nameInputs = sheetElement.querySelectorAll('input[name$="_name"]');
        nameInputs.forEach(input => {
            const nameAttr = input.name;
            const val = input.value ? input.value.trim() : "";
            if (!val) return;

            let macro = null;
            let bonusMacro = null;
            let match;

            // --- UNIVERSAL SCRAPING (Check all known patterns regardless of sheet type) ---

            // 1. Standard Weapons (hth, firearms, etc)
            match = nameAttr.match(/attr_(hth|hgun|rifle|shotgun|automatic|explhv|misc)_weapon(\\d+)_name/);
            if (match) {
                const type = match[1];
                const slot = match[2];
                macro = getWeaponMacro(type, slot);
                bonusMacro = getWeaponBonusMacro(type, slot);
            }

            // 2. Standard Other Skills (Also used by Custom)
            if (!macro) {
                match = nameAttr.match(/attr_otherskill(\\d+)_name/);
                if (match) {
                    const slot = match[1];
                    macro = \`&{template:coc-1} {{name=@{REPLACE_ME|otherskill\${slot}_name} Roll}} {{success=[[@{REPLACE_ME|otherskill\${slot}}]]}} {{hard=[[floor(@{REPLACE_ME|otherskill\${slot}}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|otherskill\${slot}}/5)]]}} {{roll1=[[1d100cs1cf100]]}}\`;
                    // Fixed name format for standard sheet bonus rolls
                    bonusMacro = \`&{template:coc} {{name=@{REPLACE_ME|otherskill\${slot}_name} Roll}} {{success=[[@{REPLACE_ME|otherskill\${slot}}]]}} {{hard=[[floor(@{REPLACE_ME|otherskill\${slot}}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|otherskill\${slot}}/5)]]}} {{roll1=[[1d100cs1cf100]]}} {{roll2=[[1d100cs1cf100]]}} {{roll3=[[1d100cs1cf100]]}}\`;
                }
            }

            // 3. Repeating Weapons (Official Repeating)
            if (!macro) {
                match = nameAttr.match(/attr_repeating_weapons_(-[a-zA-Z0-9\\-_]+)_name/);
                if (match) {
                    const rowId = match[1];
                    macro = getRepeatingWeaponMacro(rowId);
                }
            }

            // 4. Repeating Other Skills (Added for Row 7+ support)
            if (!macro) {
                match = nameAttr.match(/attr_repeating_skills_(-[a-zA-Z0-9\\-_]+)_name/);
                if (match) {
                    const rowId = match[1];
                    macro = \`&{template:coc-1} {{name=@{REPLACE_ME|repeating_skills_\${rowId}_name} Roll}} {{success=[[@{REPLACE_ME|repeating_skills_\${rowId}_roll}]]}} {{hard=[[floor(@{REPLACE_ME|repeating_skills_\${rowId}_roll}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|repeating_skills_\${rowId}_roll}/5)]]}} {{roll1=[[1d100cs1cf100]]}}\`;
                    bonusMacro = \`&{template:coc} {{name=@{REPLACE_ME|repeating_skills_\${rowId}_name} Roll}} {{success=[[@{REPLACE_ME|repeating_skills_\${rowId}_roll}]]}} {{hard=[[floor(@{REPLACE_ME|repeating_skills_\${rowId}_roll}/2)]]}} {{extreme=[[floor(@{REPLACE_ME|repeating_skills_\${rowId}_roll}/5)]]}} {{roll1=[[1d100cs1cf100]]}} {{roll2=[[1d100cs1cf100]]}} {{roll3=[[1d100cs1cf100]]}}\`;
                }
            }

            // 5. Custom Sheet Weapons (weaponN_name)
            if (!macro) {
                match = nameAttr.match(/attr_weapon(\\d+)_name/);
                if (match) {
                    const slot = match[1];
                    macro = getCustomWeaponMacro(slot);
                    bonusMacro = getCustomWeaponBonusMacro(slot);
                }
            }

            // 6. MDR Patterns (otherskill_mdr, weapon_mdr)
            if (!macro) {
                match = nameAttr.match(/attr_otherskill(\\d+)_mdr_name/);
                if (match) {
                    const slot = match[1];
                    const nameRef = \`@{REPLACE_ME|otherskill\${slot}_mdr_name}\`;
                    macro = mdr_std(\`otherskill\${slot}_mdr\`, nameRef);
                    bonusMacro = mdr_bonus(\`otherskill\${slot}_mdr\`, nameRef);
                }
            }
            if (!macro) {
                 match = nameAttr.match(/attr_weapon(\\d+)_mdr_name/);
                 if (match) {
                    const slot = match[1];
                    macro = getMdrWeaponMacro(slot);
                    bonusMacro = getMdrWeaponBonusMacro(slot);
                 }
            }

            if (macro) {
                db[val] = macro;
                if (bonusMacro) {
                    bonusDb[val + "1"] = bonusMacro;
                }
            }
        });
    }

    // --- MAIN LOOP ---
    setInterval(refreshData, 2000);
    setTimeout(refreshData, 1000);

    // --- UI HELPERS ---
    function getPalette() {
        let el = document.getElementById('r20-palette-container');
        if (!el) { el = document.createElement('div'); el.id = 'r20-palette-container'; document.body.appendChild(el); }
        return el;
    }

    function getTargetId() {
        const select = document.getElementById('speakingas');
        if (select && select.value && select.value.startsWith('character|')) { return select.value.split('|')[1]; }
        return 'selected';
    }

    function getStartKeyword(textarea) {
        const val = textarea.value;
        const cursor = textarea.selectionStart;
        const textBefore = val.slice(0, cursor);
        const match = textBefore.match(/^\\s*(.+)$/);
        if (match) return match[1];
        return null;
    }

    function executeCommand(key, textarea) {
        const targetId = getTargetId();
        let cmd = PALETTE_DB[key] || BONUS_DB[key];
        if (!cmd) return;
        cmd = cmd.replaceAll('REPLACE_ME', targetId);

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(textarea, cmd);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        setTimeout(() => { const btn = document.querySelector('#textchat-input .btn'); if (btn) btn.click(); }, 50);
        hidePalette();
    }

    function applyAutocomplete(key, textarea) {
        const val = textarea.value;
        const cursor = textarea.selectionStart;
        const textBefore = val.slice(0, cursor);
        const match = textBefore.match(/^(\\s*)(.+)$/);
        let prefix = "";
        if (match) prefix = match[1];

        const newTextBefore = prefix + key;
        const textAfter = val.slice(cursor);
        const finalVal = newTextBefore + textAfter;

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(textarea, finalVal);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        hidePalette();
    }

    function hidePalette() {
        const el = getPalette();
        if (el) { el.style.display = 'none'; el.innerHTML = ''; }
        selectedIndex = -1;
        visibleItems = [];
    }

    function showPalette(items, textarea) {
        const el = getPalette();
        visibleItems = items;
        const rect = textarea.getBoundingClientRect();
        el.style.position = 'fixed';
        el.style.left = rect.left + 'px';
        el.style.bottom = (window.innerHeight - rect.top + 5) + 'px';
        el.style.display = 'block';
        el.innerHTML = '';

        items.forEach((key, idx) => {
            const div = document.createElement('div');
            div.className = 'r20-palette-item';
            if (idx === selectedIndex) div.classList.add('selected');

            let displayKey = key;
            let hint = '기능';
            if (BONUS_DB[key]) { displayKey = key.replace(/1$/, '') + ' (보너스/페널티)'; hint = '보너스'; }
            else if (STANDARD_SKILLS.find(s => s[0] === key)) { hint = '기본'; }
            else { hint = '추가/무기'; }

            div.innerHTML = \`<span>\${displayKey}</span><span class="r20-palette-hint">\${hint}</span>\`;
            div.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); executeCommand(key, textarea); });
            el.appendChild(div);
        });

        if (selectedIndex === -1) { selectedIndex = 0; updateSelection(); }
    }

    function updateSelection() {
        const el = getPalette();
        const children = el.children;
        for (let i = 0; i < children.length; i++) { children[i].classList.remove('selected'); }
        if (selectedIndex >= 0 && children[selectedIndex]) { children[selectedIndex].classList.add('selected'); children[selectedIndex].scrollIntoView({ block: 'nearest' }); }
    }

    document.addEventListener('keydown', function(e) {
        const textarea = e.target;
        if (!textarea || textarea.tagName !== 'TEXTAREA' || !textarea.closest('#textchat-input')) return;

        if (e.key === 'Escape') {
            e.preventDefault(); e.stopPropagation();
            const palette = getPalette();
            const isPaletteOpen = palette.style.display !== 'none';
            if (isPaletteOpen) { hidePalette(); IS_PAUSED = true; console.log("🔴 CoC Palette Paused (Invisible)"); }
            else { IS_PAUSED = !IS_PAUSED; console.log(IS_PAUSED ? "🔴 CoC Palette Paused" : "🟢 CoC Palette Active"); }
            refreshData(); return;
        }

        if ((IS_PAUSED || (!HAS_DETECTED_COC && !FORCE_ENABLE)) && Object.keys(PALETTE_DB).length === 0) return;
        if (Object.keys(PALETTE_DB).length === 0) return;

        const palette = getPalette();
        const isPaletteOpen = palette.style.display !== 'none';

        if (isPaletteOpen && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            e.preventDefault(); e.stopPropagation();
            if (e.key === 'ArrowDown') selectedIndex = (selectedIndex + 1) % visibleItems.length;
            else selectedIndex = (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
            updateSelection(); return;
        }

        if (e.key === 'Tab') {
            if (isPaletteOpen && selectedIndex >= 0) { e.preventDefault(); e.stopPropagation(); applyAutocomplete(visibleItems[selectedIndex], textarea); return; }
        }

        if (e.key === 'Enter') {
            const startKeyword = getStartKeyword(textarea);
            if (isPaletteOpen && selectedIndex >= 0) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); executeCommand(visibleItems[selectedIndex], textarea); return; }
            if (startKeyword) {
                if (PALETTE_DB[startKeyword] || BONUS_DB[startKeyword]) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); executeCommand(startKeyword, textarea); return; }
            }
        }
    }, true);

    document.addEventListener('input', function(e) {
        const textarea = e.target;
        if (!textarea || textarea.tagName !== 'TEXTAREA' || !textarea.closest('#textchat-input')) return;
        if (IS_PAUSED) { hidePalette(); return; }
        if (Object.keys(PALETTE_DB).length === 0) { hidePalette(); return; }
        const startKeyword = getStartKeyword(textarea);
        if (!startKeyword) { hidePalette(); return; }
        let matches = Object.keys(PALETTE_DB).filter(key => key.startsWith(startKeyword));
        const bonusMatches = Object.keys(BONUS_DB).filter(key => key === startKeyword);
        matches = matches.concat(bonusMatches);
        if (matches.length > 0) showPalette(matches, textarea); else hidePalette();
    }, false);

    document.addEventListener('focusout', function(e) {
        const textarea = e.target;
        if (textarea && textarea.tagName === 'TEXTAREA' && textarea.closest('#textchat-input')) { setTimeout(() => hidePalette(), 200); }
    });

})();`,
};
