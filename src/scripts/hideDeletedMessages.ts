import { ScriptItem } from '../types';

export const hideDeletedMessages: ScriptItem = {
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
})();`,
};
