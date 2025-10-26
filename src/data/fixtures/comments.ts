export const comments = [
  {
    id: '1',
    user: {
      id: '2',
      name: 'Bololol',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    content: "C'est un truc de fou en vrai ce que vous avez fait wow !",
    likesCount: 0,
  },
  {
    id: '2',
    user: {
      id: '3',
      name: 'Jeanne',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    },
    content: 'Incroyable !',
    likesCount: 5,
  },
  {
    id: '3',
    user: {
      id: '2',
      name: 'Bololol',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    content: 'Je suis tout à fait d’accord!',
    likesCount: 2,
    replyTo: {
      id: '3',
      name: 'Jeanne',
    },
    parentCommentId: '2',
  },
  {
    id: '4',
    user: {
      id: '4',
      name: 'Pierre',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    },
    content: 'Super travail !',
    likesCount: 10,
  },
];
