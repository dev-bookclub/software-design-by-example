export default {
  rules: {
    'header-match-team-pattern': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'header-match-team-pattern': ({ header }) => {
          // 허용된 GitHub 아이디 목록
          const allowedIds = [
            'dhyun2',
            'kwonboryong',
            'sunjoolee',
            'yu-ratel',
            'ksh200070',
            '5622lsk',
            'Kimkyungmin123',
            'hoseokna',
            'eunjeong90',
            'jadugamja',
          ];

          // 정규식을 사용하여 커밋 메시지 패턴 검사
          const pattern = /^\[([a-zA-Z0-9_-]+)\/(\d+주차|chore)\]:\s(.+)$/;
          const match = header.match(pattern);

          if (!match) {
            return [
              false,
              '커밋 메시지는 "[githubid/N주차]: 설명" 또는 "[githubid/chore]: 설명" 형식을 따라야 합니다.',
            ];
          }

          const [, githubId] = match;

          if (!allowedIds.includes(githubId)) {
            return [
              false,
              `허용되지 않은 GitHub 아이디입니다: ${githubId}. 사용 가능한 아이디: ${allowedIds.join(
                ', '
              )}`,
            ];
          }

          return [true, ''];
        },
      },
    },
  ],
};
