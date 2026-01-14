import { ScriptItem } from '../types';

export const visualNovelHelper: ScriptItem = {
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

        const emotMatch = val.match(/\\s?@([^\\s]+)$$/);

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
})();`,
};
