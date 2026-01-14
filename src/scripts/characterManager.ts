import { ScriptItem } from '../types';

export const characterManager: ScriptItem = {
    id: 'character-manager',
    title: 'CoC 7판 전용 캐릭터 저장/불러오기 확장 프로그램',
    subtitle: '캐릭터 시트의 정보를 저장해두었다가 불러올 수 있습니다.',
    description: '롤20 CoC 7판 공식 시트에 대응하는 캐릭터 저장/불러오기 매니저 확장 프로그램',
    author: 'O',
    version: '1.0',
    updatedAt: '2026. 01. 14.',
    content: {
        introduction: `정식 명칭은 Roll20 CoC 7th Character Manager입니다.

확장 프로그램 로드 후 반드시 한 번은 롤방을 새로고침해야 합니다. 캐릭터 시트를 열면 저장과 불러오기 버튼이 뜨고, 저장 버튼을 누르는 것으로 시트의 내용을 저장해둘 수 있습니다. 다른 시트에서 불러오기 버튼을 누르는 것으로 시트의 내용을 붙여넣을 수 있습니다.

CoC 7판이어도 커스텀 시트를 사용하는 롤방에서의 작동을 보장하지 않습니다!!
다만 공식 시트와 유사한 형태의 커스텀 시트라면 불러왔을 때 얼추(세세한 무기 정보 제외) 대부분의 정보가 반영됩니다(그렇지만 저장은 공식 시트를 사용하는 방에서 하는 편을 추천합니다). 한 캐릭터로 많은 CoC 세션을 다니는 분이 사용하시면 좋습니다.

최대한 가볍게 경량화 해보았습니다만 코드 더 낫게 고칠 수 있으면 그렇게 고쳐서 쓰시면 됩니다. 재배포도 상관 없습니다. 버그 리포트나 개선사항은 괘념치 말고 바로바로 말씀 주세요.`,
        usage: {
            description: ``,
            images: [
                "/images/bookmark.gif"
            ]
        }
    },
    code: `zip 파일은 포스타입에서 배포하고 있습니다.
https://posty.pe/2i0zht`,
};
