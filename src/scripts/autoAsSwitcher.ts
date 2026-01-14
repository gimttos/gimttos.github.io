import { ScriptItem } from '../types';

export const autoAsSwitcher: ScriptItem = {
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
})();`,
};
