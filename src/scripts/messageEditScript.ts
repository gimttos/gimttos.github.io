import { ScriptItem } from '../types';

export const messageEditScript: ScriptItem = {
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
    code: '',
    additionalCodeBlocks: [
        {
            title: '1. Roll20 API Script (GM용)',
            code: `on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.toLowerCase().indexOf("!x ") === 0) {
        let edit_val = msg.content.substring(3).trim();
        if (!edit_val) return;
        sendChat(msg.who, "[X_MODIFY] " + edit_val);
    }
});`,
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

    function normalize(str) {
        return str ? str.replace(/\\(GM\\)/g, "").replace(/[^a-zA-Z0-9가-힣]/g, "").trim() : "";
    }

    function doReconstructEdit() {
        const allMsgNodes = document.querySelectorAll('.message');
        if (allMsgNodes.length === 0) return;

        let lastSpeaker = "";
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

        for (let i = msgData.length - 1; i >= 0; i--) {
            const current = msgData[i];
            if (current.text.includes("[X_MODIFY]") && current.node.style.display !== "none") {
                const newText = current.text.split("[X_MODIFY]")[1]?.trim();
                const targetSpeaker = current.speaker;
                current.node.style.setProperty("display", "none", "important");

                for (let j = i - 1; j >= 0; j--) {
                    const prev = msgData[j];
                    if (prev.speaker === targetSpeaker && !prev.text.includes("[X_MODIFY]")) {
                        const avatarHtml = prev.node.querySelector('.avatar')?.outerHTML || "";
                        const byHtml = prev.node.querySelector('.by')?.outerHTML || "";
                        const editedMark = ' <span style="color:#aaa; font-size:0.8em; font-style:italic; margin-left:5px;">(수정됨)</span>';
                        prev.node.innerHTML = \`\${avatarHtml}\${byHtml}<div class="content">\${newText}\${editedMark}</div>\`;
                        console.log(\`[Reconstruct] \${targetSpeaker}의 메시지를 재조립하여 수정함.\`);
                        break;
                    }
                }
            }
        }
    }

    const observer = new MutationObserver(doReconstructEdit);
    const start = () => {
        const target = document.querySelector('#textchat .content') || document.body;
        observer.observe(target, { childList: true, subtree: true });
        doReconstructEdit();
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start);
    setInterval(doReconstructEdit, 400);
})();`,
        },
    ],
};
