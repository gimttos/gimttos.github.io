import { ScriptItem, NavigationItem } from './types';

export const GUIDE_ID = 'installation-guide';

// Navigation structure
export const NAV_ITEMS: NavigationItem[] = [
    { id: GUIDE_ID, label: '시작하기 (설치 방법)', type: 'guide' },
    { id: 'visual-novel-helper', label: '비주얼노벨 커맨드 간략화', type: 'script' },
    { id: 'auto-as-switcher', label: '토큰 클릭 시 as 전환', type: 'script' },
    { id: 'coc-chat-palette', label: 'CoC 7판 채팅 팔레트', type: 'script' },
    { id: 'hide-deleted-messages', label: 'Hidden 채팅 삭제', type: 'script' },
    { id: 'message-edit-script', label: '대사 수정 API+스크립트', type: 'script' },
    { id: 'outside-avatar', label: '외부 아바타 주입기', type: 'script' },
];

// Content for the Global Guide
export const GUIDE_CONTENT = {
    title: 'Tampermonkey 스크립트 설치 방법',
    description: '배포 유저 스크립트를 Tampermonkey에 적용하는 방법입니다.',
    steps: [
        {
            title: '1. 확장 프로그램 설치',
            text: '사용하는 브라우저(Chrome, Edge, Firefox 등)에 맞는 Tampermonkey 확장 프로그램을 웹 스토어에서 검색해 설치합니다.'
        },
        {
            title: '2. 새 스크립트 생성',
            text: '브라우저 우측 상단의 확장 프로그램 아이콘에서 Tampermonkey를 클릭하고 새 스크립트 만들기를 선택합니다.'
        },
        {
            title: '3. 코드 복사 및 붙여넣기',
            text: '에디터에 적혀있는 내용을 모두 지운 뒤, 원하는 스크립트의 코드를 복사하여 붙여넣습니다.'
        },
        {
            title: '4. 저장',
            text: 'Ctrl + S 입력 또는 에디터 상단의 "파일 > 저장"을 눌러 저장합니다.'
        },
        {
            title: '5. 롤20 접속 및 새로고침',
            text: 'Roll20 페이지에 접속해 새로고침하면 스크립트가 동작합니다.'
        }
    ]
};

// Database of Scripts
export const SCRIPTS: Record<string, ScriptItem> = {
    'visual-novel-helper': {
        id: 'visual-novel-helper',
        title: '비주얼노벨 API 대응 커맨드 간략화 스크립트',
        subtitle: '양천일염님의 visual_dialogue.js 대응 스크립트, 대사 @표정을 써보자.',
        description: 'Tampermonkey를 활용한 visual_dialogue.js 적용 탁에서의 표정 명령어 간략화(PL 각자 적용)',
        author: 'O',
        version: '1.0',
        updatedAt: '2026. 01. 13.',
        content: {
            introduction: `정식명칭은 Roll20 Auto-Exclaim for Emotion 입니다.

양천일염 님의 visual_dialoge.js api를 적용하는 탁에서 !@표정을 쓸 때 !@를 하나하나 쳐야 하는 번거로움, 한 줄에 대사 @표정 을 보내지 못하고 따로 보내야 하는 번거로움을 해소하기 위해 제작했습니다(AI랑 같이 만듬, 이상할 수 있음). 표정 명령어 간소화 Tampermonkey 유저 스크립트입니다.

기본적으로 양천일염님께서 배포하시는 visual_dialoge.js 를 사용하는 탁이라면 전부 사용 가능합니다. visual_dialoge.js에 대응하는 유저 스크립트이기 때문에 GM분이 프로 계정이 아니라면 의미가 없습니다(PL은 무료여도 됨).

GM이 새 api 코드를 적용한다든가 하는 별개의 활동을 하지 않아도 됩니다. GM도 스크립트를 적용하면 !@리셋이나 !@숨김 !@퇴장 등의 커맨드를 칠 때 @리셋, @숨김, @퇴장, 이렇게 더 간편하게 칠 수 있습니다.

대사 @표정
@표정

이렇게 코코포리아에서 채팅 보내듯 보낼 수 있게 해주는 스크립트입니다.

PL들이 다 각자 따로 깔아야 합니다(GM이 visual_dialogue.js를 쓰고 있기만 하다면 PL이 혼자 알아서 적용해 써도 된다는 뜻이기도 합니다).`,
            usage: {
                description: `@표정, 또는 대사 @표정을 전송하면 자동으로 표정이 바뀝니다.`,
                images: [
                    "/images/expression.gif"
                ]
            }

        },
        code: `// ==UserScript==
// @name         Roll20 Auto-Exclaim for Emotion
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  visual dialogue 표정 명령어 간단화
// @author       Assistant
// @match        https://app.roll20.net/editor*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        const textarea = document.querySelector('#textchat-input textarea');
        if (!textarea || textarea !== document.activeElement) return;

        let val = textarea.value;

        const emotMatch = val.match(/\\s?@([^\\s]+)$/);

        if (emotMatch && !val.startsWith('!') && !val.startsWith('/') && !val.startsWith('#')) {
            e.preventDefault();
            e.stopImmediatePropagation();

            const emotionTag = emotMatch[0];
            const emotionName = emotMatch[1];
            const dialogue = val.replace(emotionTag, '').trim();

            textarea.value = dialogue;
            const btn = document.querySelector('#textchat-input .btn');
            if (btn) btn.click();

            setTimeout(() => {
                textarea.value = '!@' + emotionName;
                if (btn) btn.click();
            }, 100);
        }
    }
}, true);
})();`
    },
    'auto-as-switcher': {
        id: 'auto-as-switcher',
        title: '토큰 클릭 시 as 전환 스크립트',
        subtitle: '무료 계정 가능, 저널과 연동된 토큰을 클릭하면 as가 바뀝니다.',
        description: 'Tampermonkey를 활용한 토큰 클릭 시 자동 as 전환 스크립트(GM용)',
        author: 'O',
        version: '1.0',
        updatedAt: '2026. 01. 13.',
        content: {
            introduction: `정식 명칭은 Roll20 Auto As Switcher입니다.

양천일염 님의 as_switcher.js에서 영감을 받았습니다. 저널과 연동된 토큰을 선택하면 해당 저널로 as가 바뀌고, 선택을 해제하면 이전의 as로 다시 돌아갑니다. NPC가 많은 시나리오를 마스터링할 때 사용하기 좋습니다.

확장 프로그램 Tampermonkey를 이용하기 때문에 별도의 api 설정이나 Pro 계정은 필요하지 않습니다. 무료 계정도 쓸 수 있습니다.

다만 코드가 조금 무식하기 때문에 컴퓨터에 부하가 걸릴 수도 있습니다. 부하가 덜 걸리게 고치실 수 있는 분은 편하게 고쳐서 쓰시면 됩니다. 수정 후 재배포도 괜찮습니다.`,
            usage: {
                description: `페이지 영역 밖에 캐릭터 저널 인장 부분을 드래그&드롭합니다(영역 밖의 토큰은 PL에게 보이지 않기 때문입니다).

이렇게 생성한 토큰은 이미 캐릭터와 연동되어 있기 때문에, 클릭 시 해당 캐릭터로 as를 바꿀 수 있습니다.`,
                images: [
                    "/images/asswitcher.gif"
                ]
            }
        },
        code: `// ==UserScript==
// @name         Roll20 Auto As Switcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  저널과 연동된 토큰을 누르면 as 변경
// @author       Assistant
// @match        https://app.roll20.net/editor*
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    var uw = unsafeWindow;
    var lastTid = "";
    var playerBaseline = "";
    var isInternalChange = false;

    function update() {
        try {
            if (!uw.Campaign || !uw.Campaign.engine || !uw.Campaign.engine.tabletop) return;
            var $s = uw.jQuery('#speakingas');
            if (!$s || $s.length === 0) return;


            if (!playerBaseline) {
                playerBaseline = $s.val();
            }


            var selection = uw.Campaign.engine.tabletop.getSelection();
            var selectedId = "";
            var charId = "";

            if (selection) {
                var selArray = Array.from(selection);
                if (selArray.length === 1) {
                    var tokenObj = selArray[0];
                    selectedId = tokenObj.id;

                    if (tokenObj.model && tokenObj.model.attributes) {
                        charId = tokenObj.model.attributes.represents;
                    }
                }
            }


            if (selectedId !== lastTid) {
                if (selectedId === "") {

                    if ($s.val() !== playerBaseline) {
                        isInternalChange = true;
                        $s.val(playerBaseline).trigger('change');
                        isInternalChange = false;
                    }
                } else {

                    if (charId) {
                        var targetVal = "character|" + charId;
                        if ($s.find('option[value="' + targetVal + '"]').length > 0) {
                            if ($s.val() !== targetVal) {
                                isInternalChange = true;
                                $s.val(targetVal).trigger('change');
                                isInternalChange = false;
                            }
                        }
                    } else {
 
                        if ($s.val() !== playerBaseline) {
                            $s.val(playerBaseline).trigger('change');
                        }
                    }
                }
                lastTid = selectedId;
            }
        } catch (e) {

        }
    }

    document.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'speakingas') {
            if (!isInternalChange) {
                playerBaseline = uw.jQuery(e.target).val();
            }
        }
    }, true);

    document.addEventListener('mousedown', function() { setTimeout(update, 150); }, true);
    setInterval(update, 800);
})();`
    },
    'coc-chat-palette': {
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

})();`
    },
    'hide-deleted-messages': {
        id: 'hide-deleted-messages',
        title: 'hidden 채팅 삭제 스크립트',
        subtitle: 'This message has been hidden 메시지가 롤방에서 보이지 않게 합니다.',
        description: 'Tampermonkey를 이용한 롤20 hidden 채팅이 보이지 않게 하는 스크립트(GM/PL공용)',
        author: 'R',
        version: '1.0',
        updatedAt: '2026. 01. 13.',
        content: {
            introduction: `롤20 실시간 세션 방과 외부 채팅 로그 페이지에서 This message has been hidden이라는 삭제 알림 문구가 보이지 않게 해주는 기능을 제공하는 스크립트입니다. 

다만 템퍼몽키 특성상 설치한 본인의 브라우저에서만 적용되므로, 모든 세션 멤버가 삭제 흔적 없는 깔끔한 채팅창을 보려면 플레이어 전원이 각자 스크립트를 설치해야 합니다. 또한, 스크립트를 통해 보이지 않게 처리된 삭제 메시지는 시스템상 다시 복구할 수 없습니다.

실수로 핸드아웃을 긁은 뒤  This message has been hidden 폭탄으로 대참사가 난 적이 있어 더 이상 부끄럽지 않으려 만든 스크립트인데 벌거숭이 임금님이 되어 버렸네요.

고쳐서 쓰셔도 되고 재배포도 괜찮습니다. 편히 사용해주시면 기쁠 것 같아요. ~^_^~`,
            usage: {
                description: 'Hidden을 누르면 자신의 화면에서 채팅 내역이 사라집니다.',
                images: [
                    "/images/deleter.gif"
                ]
            }
        },
        code: `// ==UserScript==
// @name         Roll20 Hide Deleted Only
// @namespace    http://tampermonkey.net/
// @version      1.4
// @author       User
// @match        https://app.roll20.net/editor*
// @match        https://app.roll20.net/campaigns/chatarchive/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = \`
        .message.deleted,
        .message.system.alert,
        .message.error {
            display: none !important;
        }
    \`;
    document.head.appendChild(style);

    const filter = () => {
        const targets = ["message has been hidden", "메시지는 숨겨졌습니다", "메시지는 삭제되었습니다"];

        document.querySelectorAll('.message').forEach(el => {
            const txt = el.textContent;
            if (targets.some(t => txt.includes(t))) {
                el.style.setProperty('display', 'none', 'important');
            }
        });
    };

    const observer = new MutationObserver(filter);
    const chat = document.getElementById('textchat') || document.body;

    observer.observe(chat, { childList: true, subtree: true });
    filter();
})();`
    },
    'message-edit-script': {
        id: 'message-edit-script',
        title: '대사 수정 API+스크립트',
        subtitle: 'Roll20 프로 계정이 만든 방만 가능하며, 탁 전원 스크립트를 적용해야 합니다.',
        description: 'ROLL20/롤20 대사 수정 API+스크립트 배포합니다 ^_^',
        author: 'R',
        version: '1.0',
        updatedAt: '2026. 01. 13.',
        content: {
            introduction: `+방 제작자가 아니라면 무료 플랜 사용자여도 괜찮습니다.

++) 사실 무료 플랜의 방에서도 사용이 가능하시기야 합니다. API를 사용하지 않고도 템퍼몽키 스크립트를 저장하신다면 [X_MODIFY]를 앞에 붙여 이런 식의 수정이 가능합니다.

+++)기존 배포되던 잡담 API의 인식 범위가 커 해당 API와 충돌된다는 제보가 있어 코드를 수정하였습니다. 만약 문제가 발생한다면 코드 교체 바랍니다!

주요 기능
!X (수정할 내용) 명령어를 통해 직전에 전송한 메시지의 내용을 즉시 변경합니다.
세션 중 실시간 채팅창뿐만 아니라, 채팅 로그 페이지에서도 수정된 상태를 유지합니다.`,
            usage: {
                description: `입력 예시:
: 오타가 섞인 대사르 전송합니다.

!X 오타가 섞인 대사를 전송합니다.

이용 시 주의사항
1. 로컬 렌더링 방식의 스크립트는 서버의 원본 데이터를 물리적으로 수정하는 것이 아니라, 사용자의 브라우저에 표시되는 화면을 실시간으로 가공하는 방식입니다. 따라서 본 스크립트를 설치하지 않은 플레이어의 화면에는 수정 전의 원본 메시지와 명령어 태그가 그대로 노출됩니다. 가급적 모든 참여자가 함께 설치하는 것을 권장합니다.
2. 혼선을 방지하기 위해, 각 저널이 보낸 가장 마지막 메시지 1개에 대해서만 수정을 허용합니다.`,
                images: ["/images/editor.gif"]
            }
        },
        code: '', // Not used directly, using additionalCodeBlocks below
        additionalCodeBlocks: [
            {
                title: '1. Roll20 API Script (GM용)',
                code: `on("chat:message", function(msg) {
    // !X 또는 !x로 시작하는지 확인 (대소문자 무시)
    // "!X " 뒤에 한 칸의 공백이 있어야 작동합니다.
    if (msg.type === "api" && msg.content.toLowerCase().indexOf("!x ") === 0) {
        
        // "!x " 이후의 글자만 가져옵니다. (길이가 3이므로 substring(3))
        let edit_val = msg.content.substring(3).trim();
        
        // 내용이 없으면 중단
        if (!edit_val) return;

        // 템퍼몽키가 인식할 수 있도록 [X_MODIFY] 태그를 붙여서 전송
        // msg.who를 그대로 전달해야 템퍼몽키가 이전 메시지 화자와 비교할 수 있습니다.
        sendChat(msg.who, "[X_MODIFY] " + edit_val);
    }
});`
            },
            {
                title: '2. Tampermonkey UserScript (GM+PL용)',
                code: `// ==UserScript==
// @name         RUSRoll20 EDIT
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description
// @author
// @match        https://app.roll20.net/editor/
// @match        https://app.roll20.net/campaigns/chatarchive/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 이름 비교용 정규화 (GM 제거 및 공백 제거)
    function normalize(str) {
        return str ? str.replace(/\(GM\)/g, "").replace(/[^a-zA-Z0-9가-힣]/g, "").trim() : "";
    }

    function doReconstructEdit() {
        const allMsgNodes = document.querySelectorAll('.message');
        if (allMsgNodes.length === 0) return;

        let lastSpeaker = "";

        // 1. 모든 메시지 분석 및 화자 추적
        const msgData = Array.from(allMsgNodes).map(node => {
            const byNode = node.querySelector('.by');
            if (byNode) {
                lastSpeaker = normalize(byNode.innerText);
            }
            return {
                node: node,
                speaker: lastSpeaker,
                text: node.textContent || ""
            };
        });

        // 2. 역순으로 수정 명령어 찾기
        for (let i = msgData.length - 1; i >= 0; i--) {
            const current = msgData[i];

            if (current.text.includes("[X_MODIFY]") && current.node.style.display !== "none") {
                const newText = current.text.split("[X_MODIFY]")[1]?.trim();
                const targetSpeaker = current.speaker;

                // 명령어 메시지 자체는 즉시 숨김
                current.node.style.setProperty("display", "none", "important");

                // 3. 바로 위로 올라가며 같은 화자의 메시지 찾기
                for (let j = i - 1; j >= 0; j--) {
                    const prev = msgData[j];

                    if (prev.speaker === targetSpeaker && !prev.text.includes("[X_MODIFY]")) {
                        // 기존 노드에서 아바타와 이름표 HTML만
                        const avatarHtml = prev.node.querySelector('.avatar')?.outerHTML || "";
                        const byHtml = prev.node.querySelector('.by')?.outerHTML || "";

                        // 수정된 내용과 함께 부모 노드 재조립
                        const editedMark = ' <span style="color:#aaa; font-size:0.8em; font-style:italic; margin-left:5px;">(수정됨)</span>';

                        // 부모 노드의 내용 교체
                        prev.node.innerHTML = \`
                            &#36{avatarHtml}
                            &#36{byHtml}
                            <div class="content">&#36{newText}&#36{editedMark}</div>
                        \`;

                        console.log(\`[Reconstruct] &#36{targetSpeaker}의 메시지를 재조립하여 수정함.\`);
                        break;
                    }
                }
            }
        }
    }

    // 감시 및 실행
    const observer = new MutationObserver(doReconstructEdit);
    const start = () => {
        const target = document.querySelector('#textchat .content') || document.body;
        observer.observe(target, { childList: true, subtree: true });
        doReconstructEdit();
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start);

    // 로그 페이지 및 로딩 지연 대응용 (0.4초 간격)
    setInterval(doReconstructEdit, 400);
})();`
            }
        ]
    },
    'outside-avatar': {
        id: 'outside-avatar',
        title: '외부 아바타 주입기',
        subtitle: '롤20 용량과 관계 없이 이미지 링크로 아바타 이미지 변경이 가능합니다.',
        description: '주요 기능Roll20의 아트 라이브러리 용량을 소모하지 않고, 외부 이미지 URL을 통해 캐릭터 아바타를 즉시 변경합니다.',
        author: 'R',
        version: '1.0',
        updatedAt: '2026. 01. 13.',
        content: {
            introduction: `사용자의 브라우저에서만 바뀌는 것이 아니라, Roll20 서버의 캐릭터 속성을 직접 수정하므로 설치하지 않은 다른 플레이어들에게도 변경된 아바타가 정상적으로 노출됩니다.
            
설치 및 설정 방법

1. 확장 프로그램 설치
제공된 확장 프로그램 폴더(ZIP)를 다운로드하고 압축을 해제합니다.
크롬 브라우저에서 chrome://extensions/ 주소로 이동합니다.
우측 상단의 [개발자 모드]를 활성화합니다.
좌측 상단의 [압축해제된 확장 프로그램을 로드합니다] 버튼을 클릭하여 해제한 폴더를 선택합니다.

2. 실행 확인
Roll20 캠페인 페이지를 새로고침합니다.
우측 사이드바의 저널 탭을 클릭하면 최상단에 [이미지 외부에서 가져오기] 버튼이 생성됩니다.
`,
            usage: {
                description: `1. 사이드바 상단의 [이미지 외부에서 가져오기] 버튼을 클릭합니다.
2. 대상 캐릭터 이름: 아바타를 변경할 캐릭터 저널의 이름을 정확히 입력합니다. (대소문자 및 띄어쓰기 포함)
3. 이미지 주소: 디스코드 링크나 Imgur 등 외부 이미지의 주소를 입력합니다. (뒤가 PNG여야 인식이 되는 것으로 확인했습니다.) Base64 방식도 가능하나 조금 불안정합니다.
4. 확인: 성공 메시지가 뜨면 해당 캐릭터 시트를 닫았다가 다시 열어 변경된 아바타를 확인합니다.`,
                images: [
                    "/images/avatar.gif"
                ]
            }
        },
        code: `유료 전환 예정의 확장 프로그램이기에 이 사이트에서 배포하지 않습니다.
아래 링크를 참고해 주세요.

https://posty.pe/47fs9m
`
    },
};