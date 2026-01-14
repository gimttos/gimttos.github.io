import { ScriptItem, NavigationItem } from './types';
import {
    visualNovelHelper,
    autoAsSwitcher,
    cocChatPalette,
    hideDeletedMessages,
    messageEditScript,
    outsideAvatar,
    characterManager,
} from './scripts';

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
    { id: 'character-manager', label: 'CoC 7판 캐릭터 매니저', type: 'script' },
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
    'visual-novel-helper': visualNovelHelper,
    'auto-as-switcher': autoAsSwitcher,
    'coc-chat-palette': cocChatPalette,
    'hide-deleted-messages': hideDeletedMessages,
    'message-edit-script': messageEditScript,
    'outside-avatar': outsideAvatar,
    'character-manager': characterManager,
};
